#!/usr/bin/env python3
"""
URL → Markdown 转换脚本
用法: python3 scripts/url2md.py "https://example.com/article"
输出: JSON {"title": "...", "description": "...", "content": "..."}
"""

import sys
import json
import re
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
}

# 各平台的 CSS 选择器配置
PLATFORM_SELECTORS = {
    "blog.csdn.net": {
        "content": ["#content_views"],
        "title": [".title-article", "#articleContentId"],
        "noise": [".hide-article-box", ".blog-tags-box", ".recommend-box"],
    },
    "zhuanlan.zhihu.com": {
        "content": [".Post-RichText", ".RichContent-inner"],
        "title": [".Post-Title"],
        "noise": [".ContentItem-actions", ".Reward"],
    },
    "www.zhihu.com": {
        "content": [".Post-RichText", ".RichContent-inner"],
        "title": [".Post-Title", ".QuestionHeader-title"],
        "noise": [".ContentItem-actions"],
    },
    "juejin.cn": {
        "content": [".article-content", "#article-root"],
        "title": [".article-title"],
        "noise": [".article-suspended-panel", ".recommended-area"],
    },
    "www.jianshu.com": {
        "content": ["article", "._2rhmJa"],
        "title": ["._1RuRku", "h1"],
        "noise": [".note-comment", "._13lIbp"],
    },
    "www.cnblogs.com": {
        "content": ["#cnblogs_post_body"],
        "title": ["#cb_post_title_url", ".postTitle"],
        "noise": [".postDesc", "#blog_post_info_block"],
    },
    "mp.weixin.qq.com": {
        "content": ["#js_content"],
        "title": ["#activity-name"],
        "noise": ["#js_pc_qr_code", "#js_profile_qrcode"],
    },
    "sspai.com": {
        "content": [".article-body", ".wangEditor-txt"],
        "title": [".title", "h1"],
        "noise": [".relate-reading", ".article-footer"],
    },
}

# 通用 fallback 选择器
GENERIC_SELECTORS = {
    "content": ["article", "main", ".post-content", ".article-content",
                ".entry-content", ".post-body", "#content", ".content"],
    "title": ["h1", "title"],
    "noise": ["nav", "header", "footer", ".sidebar", ".comment", ".ad",
              ".share", ".related", "script", "style", "noscript"],
}


def get_platform(url: str) -> str | None:
    """从 URL 中提取平台域名"""
    host = urlparse(url).hostname or ""
    for platform in PLATFORM_SELECTORS:
        if platform in host:
            return platform
    return None


def fetch_html(url: str) -> str:
    """获取网页 HTML，失败时自动回退到 Wayback Machine"""
    # 第一次尝试：直接请求
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15, allow_redirects=True)
        if resp.status_code == 200 and len(resp.text) > 1000:
            # 检查是否是真实内容（非 JS 挑战页）
            if "<noscript>" not in resp.text[:500] and "window.onload=setTimeout" not in resp.text[:500]:
                return resp.text
    except requests.RequestException:
        pass

    # 第二次尝试：Wayback Machine
    wayback_url = f"https://web.archive.org/web/2024/{url}"
    try:
        resp = requests.get(wayback_url, headers=HEADERS, timeout=20, allow_redirects=True)
        if resp.status_code == 200 and len(resp.text) > 1000:
            return resp.text
    except requests.RequestException:
        pass

    raise RuntimeError(f"无法获取页面内容: {url}")


def fix_lazy_images(soup: BeautifulSoup) -> None:
    """修复懒加载图片：将 data-src 等属性还原为 src"""
    for img in soup.find_all("img"):
        # 常见懒加载属性：data-src, data-original-src, data-actualsrc, data-original
        real_src = (
            img.get("data-src")
            or img.get("data-original-src")
            or img.get("data-actualsrc")
            or img.get("data-original")
            or img.get("data-lazy-src")
        )
        current_src = img.get("src", "")

        # 如果 src 是占位图（base64 gif/空），用 data-src 替换
        if real_src and (
            not current_src
            or current_src.startswith("data:image")
            or len(current_src) < 10
        ):
            img["src"] = real_src

        # 清理 Wayback Machine URL 前缀
        src = img.get("src", "")
        if "web.archive.org/web/" in src:
            # 提取原始 URL: https://web.archive.org/web/20240101im_/https://real-url
            import re as _re
            cleaned = _re.sub(r"https?://web\.archive\.org/web/\d+[a-z_]*/", "", src)
            if cleaned:
                img["src"] = cleaned


def extract_content(html: str, url: str) -> dict:
    """从 HTML 中提取标题、描述和正文"""
    soup = BeautifulSoup(html, "html.parser")

    # 修复懒加载图片
    fix_lazy_images(soup)

    platform = get_platform(url)
    selectors = PLATFORM_SELECTORS.get(platform, {}) if platform else {}

    # 先移除噪音元素
    noise_selectors = selectors.get("noise", []) + GENERIC_SELECTORS["noise"]
    for sel in noise_selectors:
        for el in soup.select(sel):
            el.decompose()

    # 提取标题
    title = ""
    title_selectors = selectors.get("title", []) + GENERIC_SELECTORS["title"]
    for sel in title_selectors:
        el = soup.select_one(sel)
        if el and el.get_text(strip=True):
            title = el.get_text(strip=True)
            break

    # 提取 meta description
    description = ""
    meta_desc = soup.find("meta", attrs={"name": "description"})
    if meta_desc and meta_desc.get("content"):
        description = meta_desc["content"].strip()

    # 提取正文 HTML
    content_html = None
    content_selectors = selectors.get("content", []) + GENERIC_SELECTORS["content"]
    for sel in content_selectors:
        el = soup.select_one(sel)
        if el and len(el.get_text(strip=True)) > 100:
            content_html = str(el)
            break

    if not content_html:
        # 最后的 fallback：取 body
        body = soup.find("body")
        content_html = str(body) if body else str(soup)

    # HTML → Markdown
    content_md = html_to_markdown(content_html)

    # 如果没有 description，从正文前 150 字提取
    if not description and content_md:
        plain = re.sub(r"[#*`\[\]()!\n>-]", "", content_md)
        plain = re.sub(r"\s+", "", plain)
        description = plain[:150]

    return {
        "title": title,
        "description": description,
        "content": content_md,
    }


def html_to_markdown(html: str) -> str:
    """将 HTML 转换为干净的 GFM Markdown"""
    result = md(
        html,
        heading_style="ATX",
        code_language_callback=detect_code_language,
    )

    # 清理多余空行
    result = re.sub(r"\n{3,}", "\n\n", result)
    # 清理行尾空格
    result = re.sub(r"[ \t]+$", "", result, flags=re.MULTILINE)
    # 去除 Wayback Machine 注入的内容
    result = re.sub(r"https?://web\.archive\.org/web/\d+[a-z_]*/", "", result)

    return result.strip()


def detect_code_language(el) -> str | None:
    """尝试从 class 属性检测代码语言"""
    classes = el.get("class", []) if hasattr(el, "get") else []
    for cls in classes:
        if isinstance(cls, str):
            # 常见模式: language-python, lang-js, highlight-python
            match = re.match(r"(?:language|lang|highlight)-(\w+)", cls)
            if match:
                return match.group(1)
            # prism/hljs 模式
            if cls in ("python", "javascript", "java", "cpp", "c", "go",
                       "rust", "typescript", "bash", "shell", "sql", "html",
                       "css", "json", "yaml", "xml", "ruby", "php", "kotlin",
                       "swift", "scala", "r", "matlab", "lua", "perl"):
                return cls
    return None


def has_real_images(html: str) -> bool:
    """检查 HTML 中是否包含有意义的图片"""
    soup = BeautifulSoup(html, "html.parser")
    for img in soup.find_all("img"):
        src = img.get("src", "")
        # 过滤掉占位图、表情包、小图标等
        if src and not any(x in src.lower() for x in
                          ["emoticon", "emoji", "icon", "avatar", "logo",
                           "loading", "placeholder", "data:image/gif"]):
            return True
    return False


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "用法: python3 scripts/url2md.py <URL>"}),
              file=sys.stderr)
        sys.exit(1)

    url = sys.argv[1].strip()
    if not url.startswith("http"):
        url = "https://" + url

    try:
        html = fetch_html(url)
        result = extract_content(html, url)

        if not result["content"]:
            print(json.dumps({"error": "无法提取文章内容"}, ensure_ascii=False),
                  file=sys.stderr)
            sys.exit(1)

        print(json.dumps(result, ensure_ascii=False, indent=2))
    except Exception as e:
        print(json.dumps({"error": str(e)}, ensure_ascii=False), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()

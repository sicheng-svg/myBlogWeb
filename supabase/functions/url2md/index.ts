// Supabase Edge Function: URL → Markdown
// 部署: supabase functions deploy url2md
// 或通过 Supabase Dashboard → Edge Functions 创建

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
};

// 各平台 CSS 选择器
const PLATFORM_SELECTORS: Record<
  string,
  { content: string[]; title: string[]; noise: string[] }
> = {
  "blog.csdn.net": {
    content: ["#content_views"],
    title: [".title-article"],
    noise: [".hide-article-box", ".blog-tags-box", ".recommend-box"],
  },
  "zhuanlan.zhihu.com": {
    content: [".Post-RichText", ".RichContent-inner"],
    title: [".Post-Title"],
    noise: [".ContentItem-actions"],
  },
  "juejin.cn": {
    content: [".article-content", "#article-root"],
    title: [".article-title"],
    noise: [".article-suspended-panel", ".recommended-area"],
  },
  "www.jianshu.com": {
    content: ["article"],
    title: ["h1"],
    noise: [".note-comment"],
  },
  "www.cnblogs.com": {
    content: ["#cnblogs_post_body"],
    title: ["#cb_post_title_url", ".postTitle"],
    noise: [".postDesc"],
  },
  "mp.weixin.qq.com": {
    content: ["#js_content"],
    title: ["#activity-name"],
    noise: ["#js_pc_qr_code"],
  },
};

const GENERIC_CONTENT = ["article", "main", ".post-content", ".article-content", ".entry-content", "#content"];
const GENERIC_TITLE = ["h1"];
const GENERIC_NOISE = ["nav", "header", "footer", ".sidebar", ".comment", ".ad", ".share", ".related", "script", "style", "noscript"];

function getPlatform(url: string): string | null {
  try {
    const host = new URL(url).hostname;
    for (const platform of Object.keys(PLATFORM_SELECTORS)) {
      if (host.includes(platform)) return platform;
    }
  } catch { /* ignore */ }
  return null;
}

async function fetchHtml(url: string): Promise<string> {
  // 尝试直接请求
  try {
    const resp = await fetch(url, { headers: HEADERS, redirect: "follow" });
    if (resp.ok) {
      const text = await resp.text();
      if (text.length > 1000 && !text.includes("window.onload=setTimeout")) {
        return text;
      }
    }
  } catch { /* fall through */ }

  // 回退 Wayback Machine
  const waybackUrl = `https://web.archive.org/web/2024/${url}`;
  const resp = await fetch(waybackUrl, { headers: HEADERS, redirect: "follow" });
  if (!resp.ok) throw new Error(`无法获取页面: ${resp.status}`);
  const text = await resp.text();
  if (text.length < 500) throw new Error("页面内容为空");
  return text;
}

function htmlToMarkdown(html: string): string {
  // 简化的 HTML → Markdown 转换
  let md = html;

  // 移除 script/style
  md = md.replace(/<script[\s\S]*?<\/script>/gi, "");
  md = md.replace(/<style[\s\S]*?<\/style>/gi, "");
  md = md.replace(/<!--[\s\S]*?-->/g, "");

  // 标题
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "\n# $1\n");
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n## $1\n");
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n### $1\n");
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, "\n#### $1\n");
  md = md.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, "\n##### $1\n");
  md = md.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, "\n###### $1\n");

  // 代码块 - 处理 <pre><code> 模式
  md = md.replace(/<pre[^>]*>\s*<code[^>]*class="[^"]*(?:language|lang|highlight)-(\w+)[^"]*"[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi,
    "\n```$1\n$2\n```\n");
  md = md.replace(/<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi, "\n```\n$1\n```\n");
  md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, "\n```\n$1\n```\n");

  // 行内代码
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`");

  // 粗体/斜体
  md = md.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**");
  md = md.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, "**$1**");
  md = md.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "*$1*");
  md = md.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, "*$1*");
  md = md.replace(/<del[^>]*>([\s\S]*?)<\/del>/gi, "~~$1~~");

  // 链接
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)");

  // 图片
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, "![$2]($1)");
  md = md.replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, "![$1]($2)");
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, "![]($1)");

  // 列表
  md = md.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n");
  md = md.replace(/<\/?[ou]l[^>]*>/gi, "\n");

  // 引用
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, content) => {
    return content.split("\n").map((line: string) => `> ${line}`).join("\n") + "\n";
  });

  // 水平线
  md = md.replace(/<hr[^>]*\/?>/gi, "\n---\n");

  // 段落和换行
  md = md.replace(/<br[^>]*\/?>/gi, "\n");
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "\n$1\n");
  md = md.replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, "\n$1\n");

  // 表格
  md = md.replace(/<th[^>]*>([\s\S]*?)<\/th>/gi, "| $1 ");
  md = md.replace(/<td[^>]*>([\s\S]*?)<\/td>/gi, "| $1 ");
  md = md.replace(/<\/tr>/gi, "|\n");
  md = md.replace(/<tr[^>]*>/gi, "");
  md = md.replace(/<\/?(?:table|thead|tbody)[^>]*>/gi, "\n");

  // 移除剩余 HTML 标签
  md = md.replace(/<[^>]+>/g, "");

  // HTML 实体
  md = md.replace(/&amp;/g, "&");
  md = md.replace(/&lt;/g, "<");
  md = md.replace(/&gt;/g, ">");
  md = md.replace(/&quot;/g, '"');
  md = md.replace(/&#39;/g, "'");
  md = md.replace(/&nbsp;/g, " ");
  md = md.replace(/&#xff0c;/g, "，");
  md = md.replace(/&#xff01;/g, "！");
  md = md.replace(/&#\d+;/g, "");

  // 清理 Wayback Machine URL
  md = md.replace(/https?:\/\/web\.archive\.org\/web\/\d+[a-z_]*\//g, "");

  // 清理多余空行和空格
  md = md.replace(/[ \t]+$/gm, "");
  md = md.replace(/\n{3,}/g, "\n\n");

  return md.trim();
}

function fixLazyImages(html: string): string {
  // 修复懒加载图片：将 data-src 等属性还原为 src
  // 匹配 <img> 标签，提取 data-src/data-original 等属性
  return html.replace(/<img([^>]*)>/gi, (match, attrs) => {
    const dataSrc =
      attrs.match(/data-src=["']([^"']+)["']/i)?.[1] ||
      attrs.match(/data-original-src=["']([^"']+)["']/i)?.[1] ||
      attrs.match(/data-actualsrc=["']([^"']+)["']/i)?.[1] ||
      attrs.match(/data-original=["']([^"']+)["']/i)?.[1] ||
      attrs.match(/data-lazy-src=["']([^"']+)["']/i)?.[1];

    const currentSrc = attrs.match(/src=["']([^"']+)["']/i)?.[1] || "";

    if (dataSrc && (!currentSrc || currentSrc.startsWith("data:image") || currentSrc.length < 10)) {
      // 替换 src 为真实图片 URL
      let cleanSrc = dataSrc.replace(/https?:\/\/web\.archive\.org\/web\/\d+[a-z_]*\//g, "");
      if (attrs.match(/src=["']/i)) {
        attrs = attrs.replace(/src=["'][^"']*["']/i, `src="${cleanSrc}"`);
      } else {
        attrs += ` src="${cleanSrc}"`;
      }
    } else if (currentSrc.includes("web.archive.org/web/")) {
      const cleanSrc = currentSrc.replace(/https?:\/\/web\.archive\.org\/web\/\d+[a-z_]*\//g, "");
      attrs = attrs.replace(/src=["'][^"']*["']/i, `src="${cleanSrc}"`);
    }

    return `<img${attrs}>`;
  });
}

function extractContent(html: string, url: string) {
  // 修复懒加载图片
  html = fixLazyImages(html);

  const platform = getPlatform(url);
  const selectors = platform ? PLATFORM_SELECTORS[platform] : null;

  // 提取标题
  let title = "";
  const titleSelectors = [...(selectors?.title || []), ...GENERIC_TITLE];
  for (const sel of titleSelectors) {
    // 简单的 CSS 选择器匹配
    const match = matchSelector(html, sel);
    if (match) {
      title = stripTags(match).trim();
      if (title) break;
    }
  }

  // fallback: <title> 标签
  if (!title) {
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (titleMatch) {
      title = stripTags(titleMatch[1]).trim().split("-")[0].split("_")[0].trim();
    }
  }

  // 提取 meta description
  let description = "";
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*?)["']/i);
  if (descMatch) description = descMatch[1].trim();

  // 移除噪音元素
  let cleanHtml = html;
  const noiseSelectors = [...(selectors?.noise || []), ...GENERIC_NOISE];
  for (const sel of noiseSelectors) {
    cleanHtml = removeBySelector(cleanHtml, sel);
  }

  // 提取正文
  let contentHtml = "";
  const contentSelectors = [...(selectors?.content || []), ...GENERIC_CONTENT];
  for (const sel of contentSelectors) {
    const match = matchSelector(cleanHtml, sel);
    if (match && stripTags(match).trim().length > 100) {
      contentHtml = match;
      break;
    }
  }

  if (!contentHtml) {
    // fallback: body
    const bodyMatch = cleanHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    contentHtml = bodyMatch ? bodyMatch[1] : cleanHtml;
  }

  const content = htmlToMarkdown(contentHtml);

  // 如果没有 description，从正文提取
  if (!description && content) {
    const plain = content.replace(/[#*`\[\]()!\n>-]/g, "").replace(/\s+/g, "");
    description = plain.substring(0, 150);
  }

  return { title, description, content };
}

// 简单的 CSS 选择器匹配（支持 #id, .class, tagname）
function matchSelector(html: string, selector: string): string | null {
  let pattern: RegExp;

  if (selector.startsWith("#")) {
    const id = selector.slice(1);
    pattern = new RegExp(`<[^>]+id=["']${escapeRegex(id)}["'][^>]*>([\\s\\S]*?)(?=<\\/[a-z]+>\\s*(?:<[a-z]|$))`, "i");
    // 更好的方法：匹配开闭标签
    const openMatch = html.match(new RegExp(`<(\\w+)[^>]*id=["']${escapeRegex(id)}["'][^>]*>`, "i"));
    if (openMatch) {
      const tag = openMatch[1];
      const startIdx = html.indexOf(openMatch[0]);
      const inner = extractInnerHtml(html, startIdx, tag);
      if (inner) return inner;
    }
  } else if (selector.startsWith(".")) {
    const cls = selector.slice(1);
    const openMatch = html.match(new RegExp(`<(\\w+)[^>]*class=["'][^"']*\\b${escapeRegex(cls)}\\b[^"']*["'][^>]*>`, "i"));
    if (openMatch) {
      const tag = openMatch[1];
      const startIdx = html.indexOf(openMatch[0]);
      const inner = extractInnerHtml(html, startIdx, tag);
      if (inner) return inner;
    }
  } else {
    // 标签名
    const openMatch = html.match(new RegExp(`<(${escapeRegex(selector)})[^>]*>`, "i"));
    if (openMatch) {
      const tag = openMatch[1];
      const startIdx = html.indexOf(openMatch[0]);
      const inner = extractInnerHtml(html, startIdx, tag);
      if (inner) return inner;
    }
  }

  return null;
}

function extractInnerHtml(html: string, startIdx: number, tag: string): string | null {
  // 找到匹配的闭合标签（简单计数法）
  const openPattern = new RegExp(`<${tag}[\\s>]`, "gi");
  const closePattern = new RegExp(`</${tag}>`, "gi");

  let depth = 0;
  let i = startIdx;
  const contentStart = html.indexOf(">", startIdx) + 1;

  // 重新扫描
  openPattern.lastIndex = startIdx;
  closePattern.lastIndex = startIdx;

  let openMatch = openPattern.exec(html);
  let closeMatch = closePattern.exec(html);

  depth = 1; // 已经遇到一个开标签
  const searchStart = contentStart;

  while (depth > 0 && (openMatch || closeMatch)) {
    const openPos = openMatch && openMatch.index > startIdx ? openMatch.index : Infinity;
    const closePos = closeMatch ? closeMatch.index : Infinity;

    if (openPos < closePos && openPos > startIdx) {
      depth++;
      openMatch = openPattern.exec(html);
    } else if (closePos < Infinity) {
      depth--;
      if (depth === 0) {
        return html.substring(contentStart, closeMatch!.index);
      }
      closeMatch = closePattern.exec(html);
    } else {
      break;
    }
  }

  // 简单 fallback：取前 5000 字符
  return html.substring(contentStart, contentStart + 5000);
}

function removeBySelector(html: string, selector: string): string {
  const match = matchSelector(html, selector);
  if (match) {
    html = html.replace(match, "");
  }
  return html;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/&[^;]+;/g, " ").trim();
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    const { url } = await req.json();
    if (!url) {
      return new Response(
        JSON.stringify({ error: "缺少 url 参数" }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
    const html = await fetchHtml(normalizedUrl);
    const result = extractContent(html, normalizedUrl);

    if (!result.content) {
      return new Response(
        JSON.stringify({ error: "无法提取文章内容" }),
        { status: 422, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
});

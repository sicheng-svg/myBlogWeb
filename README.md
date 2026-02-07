# XSC Blog

个人博客网站，基于 React + Supabase 全栈构建，部署于 Vercel。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 19 + TypeScript (strict mode) |
| 构建工具 | Vite 7 |
| 样式 | Tailwind CSS v4 + shadcn/ui |
| 动画 | Motion (motion/react) |
| 路由 | react-router-dom v7 |
| 后端服务 | Supabase (PostgreSQL + Auth + Storage + Edge Functions) |
| 部署 | Vercel |
| Markdown | @uiw/react-md-editor + react-markdown + remark-gfm + rehype-highlight |

## 项目结构

```
src/
├── components/
│   ├── Navbar.tsx              # 顶部导航栏
│   ├── WelcomeSection.tsx      # 首页欢迎区域
│   ├── ProfileSection.tsx      # 个人信息区域
│   ├── BlogCarousel.tsx        # 博客轮播组件
│   ├── ContributionGraph.tsx   # GitHub 贡献图
│   ├── Footer.tsx              # 页脚（社交链接）
│   ├── ScrollToTop.tsx         # 路由切换时滚动到顶部
│   ├── admin/                  # 后台管理组件
│   │   ├── AdminLayout.tsx     # 后台布局（侧边栏 + 内容区）
│   │   ├── AdminSidebar.tsx    # 后台侧边栏导航
│   │   ├── ProtectedRoute.tsx  # 鉴权路由守卫
│   │   ├── PostForm.tsx        # 文章编辑表单（含 URL 导入）
│   │   ├── PostsTable.tsx      # 文章列表表格
│   │   ├── MarkdownEditor.tsx  # Markdown 编辑器
│   │   ├── ImageUploader.tsx   # 图片上传组件
│   │   ├── CategoriesManager.tsx # 分类管理
│   │   └── TagsManager.tsx     # 标签管理
│   ├── ui/                     # shadcn/ui 组件（勿手动编辑）
│   └── figma/                  # Figma Make 工具组件
├── pages/
│   ├── Home.tsx                # 首页
│   ├── AllBlogPosts.tsx        # 博客列表页
│   ├── BlogDetail.tsx          # 博客详情页（Markdown 渲染）
│   └── admin/
│       ├── AdminLogin.tsx      # 后台登录
│       ├── AdminDashboard.tsx  # 后台仪表盘
│       ├── AdminPostsList.tsx  # 文章管理
│       ├── AdminPostEditor.tsx # 文章编辑
│       ├── AdminCategories.tsx # 分类管理
│       ├── AdminTags.tsx       # 标签管理
│       └── AdminSettings.tsx   # 个人设置
├── hooks/
│   ├── useAuth.ts              # 登录/登出/会话管理
│   ├── usePosts.ts             # 文章 CRUD
│   ├── useCategories.ts        # 分类 CRUD
│   ├── useTags.ts              # 标签 CRUD
│   ├── useSiteSettings.ts      # 站点设置读写
│   └── useImageUpload.ts       # 图片上传到 Supabase Storage
├── lib/
│   ├── supabase.ts             # Supabase 客户端初始化
│   └── database.types.ts       # 数据库类型定义
├── styles/
│   └── globals.css             # Tailwind v4 主题配置
├── App.tsx                     # 路由配置
└── main.tsx                    # 入口文件

scripts/
├── url2md.py                   # URL → Markdown 转换脚本（Python）
└── import-post.ts              # CLI 导入文章脚本

supabase/functions/
└── url2md/index.ts             # Supabase Edge Function（服务端 URL 抓取）
```

## 路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | Home | 首页（欢迎区 + 个人信息 + 博客轮播） |
| `/blogs` | AllBlogPosts | 博客列表（网格展示） |
| `/blogs/:slug` | BlogDetail | 博客详情（Markdown 渲染） |
| `/admin/login` | AdminLogin | 后台登录 |
| `/admin` | AdminDashboard | 后台仪表盘 |
| `/admin/posts` | AdminPostsList | 文章管理列表 |
| `/admin/posts/new` | AdminPostEditor | 新建文章 |
| `/admin/posts/:id/edit` | AdminPostEditor | 编辑文章 |
| `/admin/categories` | AdminCategories | 分类管理 |
| `/admin/tags` | AdminTags | 标签管理 |
| `/admin/settings` | AdminSettings | 个人设置 |

## 功能特性

### 前台
- 响应式首页，含欢迎区、个人信息、博客轮播
- GitHub 贡献图展示
- 博客列表页，支持分类筛选
- 博客详情页，Markdown 渲染 + 代码高亮
- 暗色/亮色主题

### 后台管理
- Supabase Auth 邮箱密码登录，路由守卫保护
- 文章 CRUD：Markdown 编辑器、封面图上传、分类/标签选择、发布/草稿切换
- **URL 导入**：输入文章 URL，自动提取标题、摘要和正文，转为 Markdown
- 分类管理：增删改
- 标签管理：增删改
- 个人设置：动态配置首页内容（站点名称、座右铭、头像、背景图、社交链接等）

### URL 导入功能
支持从多个平台导入文章，自动处理反爬和格式转换：

| 平台 | 支持情况 |
|------|---------|
| CSDN | 通过 Wayback Machine 绕过 Cloudflare 521 |
| 知乎（专栏/问答） | 直接抓取 |
| 掘金 | 直接抓取 |
| 简书 | 直接抓取 |
| 博客园 | 直接抓取 |
| 微信公众号 | 直接抓取 |
| 少数派 | 直接抓取 |
| 其他网站 | 通用选择器 fallback |

## 数据库设计

使用 Supabase PostgreSQL，包含以下表：

```
posts            # 文章
├── id (uuid, PK)
├── slug (text, unique)
├── title (text)
├── summary (text)
├── content (text)           # Markdown 正文
├── cover_image (text)       # 封面图 URL
├── category_id (uuid, FK → categories)
├── published (boolean)
├── published_at (timestamptz)
├── created_at (timestamptz)
└── updated_at (timestamptz)

categories       # 分类
├── id (uuid, PK)
├── name (text)
├── slug (text, unique)
└── created_at (timestamptz)

tags             # 标签
├── id (uuid, PK)
├── name (text)
├── slug (text, unique)
└── created_at (timestamptz)

post_tags        # 文章-标签关联（多对多）
├── post_id (uuid, FK → posts)
└── tag_id (uuid, FK → tags)

site_settings    # 站点设置（键值对）
├── key (text, PK)
├── value (text)
└── updated_at (timestamptz)
```

### Storage

- `blog-images` bucket：存储文章封面图和正文图片

## 本地开发

### 前提条件

- Node.js 18+
- Python 3.10+（仅 URL 导入脚本需要）

### 安装与运行

```bash
# 安装依赖
npm install

# 创建环境变量文件
cp .env.example .env.local
# 编辑 .env.local，填入 Supabase 项目信息：
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  (仅脚本使用)

# 启动开发服务器
npm run dev        # http://localhost:5173

# 生产构建
npm run build

# 预览构建产物
npm run preview
```

### Python 脚本依赖（可选）

```bash
pip3 install requests beautifulsoup4 markdownify
```

## Supabase 配置

### 1. 创建项目

在 [supabase.com](https://supabase.com) 创建新项目，获取 Project URL 和 API Keys。

### 2. 创建数据库表

在 Supabase SQL Editor 中执行以下 SQL：

```sql
-- 分类表
CREATE TABLE categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- 标签表
CREATE TABLE tags (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- 文章表
CREATE TABLE posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text DEFAULT '',
  content text DEFAULT '',
  cover_image text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 文章-标签关联表
CREATE TABLE post_tags (
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- 站点设置表
CREATE TABLE site_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);
```

### 3. 配置 RLS 策略

```sql
-- 开启 RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 公开读取已发布文章
CREATE POLICY "Public read published posts" ON posts
  FOR SELECT USING (published = true);

-- 管理员完全访问
CREATE POLICY "Admin full access posts" ON posts
  FOR ALL USING (auth.role() = 'authenticated');

-- 分类/标签/设置：公开读取，管理员写入
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin manage categories" ON categories FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public read tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Admin manage tags" ON tags FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public read post_tags" ON post_tags FOR SELECT USING (true);
CREATE POLICY "Admin manage post_tags" ON post_tags FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin manage site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
```

### 4. 创建 Storage Bucket

```sql
-- 创建公开的图片存储桶
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);

-- Storage RLS 策略
CREATE POLICY "Public read images" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Auth upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth delete images" ON storage.objects
  FOR DELETE USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');
```

### 5. 部署 Edge Function（URL 导入）

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login

# 关联项目
supabase link --project-ref your-project-ref

# 部署 Edge Function
supabase functions deploy url2md

# 在 Supabase Dashboard 中关闭该函数的 JWT 验证
# Dashboard → Edge Functions → url2md → Settings → 关闭 "Enforce JWT Verification"
```

### 6. 创建管理员账号

在 Supabase Dashboard → Authentication → Users → Add User，创建邮箱密码用户。

## Vercel 部署

### 1. 导入项目

1. 登录 [vercel.com](https://vercel.com)
2. Import Git Repository → 选择 `myBlogWeb`
3. Framework Preset 会自动识别为 Vite

### 2. 配置环境变量

在 Vercel 项目 Settings → Environment Variables 中添加：

| 变量名 | 值 |
|--------|-----|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `your-anon-key` |

### 3. SPA 路由

项目已包含 `vercel.json`，配置了 SPA 路由重写规则，所有路径都回退到 `index.html`：

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 4. 自动部署

连接 GitHub 仓库后，每次 push 到 `main` 分支都会自动触发 Vercel 构建和部署。

## 常用命令

```bash
npm run dev          # 启动开发服务器
npm run build        # TypeScript 检查 + 生产构建
npm run preview      # 预览生产构建

# URL → Markdown 转换（Python）
python3 scripts/url2md.py "https://blog.csdn.net/xxx/article/details/xxx"
```

## License

MIT

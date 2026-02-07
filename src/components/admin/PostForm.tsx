import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Link as LinkIcon } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { MarkdownEditor } from './MarkdownEditor';
import { createPost, updatePost, type PostWithRelations } from '@/hooks/usePosts';
import { fetchCategories } from '@/hooks/useCategories';
import { fetchTags } from '@/hooks/useTags';
import { toast } from 'sonner';
import type { Category, Tag } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

async function fetchUrlContent(url: string) {
  let normalized = url.trim();
  if (!/^https?:\/\//i.test(normalized)) normalized = 'https://' + normalized;

  // 优先使用 Supabase Edge Function（服务端抓取，无 CORS 限制）
  try {
    const { data, error } = await supabase.functions.invoke('url2md', {
      body: { url: normalized },
    });

    if (!error && data && (data.title || data.content)) {
      return {
        title: (data.title || '').trim(),
        description: (data.description || '').trim(),
        content: (data.content || '').trim(),
      };
    }
  } catch {
    // Edge Function 不可用，回退 Jina Reader
  }

  // 回退：Jina Reader API
  const res = await fetch(`https://r.jina.ai/${normalized}`, {
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`请求失败 (${res.status})`);

  const json = await res.json();
  if (json.code !== 200 || !json.data) throw new Error('无法解析该网页内容');

  const title = (json.data.title || '').trim();
  const content = (json.data.content || '').trim();

  if (!title && !content) {
    throw new Error('该网页内容为空，可能被反爬虫机制拦截。请尝试其他URL或手动粘贴内容。');
  }

  return {
    title,
    description: (json.data.description || '').trim(),
    content,
  };
}

interface PostFormProps {
  post?: PostWithRelations;
}

export function PostForm({ post }: PostFormProps) {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [summary, setSummary] = useState(post?.summary ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [coverImage, setCoverImage] = useState(post?.cover_image ?? '');
  const [categoryId, setCategoryId] = useState(post?.category_id ?? '');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    post?.post_tags?.map((pt) => pt.tags.id) ?? []
  );
  const [published, setPublished] = useState(post?.published ?? false);

  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
    fetchTags().then(setTags).catch(() => {});
  }, []);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!post) {
      setSlug(generateSlug(value));
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleImportFromUrl = async () => {
    if (!importUrl.trim()) {
      toast.error('请输入URL');
      return;
    }
    setImporting(true);
    try {
      const result = await fetchUrlContent(importUrl);
      setTitle(result.title);
      setSlug(generateSlug(result.title));
      setSummary(result.description);
      setContent(result.content);
      toast.success('导入成功，请检查并编辑内容');
      setImportDialogOpen(false);
      setImportUrl('');
    } catch (err) {
      toast.error('导入失败：' + (err as Error).message);
    } finally {
      setImporting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !slug.trim()) {
      toast.error('标题和 Slug 不能为空');
      return;
    }

    setSaving(true);
    try {
      const postData = {
        title,
        slug,
        summary,
        content,
        cover_image: coverImage || null,
        category_id: categoryId || null,
        published,
        published_at: published ? (post?.published_at ?? new Date().toISOString()) : null,
      };

      if (post) {
        await updatePost(post.id, postData, selectedTagIds);
        toast.success('文章已更新');
      } else {
        await createPost(postData, selectedTagIds);
        toast.success('文章已创建');
      }

      navigate('/admin/posts');
    } catch (err) {
      toast.error('保存失败：' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* URL 导入 - 仅新建模式 */}
      {!post && (
        <>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setImportDialogOpen(true)}
            >
              <LinkIcon className="h-4 w-4" />
              从URL导入
            </Button>
          </div>

          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>从URL导入文章</DialogTitle>
                <DialogDescription>
                  输入文章URL，自动提取标题、摘要和正文内容
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  placeholder="https://example.com/article"
                  disabled={importing}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleImportFromUrl();
                    }
                  }}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setImportDialogOpen(false)}
                  disabled={importing}
                >
                  取消
                </Button>
                <Button
                  type="button"
                  onClick={handleImportFromUrl}
                  disabled={importing || !importUrl.trim()}
                >
                  {importing ? '解析中...' : '解析'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* 标题 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
        <Input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="文章标题"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Slug（URL 标识）</label>
        <Input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="article-slug"
        />
      </div>

      {/* 摘要 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">摘要</label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="文章简短描述..."
          rows={3}
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1"
        />
      </div>

      {/* 分类 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1"
        >
          <option value="">无分类</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* 标签 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                selectedTagIds.includes(tag.id)
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
              }`}
            >
              {tag.name}
            </button>
          ))}
          {tags.length === 0 && (
            <p className="text-sm text-gray-400">暂无标签，请先在标签管理中添加</p>
          )}
        </div>
      </div>

      {/* 封面图 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">封面图</label>
        <ImageUploader value={coverImage} onChange={setCoverImage} />
      </div>

      {/* Markdown 正文 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">正文内容</label>
        <MarkdownEditor value={content} onChange={setContent} />
      </div>

      {/* 发布开关 */}
      <div className="flex items-center gap-3">
        <Switch checked={published} onCheckedChange={setPublished} />
        <label className="text-sm font-medium text-gray-700">
          {published ? '已发布' : '草稿'}
        </label>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? '保存中...' : post ? '更新文章' : '创建文章'}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate('/admin/posts')}>
          取消
        </Button>
      </div>
    </form>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, FolderOpen, Tag, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export function AdminDashboard() {
  const [stats, setStats] = useState({ posts: 0, published: 0, drafts: 0, categories: 0, tags: 0 });

  useEffect(() => {
    const loadStats = async () => {
      const [postsRes, publishedRes, catsRes, tagsRes] = await Promise.all([
        supabase.from('posts').select('id', { count: 'exact', head: true }),
        supabase.from('posts').select('id', { count: 'exact', head: true }).eq('published', true),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('tags').select('id', { count: 'exact', head: true }),
      ]);

      const total = postsRes.count ?? 0;
      const pub = publishedRes.count ?? 0;

      setStats({
        posts: total,
        published: pub,
        drafts: total - pub,
        categories: catsRes.count ?? 0,
        tags: tagsRes.count ?? 0,
      });
    };

    loadStats();
  }, []);

  const cards = [
    { label: '全部文章', value: stats.posts, icon: FileText, color: 'text-blue-600 bg-blue-50' },
    { label: '已发布', value: stats.published, icon: FileText, color: 'text-green-600 bg-green-50' },
    { label: '草稿', value: stats.drafts, icon: FileText, color: 'text-gray-600 bg-gray-50' },
    { label: '分类', value: stats.categories, icon: FolderOpen, color: 'text-purple-600 bg-purple-50' },
    { label: '标签', value: stats.tags, icon: Tag, color: 'text-orange-600 bg-orange-50' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">仪表盘</h1>
        <Button asChild>
          <Link to="/admin/posts/new">
            <Plus className="h-4 w-4 mr-1" /> 新建文章
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg border bg-white p-5">
            <div className={`inline-flex p-2 rounded-lg ${card.color} mb-3`}>
              <card.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostsTable } from '@/components/admin/PostsTable';
import { fetchAllPosts, type PostWithRelations } from '@/hooks/usePosts';

export function AdminPostsList() {
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await fetchAllPosts();
      setPosts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">文章管理</h1>
        <Button asChild>
          <Link to="/admin/posts/new">
            <Plus className="h-4 w-4 mr-1" /> 新建文章
          </Link>
        </Button>
      </div>

      {loading ? (
        <p className="text-gray-400">加载中...</p>
      ) : (
        <PostsTable posts={posts} onRefresh={load} />
      )}
    </div>
  );
}

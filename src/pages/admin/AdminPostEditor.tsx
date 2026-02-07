import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PostForm } from '@/components/admin/PostForm';
import { fetchPostById, type PostWithRelations } from '@/hooks/usePosts';

export function AdminPostEditor() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const [post, setPost] = useState<PostWithRelations | null>(null);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (id) {
      fetchPostById(id)
        .then(setPost)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <p className="text-gray-400">加载中...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {isEdit ? '编辑文章' : '新建文章'}
      </h1>
      <PostForm post={post ?? undefined} />
    </div>
  );
}

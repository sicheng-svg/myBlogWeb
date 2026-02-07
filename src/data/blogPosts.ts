import type { Post } from '@/lib/database.types';

// 公共页面展示用的简化类型
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  image: string;
  date: string;
}

// 将 Supabase Post 转换为公共页面使用的 BlogPost
export function toDisplayPost(post: Post): BlogPost {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    content: post.summary,
    image: post.cover_image || '',
    date: post.published_at
      ? new Date(post.published_at).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '',
  };
}

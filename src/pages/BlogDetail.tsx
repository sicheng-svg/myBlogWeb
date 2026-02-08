import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { CodeBlock } from '../components/CodeBlock';
import { fetchPostBySlug } from '@/hooks/usePosts';
import { springTransition } from '@/lib/motion';
import type { Post } from '@/lib/database.types';

export function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetchPostBySlug(slug)
      .then(setPost)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto animate-pulse space-y-6">
          <div className="bg-gray-200 h-6 w-32 rounded" />
          <div className="bg-gray-200 h-10 w-3/4 rounded" />
          <div className="bg-gray-200 h-4 w-40 rounded" />
          <div className="bg-gray-200 h-80 rounded-lg" />
          <div className="space-y-3">
            <div className="bg-gray-200 h-4 w-full rounded" />
            <div className="bg-gray-200 h-4 w-5/6 rounded" />
            <div className="bg-gray-200 h-4 w-4/6 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <p className="text-xl text-gray-500 mb-8">博文未找到</p>
          <Link to="/blogs" className="text-blue-600 hover:text-blue-700 font-medium">
            ← 返回全部博文
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="min-h-screen bg-white pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springTransition}
        >
          <Link
            to="/blogs"
            className="inline-block text-blue-600 hover:text-blue-700 font-medium mb-8"
          >
            ← 返回全部博文
          </Link>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <p className="text-gray-500 mb-8">{formattedDate}</p>

          {post.cover_image && (
            <div className="rounded-lg overflow-hidden mb-10">
              <ImageWithFallback
                src={post.cover_image}
                alt={post.title}
                className="w-full h-80 object-cover"
              />
            </div>
          )}

          <article className="prose prose-gray max-w-none">
            <Markdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                pre: ({ children, ...rest }) => (
                  <CodeBlock {...rest}>{children}</CodeBlock>
                ),
              }}
            >
              {post.content}
            </Markdown>
          </article>
        </motion.div>
      </div>
    </div>
  );
}

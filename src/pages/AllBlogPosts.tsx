import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BlogCard } from '../components/BlogCard';
import { toDisplayPost, type BlogPost } from '../data/blogPosts';
import { fetchPublishedPosts } from '@/hooks/usePosts';
import { springTransition } from '@/lib/motion';

export function AllBlogPosts() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublishedPosts()
      .then((posts) => setBlogPosts(posts.map(toDisplayPost)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springTransition}
        >
          <h1 className="text-4xl font-semibold text-gray-900 mb-12 text-center">全部博文</h1>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-lg" />
                <div className="p-6 space-y-3">
                  <div className="bg-gray-200 h-4 w-24 rounded" />
                  <div className="bg-gray-200 h-6 w-3/4 rounded" />
                  <div className="bg-gray-200 h-4 w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springTransition, delay: index * 0.08 }}
              >
                <BlogCard blog={blog} />
              </motion.div>
            ))}
          </div>
        )}

        {!loading && blogPosts.length === 0 && (
          <p className="text-center text-gray-400 py-16">暂无已发布的博文</p>
        )}
      </div>
    </div>
  );
}

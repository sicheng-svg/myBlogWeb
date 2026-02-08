import { Link } from 'react-router-dom';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Calendar, ArrowRight } from 'lucide-react';
import type { BlogPost } from '@/data/blogPosts';
import { cn } from '@/components/ui/utils';

interface BlogCardProps {
  blog: BlogPost;
  className?: string;
  imageHeight?: string;
}

export function BlogCard({ blog, className, imageHeight = 'h-48' }: BlogCardProps) {
  return (
    <Link to={`/blogs/${blog.slug}`} className={cn('block h-full group', className)}>
      <div className="h-full backdrop-blur-md bg-white/70 border border-white/40 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 flex flex-col shadow-lg">
        {/* 封面图 */}
        <div className={cn('relative shrink-0 overflow-hidden', imageHeight)}>
          <ImageWithFallback
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* 内容 */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>{blog.date}</span>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {blog.title}
          </h3>

          <p className="text-gray-500 leading-relaxed flex-grow line-clamp-3">
            {blog.content}
          </p>

          <div className="mt-4 flex items-center gap-1.5 text-blue-600 font-medium text-sm group-hover:gap-3 transition-all">
            阅读更多
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

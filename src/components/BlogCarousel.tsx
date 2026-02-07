import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toDisplayPost, type BlogPost } from '../data/blogPosts';
import { fetchPublishedPosts } from '@/hooks/usePosts';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function BlogCarousel() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetchPublishedPosts()
      .then((posts) => setBlogPosts(posts.slice(0, 6).map(toDisplayPost)))
      .catch(() => {});
  }, []);

  return (
    <div className="px-4 flex items-center bg-white">
      <div className="max-w-[1400px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-semibold text-gray-900 mb-12 text-center">博客文章</h2>

          <div className="relative">
            <Carousel
              opts={{
                loop: true,
                align: "center",
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-8">
                {blogPosts.map((blog) => (
                  <CarouselItem
                    key={blog.id}
                    className="pl-8 md:basis-[650px] grow-0 shrink-0"
                  >
                    <div className="h-full bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all duration-300 flex flex-col shadow-md">
                      <div className="relative h-80 shrink-0">
                        <ImageWithFallback
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-8 flex flex-col flex-grow">
                        <p className="text-sm text-gray-500 mb-3">{blog.date}</p>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                          {blog.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed flex-grow">
                          {blog.content}
                        </p>
                        <Link to={`/blogs/${blog.slug}`} className="mt-6 text-left text-blue-600 hover:text-blue-700 transition-colors font-medium">
                          阅读更多 →
                        </Link>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="absolute left-4 md:left-12 bg-white/90 hover:bg-white text-gray-800 border-gray-200 shadow-md h-12 w-12 z-10" />
              <CarouselNext className="absolute right-4 md:right-12 bg-white/90 hover:bg-white text-gray-800 border-gray-200 shadow-md h-12 w-12 z-10" />
            </Carousel>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

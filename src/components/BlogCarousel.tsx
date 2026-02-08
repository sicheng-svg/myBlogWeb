import { useState, useEffect } from 'react';
import { ScrollReveal } from './ScrollReveal';
import { BlogCard } from './BlogCard';
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
        <ScrollReveal>
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
                    <BlogCard blog={blog} imageHeight="h-80" />
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="absolute left-4 md:left-12 bg-white/90 hover:bg-white text-gray-800 border-gray-200 shadow-md h-12 w-12 z-10" />
              <CarouselNext className="absolute right-4 md:right-12 bg-white/90 hover:bg-white text-gray-800 border-gray-200 shadow-md h-12 w-12 z-10" />
            </Carousel>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

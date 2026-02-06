import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { blogPosts } from '../data/blogPosts';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function BlogCarousel() {

  return (
    // 1. 背景修改：bg-[#0d1117] -> bg-transparent (直接透出 App.tsx 的白底) 或 bg-white
    <div className="px-4 flex items-center bg-white">
      <div className="max-w-[1400px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* 标题颜色：text-white -> text-gray-900 */}
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
                    {/* 卡片样式修改：
                        1. bg-[#161b22] -> bg-white (白卡片)
                        2. border-gray-700 -> border-gray-200 (浅灰边框)
                        3. 添加 shadow-lg 让白卡片在白背景上突显出来
                    */}
                    <div className="h-full bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all duration-300 flex flex-col shadow-md">
                      
                      {/* Image */}
                      <div className="relative h-80 shrink-0">
                        <ImageWithFallback
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-8 flex flex-col flex-grow">
                        {/* 日期颜色：text-gray-400 -> text-gray-500 */}
                        <p className="text-sm text-gray-500 mb-3">{blog.date}</p>
                        
                        {/* 标题颜色：text-white -> text-gray-900 */}
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                          {blog.title}
                        </h3>
                        
                        {/* 摘要颜色：text-gray-300 -> text-gray-600 */}
                        <p className="text-gray-600 leading-relaxed flex-grow">
                          {blog.content}
                        </p>
                        
                        {/* 按钮颜色：保持蓝色，或者稍微加深 */}
                        <button className="mt-6 text-left text-blue-600 hover:text-blue-700 transition-colors font-medium">
                          阅读更多 →
                        </button>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {/* Navigation Buttons */}
              {/* 按钮样式修改：改为浅色风格以适应白底 */}
              <CarouselPrevious className="absolute left-4 md:left-12 bg-white/90 hover:bg-white text-gray-800 border-gray-200 shadow-md h-12 w-12 z-10" />
              <CarouselNext className="absolute right-4 md:right-12 bg-white/90 hover:bg-white text-gray-800 border-gray-200 shadow-md h-12 w-12 z-10" />
            </Carousel>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
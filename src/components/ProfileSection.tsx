import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ContributionGraph } from './ContributionGraph';

export function ProfileSection() {
  return (
    <div 
      className="px-4 py-32 relative bg-cover bg-center flex items-center" // py-16 -> py-32 稍微增加内部上下内边距，让背景图露出的更多一点
      style={{
        // 你可以把这里的图片换成一张比较素雅、适合黑色文字的图片
        backgroundImage: 'url("/background2.jpg")',
      }}
    >
      {/* ❌ 已删除：白色遮罩层 */}
      
      <div className="max-w-6xl mx-auto relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
            
            {/* 头像 */}
            <div className="flex-shrink-0">
              <ImageWithFallback
                src="/avatar.jpg" 
                alt="Profile"
                className="w-64 h-64 rounded-full object-cover border-4 border-white shadow-xl"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-4xl font-semibold text-white mb-2 leading-tight">你好，我是 XSC</h2>
              <p className="text-xl text-white/70 mb-6">xia_sicheng@163.com</p>
              <p className="text-lg text-white max-w-2xl leading-relaxed font-medium">
                一名热衷于探索前沿技术的全栈开发者。我喜欢用代码构建优雅的用户体验，并致力于开源社区的贡献。
              </p>
            </div>
          </div>

          <ContributionGraph />
        </motion.div>
      </div>
    </div>
  );
}
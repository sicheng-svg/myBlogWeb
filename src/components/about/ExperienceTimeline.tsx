import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ScrollReveal } from '@/components/ScrollReveal';
import type { Experience } from '@/data/resume';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { Briefcase } from 'lucide-react';

function TimelineItem({
  experience,
}: {
  experience: Experience;
}) {
  return (
    <motion.div variants={fadeInUp} className="relative pl-10 md:pl-16 pb-12 last:pb-0">
      {/* 时间线节点 */}
      <div className="absolute left-0 md:left-4 top-1 w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center z-10">
        <Briefcase className="w-4 h-4 text-white" />
      </div>

      {/* 内容卡片 */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{experience.role}</h3>
          <span className="text-sm text-gray-400 mt-1 sm:mt-0">{experience.period}</span>
        </div>
        <p className="text-blue-600 font-medium text-sm mb-3">{experience.company}</p>
        <p className="text-gray-600 mb-4">{experience.description}</p>

        <ul className="space-y-2 mb-4">
          {experience.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              {h}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2">
          {experience.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function ExperienceTimeline({ experience }: { experience: Experience[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 50%'],
  });

  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="py-20 px-4 bg-gray-50/50">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">工作经历</h2>
          <p className="text-gray-500">我的职业成长路径</p>
        </ScrollReveal>

        <div ref={containerRef} className="relative">
          {/* 中轴线（灰色底线 + 滚动绘制深色线） */}
          <div className="absolute left-3.5 md:left-7.5 top-0 bottom-0 w-0.5 bg-gray-200">
            <motion.div
              className="w-full bg-gray-900 origin-top"
              style={{ scaleY: lineScaleY, height: '100%' }}
            />
          </div>

          {/* 经历项 */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {experience.map((exp) => (
              <TimelineItem key={exp.id} experience={exp} />
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}

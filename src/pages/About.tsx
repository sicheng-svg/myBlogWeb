import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { ExperienceTimeline } from '@/components/about/ExperienceTimeline';
import { SkillsMatrix } from '@/components/about/SkillsRadar';
import { Education } from '@/components/about/Education';
import { springTransition } from '@/lib/motion';
import { fetchSettings } from '@/hooks/useSiteSettings';
import { fetchAboutData, type AboutData } from '@/hooks/useAboutData';
import { resumeData } from '@/data/resume';

export function About() {
  const [avatar, setAvatar] = useState('/avatar.jpg');
  const [about, setAbout] = useState<AboutData>({
    name: resumeData.name,
    title: resumeData.title,
    bio: resumeData.bio,
    resumeUrl: '/resume.pdf',
    skills: resumeData.skills,
    experience: resumeData.experience,
    education: resumeData.education,
  });

  useEffect(() => {
    fetchSettings().then((s) => setAvatar(s.avatar));
    fetchAboutData().then(setAbout);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={springTransition}
            className="mb-8 inline-block"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-2xl scale-110" />
              <ImageWithFallback
                src={avatar}
                alt={about.name}
                className="relative w-40 h-40 rounded-full object-cover border-4 border-white shadow-2xl"
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.2 }}
            className="text-5xl font-bold text-gray-900 mb-4"
          >
            {about.name}
            <span className="inline-block w-0.5 h-10 bg-blue-500 ml-2 align-middle animate-pulse" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.3 }}
            className="text-xl text-gray-500 mb-3"
          >
            {about.title}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.4 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto mb-10"
          >
            {about.bio}
          </motion.p>

          <motion.a
            href={about.resumeUrl}
            download
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.5 }}
            whileHover={{
              y: -3,
              boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)',
            }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-full font-medium text-lg hover:bg-gray-800 transition-colors"
          >
            <Download className="w-5 h-5" />
            下载简历
          </motion.a>
        </div>
      </section>

      <ExperienceTimeline experience={about.experience} />
      <SkillsMatrix skills={about.skills} />
      <Education education={about.education} />
    </div>
  );
}

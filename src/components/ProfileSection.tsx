import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ContributionGraph } from './ContributionGraph';
import { fetchSettings } from '@/hooks/useSiteSettings';

export function ProfileSection() {
  const [authorName, setAuthorName] = useState('你好，我是 XSC');
  const [authorBio, setAuthorBio] = useState('一名热衷于探索前沿技术的全栈开发者。我喜欢用代码构建优雅的用户体验，并致力于开源社区的贡献。');
  const [email, setEmail] = useState('xia_sicheng@163.com');
  const [avatar, setAvatar] = useState('/avatar.jpg');
  const [profileBg, setProfileBg] = useState('/background2.jpg');

  useEffect(() => {
    fetchSettings().then((s) => {
      setAuthorName(s.author_name);
      setAuthorBio(s.author_bio);
      setEmail(s.email);
      setAvatar(s.avatar);
      setProfileBg(s.profile_bg);
    });
  }, []);

  return (
    <div
      className="px-4 py-32 relative bg-cover bg-center flex items-center"
      style={{
        backgroundImage: `url("${profileBg}")`,
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
                src={avatar}
                alt="Profile"
                className="w-64 h-64 rounded-full object-cover border-4 border-white shadow-xl"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-4xl font-semibold text-white mb-2 leading-tight">{authorName}</h2>
              <p className="text-xl text-white/70 mb-6">{email}</p>
              <p className="text-lg text-white max-w-2xl leading-relaxed font-medium">
                {authorBio}
              </p>
            </div>
          </div>

          <ContributionGraph />
        </motion.div>
      </div>
    </div>
  );
}
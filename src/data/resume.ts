export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
  techStack: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  url?: string;
}


export interface ResumeData {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  skills: string[];
  experience: Experience[];
  projects: Project[];
  education: {
    school: string;
    degree: string;
    period: string;
    major: string;
  }[];
}

export const resumeData: ResumeData = {
  name: 'XSC',
  title: '全栈开发工程师',
  tagline: '用代码构建优雅的数字体验',
  bio: '一名热衷于探索前沿技术的全栈开发者。专注于 React 生态和现代 Web 开发，喜欢将设计思维融入工程实践。',
  skills: [
    'React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Vue.js',
    'Node.js', 'Python', 'PostgreSQL', 'Supabase',
    'Docker', 'Git', 'Figma',
  ],
  experience: [
    {
      id: 'exp-1',
      role: '前端开发工程师',
      company: 'ABC 科技有限公司',
      period: '2023.06 - 至今',
      description: '负责公司核心产品的前端架构设计与开发，推动前端工程化和组件化建设。',
      highlights: [
        '主导完成产品 UI 全面重构，用户满意度提升 35%',
        '搭建内部组件库，提高团队开发效率 40%',
        '实现前端性能优化，首屏加载时间降低 60%',
      ],
      techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    },
    {
      id: 'exp-2',
      role: '全栈开发实习生',
      company: 'XYZ 创新工作室',
      period: '2022.07 - 2023.05',
      description: '参与多个 Web 应用的全栈开发，积累了从前端到后端的完整开发经验。',
      highlights: [
        '独立完成 3 个中小型项目的开发与部署',
        '学习并实践 CI/CD 流程，实现自动化部署',
      ],
      techStack: ['Vue.js', 'Node.js', 'MongoDB', 'Docker'],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: '个人博客系统',
      description: '基于 React + Supabase 的全栈博客系统，支持 Markdown 编辑、分类标签、后台管理等功能。',
      techStack: ['React', 'TypeScript', 'Supabase', 'Tailwind CSS'],
      url: 'https://github.com/sicheng-svg/myBlogWeb',
    },
  ],
  education: [
    {
      school: 'XX 大学',
      degree: '本科',
      period: '2020.09 - 2024.06',
      major: '计算机科学与技术',
    },
  ],
};

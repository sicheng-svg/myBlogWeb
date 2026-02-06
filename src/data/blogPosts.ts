export interface BlogPost {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'React 19 新特性解析',
    content: '深入探讨 React 19 带来的革命性更新，包括新的编译器优化、服务器组件改进以及更强大的并发渲染能力。',
    image: 'https://images.unsplash.com/photo-1652696290920-ee4c836c711e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjB3b3Jrc3BhY2UlMjBsYXB0b3B8ZW58MXx8fHwxNzcwMzE4MjczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    date: '2026年2月1日'
  },
  {
    id: '2',
    title: 'TypeScript 最佳实践指南',
    content: '从类型安全到代码组织，全面介绍 TypeScript 在大型项目中的最佳实践。学习如何编写更健壮、可维护的代码。',
    image: 'https://images.unsplash.com/photo-1688413709025-5f085266935a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZWNobm9sb2d5JTIwYWJzdHJhY3R8ZW58MXx8fHwxNzcwMjYwMTIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    date: '2026年1月25日'
  },
  {
    id: '3',
    title: '构建高性能 Web 应用',
    content: '探索现代 Web 应用性能优化的核心策略，包括代码分割、懒加载、缓存策略和渲染优化。',
    image: 'https://images.unsplash.com/photo-1531498860502-7c67cf02f657?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGRldmVsb3BtZW50JTIwY29kZXxlbnwxfHx8fDE3NzAzMDI5MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    date: '2026年1月18日'
  },
  {
    id: '4',
    title: '设计系统的艺术与科学',
    content: '从零开始构建可扩展的设计系统，涵盖组件库设计、设计令牌管理、文档编写和团队协作。',
    image: 'https://images.unsplash.com/photo-1769839271199-7730bc8c22dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwaW5ub3ZhdGlvbiUyMGRlc2lnbnxlbnwxfHx8fDE3NzAzMDI5MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    date: '2026年1月10日'
  }
];

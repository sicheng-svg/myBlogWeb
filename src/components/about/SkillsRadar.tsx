import { ScrollReveal } from '@/components/ScrollReveal';

export function SkillsMatrix({ skills }: { skills: string[] }) {
  if (skills.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">技能矩阵</h2>
          <p className="text-gray-500">我的技术栈</p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-200 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

import { ScrollReveal } from '@/components/ScrollReveal';
import { GraduationCap } from 'lucide-react';

interface EducationItem {
  school: string;
  degree: string;
  period: string;
  major: string;
}

export function Education({ education }: { education: EducationItem[] }) {
  if (education.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">教育背景</h2>
        </ScrollReveal>
        <div className="space-y-6">
          {education.map((edu, i) => (
            <ScrollReveal key={i}>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{edu.school}</h3>
                    <span className="text-sm text-gray-400">{edu.period}</span>
                  </div>
                  <p className="text-gray-600">
                    {edu.major} · {edu.degree}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

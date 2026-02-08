import { fetchSettings } from './useSiteSettings';
import { resumeData, type Experience } from '@/data/resume';

export interface AboutData {
  name: string;
  title: string;
  bio: string;
  resumeUrl: string;
  skills: string[];
  experience: Experience[];
  education: { school: string; degree: string; period: string; major: string }[];
}

function tryParseJSON<T>(json: string | undefined, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

export async function fetchAboutData(): Promise<AboutData> {
  const s = await fetchSettings();

  return {
    name: s.about_name || resumeData.name,
    title: s.about_title || resumeData.title,
    bio: s.about_bio || resumeData.bio,
    resumeUrl: s.about_resume_url || '/resume.pdf',
    skills: tryParseJSON(s.about_skills, resumeData.skills),
    experience: tryParseJSON(s.about_experience, resumeData.experience),
    education: tryParseJSON(s.about_education, resumeData.education),
  };
}

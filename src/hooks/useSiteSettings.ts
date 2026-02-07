import { supabase } from '@/lib/supabase';

export type SiteSettings = Record<string, string>;

const DEFAULTS: SiteSettings = {
  site_name: 'XSC Blog',
  tagline: 'Explore My Digital World',
  welcome_bg: '/background1.jpg',
  profile_bg: '/background2.jpg',
  avatar: '/avatar.jpg',
  author_name: '你好，我是 XSC',
  author_bio:
    '一名热衷于探索前沿技术的全栈开发者。我喜欢用代码构建优雅的用户体验，并致力于开源社区的贡献。',
  email: 'xia_sicheng@163.com',
  github_url: 'https://github.com/sicheng-svg',
  github_username: 'sicheng-svg',
  csdn_url: 'https://blog.csdn.net/xsc2004zyj?spm=1000.2115.3001.5343',
};

export function getDefaults(): SiteSettings {
  return { ...DEFAULTS };
}

export async function fetchSettings(): Promise<SiteSettings> {
  const { data, error } = await (supabase
    .from('site_settings')
    .select('key, value') as any);

  if (error || !data) return { ...DEFAULTS };

  const settings: SiteSettings = { ...DEFAULTS };
  for (const row of data as { key: string; value: string }[]) {
    settings[row.key] = row.value;
  }
  return settings;
}

export async function updateSettings(
  entries: { key: string; value: string }[]
): Promise<void> {
  for (const entry of entries) {
    const { error } = await (supabase
      .from('site_settings')
      .upsert(
        { key: entry.key, value: entry.value, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      ) as any);
    if (error) throw new Error(`保存 ${entry.key} 失败: ${error.message}`);
  }
}

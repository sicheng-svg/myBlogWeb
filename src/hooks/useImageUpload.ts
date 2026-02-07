import { supabase } from '@/lib/supabase';

export async function uploadImage(file: File, path?: string) {
  // 提取扩展名，文件名用时间戳+随机数替代（避免中文/特殊字符）
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const fileName = path || safeName;
  const { data, error } = await supabase.storage
    .from('blog-images')
    .upload(fileName, file, { upsert: true });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('blog-images')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

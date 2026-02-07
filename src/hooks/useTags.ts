import { supabase } from '@/lib/supabase';
import type { Tag } from '@/lib/database.types';

export async function fetchTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name');

  if (error) throw error;
  return (data as Tag[]) ?? [];
}

export async function createTag(tag: { name: string; slug: string }) {
  const { data, error } = await supabase
    .from('tags')
    .insert(tag as any)
    .select()
    .single();

  if (error) throw error;
  return data as Tag;
}

export async function updateTag(id: string, updates: { name?: string; slug?: string }) {
  const { error } = await supabase
    .from('tags')
    .update(updates as any)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteTag(id: string) {
  const { error } = await supabase.from('tags').delete().eq('id', id);
  if (error) throw error;
}

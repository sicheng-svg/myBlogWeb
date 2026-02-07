import { supabase } from '@/lib/supabase';
import type { Category } from '@/lib/database.types';

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return (data as Category[]) ?? [];
}

export async function createCategory(category: { name: string; slug: string }) {
  const { data, error } = await supabase
    .from('categories')
    .insert(category as any)
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

export async function updateCategory(id: string, updates: { name?: string; slug?: string }) {
  const { error } = await supabase
    .from('categories')
    .update(updates as any)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

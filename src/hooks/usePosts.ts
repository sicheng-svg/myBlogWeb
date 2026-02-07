import { supabase } from '@/lib/supabase';
import type { Post, PostUpdate } from '@/lib/database.types';

export type PostWithRelations = Post & {
  categories: { id: string; name: string; slug: string } | null;
  post_tags: { tags: { id: string; name: string; slug: string } }[];
};

export async function fetchPublishedPosts(): Promise<PostWithRelations[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*, categories(*), post_tags(tags(*))')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as PostWithRelations[];
}

export async function fetchAllPosts(): Promise<PostWithRelations[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*, categories(*), post_tags(tags(*))')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as PostWithRelations[];
}

export async function fetchPostBySlug(slug: string): Promise<PostWithRelations | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*, categories(*), post_tags(tags(*))')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) return null;
  return data as unknown as PostWithRelations;
}

export async function fetchPostById(id: string): Promise<PostWithRelations> {
  const { data, error } = await supabase
    .from('posts')
    .select('*, categories(*), post_tags(tags(*))')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as unknown as PostWithRelations;
}

export async function createPost(
  post: {
    slug: string;
    title: string;
    summary?: string;
    content?: string;
    cover_image?: string | null;
    category_id?: string | null;
    published?: boolean;
    published_at?: string | null;
  },
  tagIds: string[] = []
) {
  const { data, error } = await supabase
    .from('posts')
    .insert(post as any)
    .select()
    .single();

  if (error) throw error;

  const created = data as unknown as Post;

  if (tagIds.length > 0) {
    const tagLinks = tagIds.map((tag_id) => ({ post_id: created.id, tag_id }));
    await supabase.from('post_tags').insert(tagLinks as any);
  }

  return created;
}

export async function updatePost(id: string, post: PostUpdate, tagIds?: string[]) {
  const { data, error } = await supabase
    .from('posts')
    .update(post as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  if (tagIds !== undefined) {
    await supabase.from('post_tags').delete().eq('post_id', id);
    if (tagIds.length > 0) {
      const tagLinks = tagIds.map((tag_id) => ({ post_id: id, tag_id }));
      await supabase.from('post_tags').insert(tagLinks as any);
    }
  }

  return data as unknown as Post;
}

export async function deletePost(id: string) {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
}

export async function togglePublish(id: string, published: boolean) {
  const update = {
    published,
    published_at: published ? new Date().toISOString() : null,
  };

  const { error } = await supabase
    .from('posts')
    .update(update as any)
    .eq('id', id);

  if (error) throw error;
}

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface PostInput {
  title: string;
  slug: string;
  summary: string;
  content: string;
  cover_image?: string | null;
  category_id?: string | null;
}

async function importPost(input: PostInput) {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      title: input.title,
      slug: input.slug,
      summary: input.summary,
      content: input.content,
      cover_image: input.cover_image ?? null,
      category_id: input.category_id ?? null,
      published: false,
      published_at: null,
    })
    .select()
    .single();

  if (error) {
    console.error('Insert failed:', error.message);
    process.exit(1);
  }

  console.log(`Post created successfully!`);
  console.log(`  ID:    ${data.id}`);
  console.log(`  Title: ${data.title}`);
  console.log(`  Slug:  ${data.slug}`);
  console.log(`  Status: Draft`);
}

// Parse CLI argument
const jsonArg = process.argv[2];
if (!jsonArg) {
  console.error('Usage: npx tsx scripts/import-post.ts \'{"title":"...","slug":"...","summary":"...","content":"..."}\'');
  process.exit(1);
}

try {
  const input = JSON.parse(jsonArg) as PostInput;

  if (!input.title || !input.slug || !input.content) {
    console.error('Required fields: title, slug, content');
    process.exit(1);
  }

  input.summary = input.summary || '';

  importPost(input);
} catch {
  console.error('Invalid JSON input');
  process.exit(1);
}

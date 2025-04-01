'use server';

import { createClient } from '@/lib/supabase/server';

export async function validateSlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug);

  return !data?.length && !error;
}

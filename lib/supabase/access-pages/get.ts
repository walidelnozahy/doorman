import { getAuthenticatedUser } from '@/lib/supabase/get-authenticate-user';
import { createClient } from '@/lib/supabase/server';
import { Page } from '@/utils/types';

/**
 * Fetch pages for the authenticated user
 */
export async function fetchPages(): Promise<Page[]> {
  try {
    const supabase = await createClient();
    // Get authenticated user
    const user = await getAuthenticatedUser(supabase);

    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error: any) {
    console.error('Error fetching pages:', error);
    throw error;
  }
}

// Fetch a page by ID (authenticated)
export async function fetchPage(pageId: string): Promise<Page | null> {
  try {
    const supabase = await createClient();
    await getAuthenticatedUser(supabase);
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', pageId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows found
      }
      throw error;
    }

    return data as Page;
  } catch (error) {
    console.error('Error fetching page:', error);
    throw error;
  }
}

// Fetch a public page by ID (no authentication required)
export async function fetchPublicPage(
  pageIdOrSlug: string,
): Promise<Page | null> {
  try {
    const supabase = await createClient();

    // Try fetching by ID first
    let { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', pageIdOrSlug)
      .single();

    if (error) {
      // If not found by ID, try fetching by slug
      const slugResult = await supabase
        .from('pages')
        .select('*')
        .eq('slug', pageIdOrSlug)
        .single();

      data = slugResult.data;
      error = slugResult.error;
    }

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows found by either ID or slug
      }
      throw error;
    }

    return data as Page;
  } catch (error) {
    console.error('Error fetching public page:', error);
    throw error;
  }
}

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

// Fetch a page by domain (no authentication required)
export async function fetchPageByDomain(domain: string): Promise<Page | null> {
  try {
    const supabase = await createClient();

    // First, look up the page_id associated with this domain
    const { data: domainRecord, error: domainError } = await supabase
      .from('custom_domains')
      .select('page_id')
      .eq('domain', domain)
      .eq('is_verified', true)
      .single();

    if (domainError || !domainRecord?.page_id) {
      return null;
    }

    // Then fetch the page using the page_id
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .select('*')
      .eq('id', domainRecord.page_id)
      .single();

    if (pageError) {
      if (pageError.code === 'PGRST116') {
        return null; // No rows found
      }
      throw pageError;
    }

    return page as Page;
  } catch (error) {
    console.error('Error fetching page by domain:', error);
    throw error;
  }
}

// Fetch a public page by ID or domain (no authentication required)
export async function fetchPublicPageById(
  pageIdOrDomain: string,
): Promise<Page | null> {
  try {
    const supabase = await createClient();

    // Try fetching by ID first
    let { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', pageIdOrDomain)
      .single();

    return data as Page;
  } catch (error) {
    console.error('Error fetching public page:', error);
    throw error;
  }
}

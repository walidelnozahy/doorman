'use server';

import { createClient } from '@/lib/supabase/server';
import { Connection } from '@/utils/types';

/**
 * Server action to fetch custom domains for a page
 */
export async function fetchCustomDomains(pageId: string) {
  try {
    if (!pageId) {
      return [];
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('custom_domains')
      .select('*')
      .eq('page_id', pageId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching custom domains:', error);
    throw error;
  }
}

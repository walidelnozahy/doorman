'use server';

import { createClient } from '@/lib/supabase/server';
import { Connection } from '@/utils/types';

/**
 * Server action to fetch connections for a page
 */
export async function fetchConnections(pageId: string): Promise<Connection[]> {
  try {
    if (!pageId) {
      return [];
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('connections')
      .select('*')
      .eq('page_id', pageId);

    if (error) {
      throw error;
    }

    return data as Connection[];
  } catch (error) {
    console.error('Error fetching connections:', error);
    throw error;
  }
}

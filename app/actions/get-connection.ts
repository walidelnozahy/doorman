'use server';

import { createClient } from '@/lib/supabase/server';
import { Connection } from '@/utils/types';

/**
 * Server action to fetch a connection by ID
 * This can be called from client components
 */
export async function getConnection(
  pageId: string,
  connectionId: string,
): Promise<{ data: Connection | null; error: string | null }> {
  try {
    if (!connectionId) {
      return { data: null, error: 'Connection ID is required' };
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('connections')
      .select('*')
      .eq('page_id', pageId)
      .eq('connection_id', connectionId)
      .single();
    console.log('error', error);
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found - return null data but no error
        return { data: null, error: null };
      }
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching connection:', error);
    return {
      data: null,
      error:
        error instanceof Error ? error.message : 'Failed to fetch connection',
    };
  }
}

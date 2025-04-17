import { createClient } from '@/lib/supabase/server';
import { Connection } from '@/utils/types';

// Fetch connections for a page directly from Supabase
export async function fetchConnections(pageId: string): Promise<Connection[]> {
  try {
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

// Fetch a connection by ID
export async function fetchConnectionById(
  pageId: string,
  connectionId: string,
): Promise<Connection | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('connections')
      .select('*')
      .eq('page_id', pageId)
      .eq('connection_id', connectionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows found
      }
      throw error;
    }

    return data as Connection;
  } catch (error) {
    console.error('Error fetching connection:', error);
    throw error;
  }
}

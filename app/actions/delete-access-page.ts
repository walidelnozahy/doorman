'use server';

import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from '@/lib/supabase/get-authenticate-user';
import { revalidatePath } from 'next/cache';

export async function deleteAccessPage(pageId: string) {
  try {
    if (!pageId) {
      return {
        success: false,
        error: { _global: 'Page ID is required' },
      };
    }

    // Get authenticated user
    const supabase = await createClient();
    const user = await getAuthenticatedUser(supabase);

    if (!user) {
      return {
        success: false,
        error: { _global: 'You must be logged in to delete a page' },
      };
    }

    // Delete the page
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', pageId)
      .eq('user_id', user.id); // Ensure user can only delete their own pages

    if (error) {
      return {
        success: false,
        error: { _global: error.message || 'Failed to delete page' },
      };
    }

    // Revalidate the pages list
    revalidatePath('/pages');

    return {
      success: true,
      error: null,
    };
  } catch (error: any) {
    console.error('Error deleting page:', error);
    return {
      success: false,
      error: { _global: error.message || 'An unexpected error occurred' },
    };
  }
}

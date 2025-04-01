'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { generateTemplate } from '@/utils/queries';
import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from '@/lib/supabase/get-authenticate-user';
import { createPageSchema } from '@/utils/schema/create-page-schema';

/**
 * 1. Get authenticated user
 * 2. Parse form data
 * 3. Create page
 * 4. Generate template
 * 5. Update page with template URL
 * 6. Revalidate cache
 */
export async function createAccessPage(prevState: any, formData: FormData) {
  let createdPage = null;
  const supabase = await createClient();
  try {
    /**
     * Check if user is authenticated
     */

    // Get authenticated user
    const user = await getAuthenticatedUser(supabase);

    /**
     * Parse form data and check validation
     */
    const parsedData = await createPageSchema.parseAsync({
      slug: formData.get('slug'),
      title: formData.get('title'),
      provider_account_id: formData.get('provider_account_id'),
      permissions: formData.get('permissions'),
      note: formData.get('note'),
    });

    /**
     * Create page
     */

    /**
     * Insert page
     */
    const { data, error } = await supabase
      .from('pages')
      .insert([
        {
          ...parsedData,
          user_id: user?.id,
          permissions: JSON.parse(parsedData?.permissions),
        },
      ])
      .select();

    if (error) throw error;

    /**
     * Get the created page with its ID
     */
    createdPage = data[0];

    /**
     * Generate template
     */
    const templateRequest = {
      title: createdPage.title,
      pageId: createdPage.id,
      providerAccountId: createdPage.provider_account_id,
      permissions: createdPage.permissions,
      description: createdPage.note || '',
    };

    const { url: template_url } = await generateTemplate(templateRequest);

    /**
     * Update page with template URL
     */
    await supabase
      .from('pages')
      .update({ template_url })
      .eq('id', createdPage.id);

    revalidatePath('/pages'); // Revalidate cache to refresh data
    return { data: createdPage, errors: null, success: true };
  } catch (error) {
    // Delete the page if it was created but template generation failed
    if (createdPage?.id) {
      const { error: deleteError } = await supabase
        .from('pages')
        .delete()
        .eq('id', createdPage.id);

      if (deleteError) {
        console.error('Failed to delete page after error:', deleteError);
      }
    }

    console.error('Error creating access page:', error);
    return {
      data: null,
      errors: { _global: 'Failed to create page' },
      success: false,
    };
  }
}

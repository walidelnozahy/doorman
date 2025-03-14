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
  try {
    /**
     * Check if user is authenticated
     */
    const supabase = await createClient();
    // console.log('supabase', supabase);
    // Get authenticated user
    const user = await getAuthenticatedUser(supabase);

    /**
     * Parse form data and check validation
     */
    const parsedData = createPageSchema.safeParse({
      title: formData.get('title'),
      provider_account_id: formData.get('provider_account_id'),
      permissions: formData.get('permissions'),
      note: formData.get('note'),
    });

    if (!parsedData.success) {
      return {
        data: null,
        errors: parsedData.error.flatten().fieldErrors,
        success: false,
      };
    }

    /**
     * Create page
     */
    let createdPage = null;
    const insertData = {
      user_id: user?.id,
      title: parsedData.data?.title,
      provider_account_id: parsedData.data?.provider_account_id,
      permissions: JSON.parse(parsedData.data?.permissions),
      note: parsedData.data?.note,
    };

    /**
     * Insert page
     */
    const { data, error } = await supabase
      .from('pages')
      .insert([insertData])
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
    console.log('err', error);
    return {
      data: null,
      errors: { _global: 'Failed to create page' },
      success: false,
    };
  }
}

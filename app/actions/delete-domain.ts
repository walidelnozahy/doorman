'use server';

import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from '@/lib/supabase/get-authenticate-user';
import vercel from '@/lib/vercel/client';

const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID!;

type DeleteDomainResponse = {
  success: boolean;
  globalError?: string;
};

export async function deleteDomain({
  domain,
}: {
  domain: string;
}): Promise<DeleteDomainResponse> {
  const supabase = await createClient();
  let vercelDomainRemoved = false;

  try {
    const user = await getAuthenticatedUser(supabase);
    if (!user) {
      return {
        success: false,
        globalError: 'You must be logged in to delete a domain',
      };
    }

    // Step 1: Remove from Vercel
    try {
      await vercel.projects.removeProjectDomain({
        idOrName: VERCEL_PROJECT_ID,
        domain,
      });
      vercelDomainRemoved = true;
    } catch (error) {
      console.error('Error removing domain from Vercel:', error);
      return {
        success: false,
        globalError: 'Failed to remove domain from Vercel',
      };
    }

    // Step 2: Remove from Supabase
    const { error } = await supabase
      .from('custom_domains')
      .delete()
      .eq('domain', domain)
      .eq('user_id', user.id);

    if (error) {
      // If we failed to remove from database but succeeded with Vercel,
      // we should log this as a critical error for manual cleanup
      console.error(
        'CRITICAL: Domain removed from Vercel but failed to remove from database. Manual cleanup required.',
        { domain, userId: user.id, error },
      );
      return {
        success: false,
        globalError: 'Failed to remove domain from database',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    // If we get here and the domain was removed from Vercel but not from database,
    // we should log this as a critical error for manual cleanup
    if (vercelDomainRemoved) {
      console.error(
        'CRITICAL: Domain removed from Vercel but failed to remove from database. Manual cleanup required.',
        { domain, error },
      );
    }
    console.error('Error during domain deletion process:', error);
    return {
      success: false,
      globalError: 'Failed to delete domain',
    };
  }
}

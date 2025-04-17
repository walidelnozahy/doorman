'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from '@/lib/supabase/get-authenticate-user';
import vercel from '@/lib/vercel/client';

const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID!;

type DnsRecord = {
  type: string;
  name: string;
  value: string;
};

type AddDomainResponse = {
  success: boolean;
  globalError?: string;
  needs_verification?: boolean;
  needs_configuration?: boolean;
  verification_details?: {
    type: string;
    name: string;
    value: string;
  } | null;
  configuration_details?: DnsRecord[];
};

/**
 * Checks if a domain is a root domain (e.g., example.com) vs a subdomain (e.g., sub.example.com)
 */
function isRootDomain(domain: string): boolean {
  const parts = domain.split('.');
  return parts.length === 2;
}

export async function addDomain({
  domain,
  page_id,
}: {
  domain: string;
  page_id: string;
}): Promise<AddDomainResponse> {
  const supabase = await createClient();
  let vercelDomainAdded = false;

  try {
    const user = await getAuthenticatedUser(supabase);
    if (!user) {
      return {
        success: false,
        globalError: 'You must be logged in to add a domain',
      };
    }

    // Step 1: Add to Vercel
    try {
      const vercelDomain = await vercel.projects.addProjectDomain({
        idOrName: VERCEL_PROJECT_ID,
        requestBody: {
          name: domain,
        },
      });

      vercelDomainAdded = true;

      // Check if domain needs verification
      let needsVerification = false;
      let needsConfiguration = false;
      let verificationDetails = null;
      let configurationDetails: DnsRecord[] = [];
      let isVerified = vercelDomain.verified ?? false;
      let isConfigured = false; // Default to false, will be updated after checking configuration

      // If domain has verification requirements, handle those first
      if (vercelDomain.verification && vercelDomain.verification.length > 0) {
        verificationDetails = {
          type: vercelDomain.verification[0].type,
          name: vercelDomain.verification[0].domain,
          value: vercelDomain.verification[0].value,
        };
        needsVerification = true;
      }

      // Check DNS configuration
      try {
        const domainConfig = await vercel.domains.getDomainConfig({
          domain,
        });

        // Check if domain is properly configured
        if (domainConfig.misconfigured) {
          needsConfiguration = true;
          isConfigured = false;

          // Add appropriate DNS record based on domain type
          if (isRootDomain(domain)) {
            // Root domains need A record
            configurationDetails.push({
              type: 'A',
              name: '@',
              value: '76.76.21.21', // Vercel's default A record
            });
          } else {
            // Subdomains need CNAME record
            configurationDetails.push({
              type: 'CNAME',
              name: domain.split('.')[0], // subdomain part
              value: 'cname.vercel-dns.com', // Vercel's CNAME target
            });
          }
        }
      } catch (configError) {
        console.error('Error checking domain configuration:', configError);
        // If we can't check configuration, assume DNS config is needed
        needsConfiguration = true;
        isConfigured = false;

        // Add default records based on domain type
        if (isRootDomain(domain)) {
          configurationDetails.push({
            type: 'A',
            name: '@',
            value: '76.76.21.21',
          });
        } else {
          configurationDetails.push({
            type: 'CNAME',
            name: domain.split('.')[0],
            value: 'cname.vercel-dns.com',
          });
        }
      }

      // Step 3: Add to Supabase
      const { error } = await supabase.from('custom_domains').insert([
        {
          domain,
          user_id: user.id,
          page_id,
          is_verified: isVerified,
          verified_at: isVerified ? new Date().toISOString() : null,
          verification_details: verificationDetails,
          is_configured: isConfigured,
          configuration_details: configurationDetails,
        },
      ]);

      if (error) {
        // Clean up Vercel if database insert fails
        try {
          await vercel.projects.removeProjectDomain({
            idOrName: VERCEL_PROJECT_ID,
            domain,
          });
          vercelDomainAdded = false;
        } catch (cleanupError) {
          console.error(
            'Failed to clean up Vercel domain after Supabase error:',
            cleanupError,
          );
        }
        throw error;
      }

      revalidatePath('/pages');
      revalidatePath(`/pages/${page_id}`);

      return {
        success: true,
        needs_verification: needsVerification,
        needs_configuration: needsConfiguration,
        verification_details: verificationDetails,
        configuration_details: configurationDetails,
      };
    } catch (error) {
      console.error('Error adding domain to Vercel:', error);
      return {
        success: false,
        globalError: 'Failed to add domain',
      };
    }
  } catch (error) {
    // If we get here and the domain was added to Vercel but not to database,
    // we should log this as a critical error for manual cleanup
    if (vercelDomainAdded) {
      console.error(
        'CRITICAL: Domain added to Vercel but failed to add to database. Manual cleanup required.',
        { domain, error },
      );
    }
    console.error('Error in add domain process:', error);
    return {
      success: false,
      globalError: 'Failed to add domain',
    };
  }
}

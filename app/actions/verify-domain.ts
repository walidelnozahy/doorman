'use server';

import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from '@/lib/supabase/get-authenticate-user';
import vercel from '@/lib/vercel/client';

const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID!;

type VerifyDomainResponse = {
  success: boolean;
  is_verified: boolean;
  is_configured: boolean;
  verification_details?: {
    type: string;
    name: string;
    value: string;
  } | null;
  configuration_details?: {
    type: string;
    name: string;
    value: string;
  }[];
};

type DnsRecord = {
  type: string;
  name: string;
  value: string;
};

/**
 * Checks if a domain is a root domain (e.g., example.com) vs a subdomain (e.g., sub.example.com)
 */
function isRootDomain(domain: string): boolean {
  const parts = domain.split('.');
  return parts.length === 2;
}

export async function verifyDomain({
  domain,
}: {
  domain: string;
}): Promise<VerifyDomainResponse> {
  const supabase = await createClient();
  let is_verified = false;
  let is_configured = false;
  let verification_details = null;
  let configuration_details: DnsRecord[] = [];

  try {
    const user = await getAuthenticatedUser(supabase);
    if (!user) {
      return {
        success: true,
        is_verified: false,
        is_configured: false,
        verification_details: null,
        configuration_details: [],
      };
    }

    // Get domain configuration from Vercel
    try {
      const domainConfig = await vercel.projects.getProjectDomain({
        idOrName: VERCEL_PROJECT_ID,
        domain,
      });

      // Check if domain is verified
      is_verified = domainConfig.verified === true;

      // Get verification details if available
      if (domainConfig.verification && domainConfig.verification.length > 0) {
        verification_details = {
          type: domainConfig.verification[0].type,
          name: domainConfig.verification[0].domain,
          value: domainConfig.verification[0].value,
        };
      }

      // For root domains, we need to check if A records are properly configured
      if (isRootDomain(domain) && !is_verified) {
        // Check domain verification status with Vercel
        try {
          const response = await vercel.projects.verifyProjectDomain({
            idOrName: VERCEL_PROJECT_ID,
            domain,
          });

          is_verified = response.verified === true;
        } catch (error) {
          // If verification check fails, treat it as not verified yet
          console.log('Domain verification check failed:', error);
          is_verified = false;
        }
      }

      // Check DNS configuration
      try {
        const configResponse = await vercel.domains.getDomainConfig({
          domain,
        });

        is_configured = !configResponse.misconfigured;

        if (configResponse.misconfigured) {
          // Add appropriate DNS record based on domain type
          if (isRootDomain(domain)) {
            // Root domains need A record
            configuration_details.push({
              type: 'A',
              name: '@',
              value: '76.76.21.21', // Vercel's default A record
            });
          } else {
            // Subdomains need CNAME record
            configuration_details.push({
              type: 'CNAME',
              name: domain.split('.')[0], // subdomain part
              value: 'cname.vercel-dns.com', // Vercel's CNAME target
            });
          }
        }
      } catch (configError) {
        console.error('Error checking domain configuration:', configError);
        is_configured = false;

        // Add default records based on domain type
        if (isRootDomain(domain)) {
          configuration_details.push({
            type: 'A',
            name: '@',
            value: '76.76.21.21',
          });
        } else {
          configuration_details.push({
            type: 'CNAME',
            name: domain.split('.')[0],
            value: 'cname.vercel-dns.com',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching domain configuration:', error);
      is_verified = false;
      is_configured = false;
    }

    // Update verification status in database
    await supabase
      .from('custom_domains')
      .update({
        is_verified,
        verified_at: is_verified ? new Date().toISOString() : null,
        verification_details,
        is_configured,
        configuration_details,
      })
      .eq('domain', domain)
      .eq('user_id', user.id);

    return {
      success: true,
      is_verified,
      is_configured,
      verification_details,
      configuration_details,
    };
  } catch (error) {
    console.error('Error during domain verification process:', error);
    return {
      success: true,
      is_verified: false,
      is_configured: false,
      verification_details: null,
      configuration_details: [],
    };
  }
}

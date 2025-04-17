'use client';

import { AlertCircle, CheckCircle2, Globe, XCircle } from 'lucide-react';
import { DnsRecordDisplay } from './dns-record-display';
import { StatusBadge } from '@/components/status-badge';
import { Card, CardContent } from '@/components/ui/card';
import { OpenInNewTabButton } from '@/components/open-in-new-tab-button';
import { DeleteDomainButton } from './delete-domain-button';
import { CheckDomainStatusButton } from './check-domain-status-button';

type DnsRecord = {
  type: string;
  name: string;
  value: string;
};

interface DomainStatusCardProps {
  domain: string;
  isVerified: boolean;
  isConfigured: boolean;
  verificationDetails?: {
    type: string;
    name: string;
    value: string;
  } | null;
  configurationDetails?: DnsRecord[];
}

export function DomainStatusCard({
  domain,
  isVerified,
  isConfigured,
  verificationDetails,
  configurationDetails,
}: DomainStatusCardProps) {
  return (
    <Card>
      <CardContent className='py-4'>
        <div className='space-y-4'>
          {/* Header with domain and actions */}
          <div className='flex justify-between items-start'>
            <div className='space-y-1.5'>
              <div className='flex items-center gap-2'>
                <Globe className='h-4 w-4 text-muted-foreground' />
                <h3 className='font-medium'>{domain}</h3>
              </div>
              <div className='flex items-center gap-2'>
                <div className='flex items-center gap-1.5'>
                  {isVerified ? (
                    <CheckCircle2 className='h-3.5 w-3.5 text-emerald-500' />
                  ) : (
                    <XCircle className='h-3.5 w-3.5 text-amber-500' />
                  )}
                  <span className='text-sm text-muted-foreground'>
                    Domain Verification
                  </span>
                </div>
                <StatusBadge
                  status={isVerified ? 'active' : 'pending'}
                  size='sm'
                  text={isVerified ? 'Verified' : 'Pending'}
                />
              </div>
              <div className='flex items-center gap-2'>
                <div className='flex items-center gap-1.5'>
                  {isConfigured ? (
                    <CheckCircle2 className='h-3.5 w-3.5 text-emerald-500' />
                  ) : (
                    <XCircle className='h-3.5 w-3.5 text-amber-500' />
                  )}
                  <span className='text-sm text-muted-foreground'>
                    DNS Configuration
                  </span>
                </div>
                <StatusBadge
                  status={isConfigured ? 'active' : 'pending'}
                  size='sm'
                  text={isConfigured ? 'Configured' : 'Pending'}
                />
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <CheckDomainStatusButton
                domain={domain}
                isVerified={isVerified}
                isConfigured={isConfigured}
              />
              <OpenInNewTabButton path={`https://${domain}`} variant='ghost' />
              <DeleteDomainButton domain={domain} />
            </div>
          </div>

          {/* DNS Records */}
          <div className='space-y-4'>
            {!isVerified && verificationDetails && (
              <DnsRecordDisplay
                title='Domain Verification Record'
                description='Add this TXT record to verify ownership of your domain.'
                records={[verificationDetails]}
                footerMessage='DNS changes can take up to 24 hours to propagate. Click refresh to check verification status.'
              />
            )}

            {!isConfigured &&
              configurationDetails &&
              configurationDetails.length > 0 && (
                <DnsRecordDisplay
                  title='DNS Configuration Record'
                  description='Add this record to direct traffic from your domain to our servers.'
                  records={configurationDetails}
                  footerMessage='DNS changes can take up to 24 hours to propagate. Click refresh to check configuration status.'
                  className={!isVerified && verificationDetails ? 'mt-4' : ''}
                />
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

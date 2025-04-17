'use client';

import { AlertCircle } from 'lucide-react';
import { CopyButton } from '@/components/copy-button';

type DnsRecord = {
  type: string;
  name: string;
  value: string;
};

interface DnsRecordDisplayProps {
  title: string;
  description?: string;
  records: DnsRecord[];
  footerMessage?: string;
  className?: string;
}

export function DnsRecordDisplay({
  title,
  description,
  records,
  footerMessage = 'DNS changes can take up to 24 hours to propagate. Click refresh to check status.',
  className = '',
}: DnsRecordDisplayProps) {
  if (!records || records.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className='flex items-center gap-2 text-sm mb-3'>
        <AlertCircle className='h-4 w-4 text-amber-500' />
        <span className='text-amber-500'>{title}</span>
      </div>
      {description && (
        <p className='text-sm text-muted-foreground mb-3'>{description}</p>
      )}
      <div className='rounded-md border bg-muted/40'>
        <div className='p-4'>
          {records.map((record, index) => (
            <div key={index} className={index > 0 ? 'mt-6' : ''}>
              {records.length > 1 && (
                <div className='text-xs font-medium mb-2'>
                  Record {index + 1}
                </div>
              )}
              <div className='grid grid-cols-3 gap-6'>
                <div>
                  <div className='text-xs text-muted-foreground mb-2'>Type</div>
                  <div className='flex items-center gap-2'>
                    <code className='font-mono text-sm'>{record.type}</code>
                    <CopyButton value={record.type} size='sm' />
                  </div>
                </div>
                <div>
                  <div className='text-xs text-muted-foreground mb-2'>Name</div>
                  <div className='flex items-center gap-2'>
                    <code className='font-mono text-sm'>{record.name}</code>
                    <CopyButton value={record.name} size='sm' />
                  </div>
                </div>
                <div>
                  <div className='text-xs text-muted-foreground mb-2'>
                    Value
                  </div>
                  <div className='flex items-center gap-2'>
                    <code className='font-mono text-sm break-all'>
                      {record.value}
                    </code>
                    <CopyButton value={record.value} size='sm' />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='border-t bg-muted/60 p-3'>
          <p className='text-xs text-muted-foreground'>{footerMessage}</p>
        </div>
      </div>
    </div>
  );
}

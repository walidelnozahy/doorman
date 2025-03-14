'use client';

import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export function OpenInNewTabButton({ url }: { url: string }) {
  return (
    <Button
      variant='outline'
      size='sm'
      onClick={() => window.open(url, '_blank')}
    >
      <ExternalLink className='h-4 w-4 mr-2' />
      Open in New Tab
    </Button>
  );
}

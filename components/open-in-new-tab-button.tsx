'use client';

import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export function OpenInNewTabButton({ path }: { path: string }) {
  return (
    <Button
      variant='outline'
      size='sm'
      onClick={() => window.open(path, '_blank')}
    >
      <ExternalLink className='h-4 w-4 mr-2' />
      Open in New Tab
    </Button>
  );
}

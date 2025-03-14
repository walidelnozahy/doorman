'use client';

import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function CopyUrlButton({ url }: { url: string }) {
  const { copyToClipboard } = useCopyToClipboard();

  return (
    <Button variant='outline' size='sm' onClick={() => copyToClipboard(url)}>
      <Copy className='h-4 w-4 mr-2' />
      Copy URL
    </Button>
  );
}

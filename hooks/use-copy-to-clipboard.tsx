'use client';
import { useToast } from '@/hooks/use-toast';
import { CheckIcon, CopyIcon } from 'lucide-react';

export function useCopyToClipboard() {
  const { toast } = useToast();

  const copyToClipboard = async (
    text: string,
    message: string = 'Copied to clipboard',
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        description: (
          <div className='flex items-center gap-1'>
            <CheckIcon className='h-4 w-4' />
            <span>{message}</span>
          </div>
        ),
        duration: 2000,
      });
    } catch (err) {
      toast({
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  return { copyToClipboard };
}

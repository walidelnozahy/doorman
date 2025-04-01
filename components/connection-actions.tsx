'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2Icon, Loader2 } from 'lucide-react';
import { Connection, Page } from '@/utils/types';

type ConnectionActionsProps = {
  connectionData: Connection | null;
  pageData: Page;
  connectionId: string | undefined;
};

export function ConnectionActions({
  connectionData: initialConnectionData,
  pageData,
  connectionId,
}: ConnectionActionsProps) {
  const [connectionData, setConnectionData] = useState(initialConnectionData);

  // Update local state when props change
  useEffect(() => {
    setConnectionData(initialConnectionData);
  }, [initialConnectionData]);

  // Listen for connection status updates from the poller
  useEffect(() => {
    const handleConnectionUpdate = (event: MessageEvent) => {
      if (
        event.data?.type === 'connection-update' &&
        event.data?.connectionId === connectionId
      ) {
        setConnectionData(event.data.connection);
      }
    };

    window.addEventListener('message', handleConnectionUpdate);
    return () => window.removeEventListener('message', handleConnectionUpdate);
  }, [connectionId]);

  return (
    <>
      {/* Connection Status Messages */}
      {connectionData?.status === 'connecting' && (
        <div className='flex items-center justify-center space-y-2 pt-4'>
          <div className='flex flex-col items-center space-y-4 w-full'>
            <div className='flex items-center space-x-2 text-muted-foreground'>
              <Loader2 className='h-4 w-4 animate-spin' />
              <span>Establishing connection to AWS...</span>
            </div>
            <Button variant='outline' className='text-muted-foreground'>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {connectionData?.status === 'connected' && (
        <div className='flex items-center justify-center space-y-2 pt-4'>
          <div className='rounded-lg border border-emerald-200/30 bg-emerald-50/30 p-4 text-center w-full dark:border-emerald-400/30 dark:bg-emerald-900/20'>
            <CheckCircle2Icon className='h-6 w-6 mx-auto mb-2 text-emerald-600 dark:text-emerald-400' />
            <p className='font-medium text-emerald-700 dark:text-emerald-300'>
              Connection established successfully!
            </p>
            <p className='text-sm mt-1 text-emerald-600/80 dark:text-emerald-400/80'>
              You can now close this window.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

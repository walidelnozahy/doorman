'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import { Page } from '@/utils/types';

type ConnectButtonProps = {
  pageData: Page;
  connectionId: string | undefined;
  initialConnectionStatus: string | undefined;
};

export function ConnectButton({
  pageData,
  connectionId,
  initialConnectionStatus,
}: ConnectButtonProps) {
  const [connectionStatus, setConnectionStatus] = useState(
    initialConnectionStatus,
  );

  // Listen for connection status updates
  useEffect(() => {
    const handleConnectionUpdate = (event: MessageEvent) => {
      if (
        event.data?.type === 'connection-update' &&
        event.data?.connectionId === connectionId
      ) {
        setConnectionStatus(event.data.connection.status);
      }
    };

    window.addEventListener('message', handleConnectionUpdate);
    return () => window.removeEventListener('message', handleConnectionUpdate);
  }, [connectionId]);

  // Don't show the button if already connected
  if (connectionStatus === 'connected') {
    return null;
  }

  return (
    <div className='space-y-4 w-full max-w-md'>
      <Button
        size='lg'
        className='w-full py-6 text-lg'
        onClick={() => {
          const url =
            pageData.template_url + `&param_ConnectionId=${connectionId || ''}`;
          window.open(url, '_blank');
        }}
        disabled={!pageData.template_url || connectionStatus === 'connecting'}
      >
        Connect AWS Account
        <ArrowRightIcon className='ml-2 h-5 w-5' />
      </Button>
      <p className='text-sm text-center text-muted-foreground'>
        You'll be redirected to AWS CloudFormation to complete the setup
      </p>
    </div>
  );
}

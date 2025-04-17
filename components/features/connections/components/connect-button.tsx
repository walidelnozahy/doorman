'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, CheckCircle2Icon, Loader2 } from 'lucide-react';
import { Page, Connection, ConnectionStatus } from '@/utils/types';
import { AwsIcon } from '@/components/icons/aws-icon';
import { Badge } from '@/components/ui/badge';
import { getStatusBadgeStatus, StatusBadge } from '@/components/status-badge';
import { getConnection } from '@/app/actions/get-connection';
import useSWR from 'swr';

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
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    (initialConnectionStatus as ConnectionStatus) || 'disconnected',
  );
  const [connectionData, setConnectionData] = useState<Connection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPollingTooLong, setIsPollingTooLong] = useState(false);
  const [pollingStartTime, setPollingStartTime] = useState<number | null>(null);

  // SWR fetcher function
  const fetcher = async () => {
    if (!connectionId || !pageData.id) return null;

    try {
      const { data, error } = await getConnection(pageData.id, connectionId);

      if (error) {
        setError(error);
        return null;
      }

      setError(null);
      setConnectionData(data);

      if (!!data?.status) {
        setConnectionStatus(data?.status as ConnectionStatus);
      }

      return data;
    } catch (err) {
      setError('Failed to fetch connection');
      return null;
    }
  };

  // Use SWR for polling when status is 'connecting'
  useSWR(connectionId && 'poll-connection', fetcher, {
    refreshInterval: connectionStatus === 'connecting' ? 2000 : undefined, // Poll every 2 seconds
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  // Track polling duration
  useEffect(() => {
    if (connectionStatus === 'connecting') {
      // Set polling start time when connecting begins
      if (!pollingStartTime) {
        setPollingStartTime(Date.now());
      }

      // Check if polling has been going on for too long (30 seconds)
      const checkPollingDuration = () => {
        if (pollingStartTime && Date.now() - pollingStartTime > 30000) {
          setIsPollingTooLong(true);
        }
      };

      const intervalId = setInterval(checkPollingDuration, 1000);

      return () => {
        clearInterval(intervalId);
      };
    } else {
      // Reset polling time when not connecting
      setPollingStartTime(null);
      setIsPollingTooLong(false);
    }
  }, [connectionStatus, pollingStartTime]);

  // Handle connect button click
  const handleConnect = () => {
    if (connectionId) {
      // Set status to connecting immediately
      setConnectionStatus('connecting');
    }
    const url =
      pageData.template_url + `&param_ConnectionId=${connectionId || ''}`;
    window.open(url, '_blank');
  };

  // Handle cancel button click
  const handleCancel = () => {
    setConnectionStatus('disconnected');
  };

  // Capitalize first letter of status for display
  const formatStatusText = (status: ConnectionStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (connectionStatus === 'connected') {
    return (
      <div className='space-y-4 w-full max-w-md'>
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
    );
  }

  return (
    <div className='space-y-4 w-full max-w-md'>
      <div className='flex items-center justify-center gap-2 mb-4'>
        {error && <Badge variant='destructive'>Connection Error</Badge>}
        <StatusBadge
          status={getStatusBadgeStatus(connectionStatus)}
          text={formatStatusText(connectionStatus)}
        />
      </div>

      <Button
        size='lg'
        className='w-full py-6 text-lg group relative'
        onClick={handleConnect}
        disabled={!pageData.template_url || connectionStatus === 'connecting'}
      >
        <span className='flex items-center justify-center gap-2'>
          <AwsIcon className='h-6 w-6 transition-transform group-hover:scale-110' />
          <span>Connect AWS Account</span>
          <ArrowRightIcon className='h-5 w-5 transition-transform group-hover:translate-x-1' />
        </span>
      </Button>

      {connectionStatus === 'connecting' && (
        <div className='flex flex-col items-center space-y-4 w-full'>
          <div className='flex items-center space-x-2 text-muted-foreground'>
            <Loader2 className='h-4 w-4 animate-spin' />
            <span>Establishing connection to AWS...</span>
          </div>

          {isPollingTooLong && (
            <div className='rounded-lg border border-amber-200/30 bg-amber-50/30 p-3 text-center w-full dark:border-amber-400/30 dark:bg-amber-900/20'>
              <p className='text-sm text-amber-700 dark:text-amber-300'>
                Connection is taking longer than expected. Please check your AWS
                CloudFormation console to ensure the stack is being created
                properly.
              </p>
              <p className='text-sm mt-2 text-amber-600/80 dark:text-amber-400/80'>
                If issues persist, contact the page owner for assistance.
              </p>
            </div>
          )}

          <Button
            variant='outline'
            className='text-muted-foreground'
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      )}

      <p className='text-sm text-center text-muted-foreground'>
        You'll be redirected to AWS CloudFormation to complete the setup
      </p>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Connection } from '@/utils/types';
import { StatusBadge } from '@/components/status-badge';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getConnection } from '@/app/actions/get-connection';

type ConnectionStatusPollerProps = {
  pageId: string;
  connectionId: string;
  initialConnection: Connection | null;
};

export function ConnectionStatusPoller({
  pageId,
  connectionId,
  initialConnection,
}: ConnectionStatusPollerProps) {
  const [connection, setConnection] = useState<Connection | null>(
    initialConnection,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Poll for connection status updates
  useEffect(() => {
    if (!connectionId) return;

    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const pollConnection = async () => {
      if (!isMounted) return;

      setIsLoading(true);
      try {
        const { data, error } = await getConnection(pageId, connectionId);
        
        if (isMounted) {
          if (error) {
            setError(error);
          } else {
            setError(null);
            setConnection(data);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to fetch connection');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);

          // Continue polling if not connected
          if (connection?.status !== 'connected') {
            timeoutId = setTimeout(pollConnection, 2000);
          }
        }
      }
    };

    // Start polling
    pollConnection();

    // Cleanup
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [connectionId, connection?.status]);
  const status = connection?.status || 'disconnected';
  return (
    <div className='flex items-center gap-2'>
      {isLoading && <Loader2 className='h-4 w-4 animate-spin' />}
      {error && <Badge variant='destructive'>Connection Error</Badge>}
      <StatusBadge status={status} variant='outline' />
    </div>
  );
}

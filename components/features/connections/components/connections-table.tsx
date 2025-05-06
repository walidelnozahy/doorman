'use client';
import { formatDate } from '@/utils/ago';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../ui/table';
import { Button } from '../../../ui/button';
import { Copy, ExternalLink } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { getStatusBadgeStatus, StatusBadge } from '../../../status-badge';
import { Connection } from '@/utils/types';
import config from '@/config';

export function ConnectionsTable({
  connections,
  pageId,
}: {
  connections: Connection[];
  pageId: string;
}) {
  const { copyToClipboard } = useCopyToClipboard();
  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Provider AWS Account</TableHead>
            <TableHead>Consumer AWS Account</TableHead>
            <TableHead>Connection ID</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-[100px]'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {connections.map((connection) => {
            const connectionUrl = `${config.origin}/${pageId}/${connection.connection_id}`;
            return (
              <TableRow key={connection.id}>
                <TableCell>{connection.provider_account_id || '-'}</TableCell>
                <TableCell>{connection.consumer_account_id || '-'}</TableCell>
                <TableCell className='font-mono text-xs'>
                  {connection.connection_id || '-'}
                </TableCell>
                <TableCell>
                  {connection.created_at
                    ? formatDate(connection.created_at)
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  <StatusBadge
                    status={getStatusBadgeStatus(
                      connection.status || 'disconnected',
                    )}
                  />
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => {
                        copyToClipboard(connectionUrl);
                      }}
                    >
                      <Copy className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => window.open(connectionUrl, '_blank')}
                    >
                      <ExternalLink className='h-4 w-4' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

'use client';

import { useParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchHandler } from '@/utils/queries';
import { Connection, Page } from '@/utils/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Plus, Copy, ExternalLink, Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/ago';
import { PagesSkeleton } from '@/components/skeletons/pages-skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/empty-state';
import { CreateConnectionDialog } from '@/components/create-connection-dialog';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { PermissionsViewer } from '@/components/permissions-viewer';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { StatusBadge } from '@/components/status-badge';
import { PageDetailsSkeleton } from '@/components/skeletons/page-details-skeleton';

export default function PageDetails() {
  const params = useParams();
  const pageId = params.pageId as string;
  const [isCreateConnectionDialogOpen, setIsCreateConnectionDialogOpen] =
    useState(false);
  const { copyToClipboard } = useCopyToClipboard();
  const {
    isPending,
    data: page,
    error,
    refetch,
  } = useQuery({
    queryKey: ['page', pageId],
    queryFn: async () => {
      const page = await fetchHandler(`/api/pages/${pageId}`);
      return page as Page;
    },
  });
  const pageUrl = `${window.location.origin}/${pageId}`;
  // Query for connections related to this page
  const {
    data: connections,
    isPending: isConnectionsLoading,
    error: connectionsError,
    refetch: refetchConnections,
  } = useQuery({
    queryKey: ['connections', pageId],
    queryFn: async () => {
      const connections = await fetchHandler(
        `/api/connections?pageId=${pageId}`,
      );

      return connections as Connection[];
    },
    enabled: !!page, // Only run this query if the page data is available
  });

  const createPageMutation = useMutation({
    mutationFn: async (data: Connection) => {
      const page = await fetchHandler(`/api/connections`, 'PUT', {
        ...data,
        page_id: pageId,
      });
      return page as Connection;
    },
    onSuccess: () => {
      refetch();
      setIsCreateConnectionDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Connection created successfully',
        variant: 'default',
      });
      refetchConnections();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create page',
        variant: 'destructive',
      });
    },
  });
  const onCreateConnection = async (data: Connection) => {
    await createPageMutation.mutateAsync(data);
  };

  if (isPending) {
    return <PageDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className='container mx-auto py-10 flex-1 flex items-center justify-center'>
        <Alert variant='destructive' className='max-w-lg w-full'>
          <div className='flex flex-col items-center text-center'>
            <AlertCircle className='h-8 w-8 mb-2' />
            <AlertTitle className='text-lg mb-2'>
              Unable to Load Page Details
            </AlertTitle>
            <AlertDescription className='flex flex-col gap-2'>
              <p>There was an error loading the page details.</p>
              {error?.message && (
                <code className='text-sm font-mono bg-destructive/10 p-2 rounded block'>
                  {error?.message}
                </code>
              )}
              <Button
                variant='outline'
                className='mt-4'
                onClick={() => refetch()}
              >
                Try again
              </Button>
            </AlertDescription>
          </div>
        </Alert>
      </div>
    );
  }

  // Helper function to render status badge
  const renderStatusBadge = (status: string) => {
    const variants = {
      active: 'success',
      pending: 'warning',
      inactive: 'secondary',
    };
    const variant = variants[status as keyof typeof variants] || 'default';

    return (
      <Badge variant={variant as any}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className='container mx-auto py-10 space-y-8'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <h1 className='text-2xl font-bold'>{page?.title}</h1>
        <div className='flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-4'>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => {
                copyToClipboard(pageUrl);
              }}
            >
              <Copy className='h-4 w-4 mr-2' />
              Copy URL
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => window.open(pageUrl, '_blank')}
            >
              <ExternalLink className='h-4 w-4 mr-2' />
              Open in New Tab
            </Button>
          </div>
        </div>
      </div>

      {/* Page Details Section - Two columns */}
      <Card className=''>
        <CardContent className='pt-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 h-full'>
            {/* Left Column - Details */}
            <div className='space-y-6'>
              <div>
                <h3 className='text-sm font-medium text-muted-foreground mb-1'>
                  Title
                </h3>
                <p className='text'>{page?.title}</p>
              </div>

              <div>
                <h3 className='text-sm font-medium text-muted-foreground mb-1'>
                  AWS Account
                </h3>
                <p className='text'>{page?.provider_account_id}</p>
              </div>

              <div>
                <h3 className='text-sm font-medium text-muted-foreground mb-1'>
                  Created
                </h3>
                <p className='text'>{formatDate(page?.created_at || '')}</p>
              </div>

              {page?.note && (
                <div>
                  <h3 className='text-sm font-medium text-muted-foreground mb-1'>
                    Notes
                  </h3>
                  <p className='text whitespace-pre-wrap'>{page.note}</p>
                </div>
              )}
            </div>

            {/* Right Column - Permissions */}
            <div>
              <h3 className='text-sm font-medium text-muted-foreground mb-1 flex items-center mb-2'>
                <Shield className='h-4 w-4 mr-1.5' />
                Permissions
              </h3>
              <PermissionsViewer permissions={page?.permissions} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connections Section */}
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-semibold'>Connections</h2>
          <Button
            onClick={() => setIsCreateConnectionDialogOpen(true)}
            size='sm'
          >
            <Plus className='h-4 w-4 mr-2' />
            Create Connection
          </Button>
        </div>

        {/* Connection Stats */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Connections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {isConnectionsLoading ? '...' : connections?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium flex items-center'>
                <div className='w-2 h-2 rounded-full bg-green-500 mr-2'></div>
                Connected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {isConnectionsLoading
                  ? '...'
                  : connections?.filter((c) => c.status === 'connected')
                      .length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium flex items-center'>
                <div className='w-2 h-2 rounded-full bg-red-500 mr-2'></div>
                Disconnected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {isConnectionsLoading
                  ? '...'
                  : connections?.filter((c) => c.status === 'disconnected')
                      .length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Connections Table */}
        {isConnectionsLoading ? (
          <div className='space-y-2'>
            <div className='h-4 w-full bg-muted rounded animate-pulse' />
            <div className='h-4 w-full bg-muted rounded animate-pulse' />
            <div className='h-4 w-full bg-muted rounded animate-pulse' />
          </div>
        ) : connectionsError ? (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Failed to load connections.</AlertDescription>
          </Alert>
        ) : connections && connections.length > 0 ? (
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider Account</TableHead>
                  <TableHead>Consumer Account</TableHead>
                  <TableHead>Connection ID</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='w-[100px]'></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {connections.map((connection) => {
                  const connectionUrl = `${window.location.origin}/${pageId}/${connection.connection_id}`;
                  return (
                    <TableRow key={connection.id}>
                      <TableCell>
                        {connection.provider_account_id || '-'}
                      </TableCell>
                      <TableCell>
                        {connection.consumer_account_id || '-'}
                      </TableCell>
                      <TableCell className='font-mono text-xs'>
                        {connection.connection_id || '-'}
                      </TableCell>
                      <TableCell>
                        {connection.created_at
                          ? formatDate(connection.created_at)
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={connection.status || ''} />
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
        ) : (
          <Card>
            <CardContent>
              <EmptyState
                title='No connections found for this page.'
                description='Create a connection to get started.'
                action={
                  <Button onClick={() => setIsCreateConnectionDialogOpen(true)}>
                    <Plus className='h-4 w-4 mr-2' />
                    Create Connection
                  </Button>
                }
              />
            </CardContent>
          </Card>
        )}
      </div>

      <CreateConnectionDialog
        isOpen={isCreateConnectionDialogOpen}
        onClose={() => setIsCreateConnectionDialogOpen(false)}
        onCreateConnection={onCreateConnection}
        isLoading={createPageMutation.isPending}
        providerAccountId={page?.provider_account_id || ''}
      />
    </div>
  );
}

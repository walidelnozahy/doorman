'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import {
  ShieldIcon,
  LockIcon,
  RefreshCwIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  Loader2,
} from 'lucide-react';
import { fetchHandler, generateTemplate } from '@/utils/queries';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Connection, Page } from '@/utils/types';
import { ConnectionPageSkeleton } from '@/components/skeletons/connection-page-skeleton';
import { StatusBadge } from '@/components/status-badge';

export default function AccessRequestPage() {
  const params = useParams();
  const pageId = params.ids?.[0];
  const connectionId = params.ids?.[1];

  // Page data query
  const {
    data: pageData,
    error: pageError,
    isLoading: isPageLoading,
  } = useQuery({
    queryKey: ['access-page', pageId],
    queryFn: async () => {
      const page = await fetchHandler(`/api/pages/${pageId}`);
      return page as Page;
    },
  });

  // Connection data query
  const {
    data: connectionData,
    error: connectionError,
    isLoading: isConnectionLoading,
  } = useQuery({
    queryKey: ['connection', connectionId],
    queryFn: async () => {
      const connection = await fetchHandler(`/api/connections/${connectionId}`);
      return connection as Connection;
    },

    refetchInterval: (query) =>
      query.state.data?.status !== 'connected' ? 2000 : false,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  // Show loading state for the page
  if (isPageLoading) {
    return <ConnectionPageSkeleton />;
  }

  // Show error state for the page
  if (pageError) {
    return (
      <div className='min-h-screen flex items-center justify-center p-4'>
        <div className='w-full max-w-md space-y-4'>
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Failed to load access page</AlertTitle>
            <AlertDescription>
              {pageError instanceof Error
                ? pageError.message
                : 'There was a problem loading the access page. Please try again.'}
            </AlertDescription>
          </Alert>
          <div className='text-center'>
            <Button
              variant='outline'
              size='lg'
              onClick={() => window.location.reload()}
              className='min-w-[140px]'
            >
              <RefreshCwIcon className='mr-2 h-4 w-4' />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return <div>Access page not found</div>;
  }

  // Render the main content with connection status
  return (
    <div className='flex items-center justify-center p-8'>
      <div className='w-full max-w-3xl space-y-8'>
        {!connectionId && (
          <Alert className='border-orange-200 bg-orange-100/50 text-orange-800 dark:border-orange-900/50 dark:bg-orange-900/20 dark:text-orange-300'>
            <AlertCircle className='h-4 w-4 text-orange-600 dark:text-orange-400' />
            <AlertTitle className='text-orange-800 dark:text-orange-300'>
              Missing Connection ID
            </AlertTitle>
            <AlertDescription className='text-orange-700 dark:text-orange-400'>
              The connection ID is required to establish a connection. Some
              features may be limited.
            </AlertDescription>
          </Alert>
        )}

        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>
            {pageData.title}
          </h1>
          <p className=' text-muted-foreground'>
            Review and grant secure access to AWS Account
          </p>
        </div>

        <Card className='border-2'>
          <CardHeader className='space-y-1'>
            <div className='flex items-center justify-between'>
              <Badge variant='outline' className='text-base px-4 py-1'>
                AWS Account ID: {pageData.provider_account_id}
              </Badge>
              <div className='flex items-center gap-2'>
                {isConnectionLoading && (
                  <Loader2 className='h-4 w-4 animate-spin' />
                )}
                {connectionError && (
                  <Badge variant='destructive'>Connection Error</Badge>
                )}
                <StatusBadge
                  status={connectionData?.status || ''}
                  variant='outline'
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-4'>
              <div className='flex items-start space-x-3'>
                <ShieldIcon className='h-5 w-5 text-primary mt-1' />
                <div className='flex-1 min-w-0'>
                  <h3 className='font-semibold mb-2'>Requested Permissions</h3>
                  <div className='rounded-lg border bg-muted/50'>
                    <ScrollArea className='h-[200px] w-full'>
                      <pre className='text-sm p-4 whitespace-pre-wrap break-all'>
                        {JSON.stringify(pageData.permissions, null, 2)}
                      </pre>
                    </ScrollArea>
                  </div>
                </div>
              </div>

              {pageData.note && (
                <div className='flex items-start space-x-3'>
                  <LockIcon className='h-5 w-5 text-primary mt-1' />
                  <div>
                    <h3 className='font-semibold mb-2'>
                      Additional Information
                    </h3>
                    <p className='text-muted-foreground'>{pageData.note}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Connection Status Messages */}
            {connectionData?.status === 'connecting' && (
              <div className='flex items-center justify-center space-y-2 pt-4'>
                {connectionData?.status === 'connecting' && (
                  <div className='flex flex-col items-center space-y-4 w-full'>
                    <div className='flex items-center space-x-2 text-muted-foreground'>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      <span>Establishing connection to AWS...</span>
                    </div>
                    <Button variant='outline' className='text-muted-foreground'>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            )}
            <div className='flex items-center justify-center space-y-2 pt-4'>
              {connectionData?.status === 'connected' && (
                <div className='rounded-lg border border-emerald-200/30 bg-emerald-50/30 p-4 text-center w-full dark:border-emerald-400/30 dark:bg-emerald-900/20'>
                  <CheckCircle2Icon className='h-6 w-6 mx-auto mb-2 text-emerald-600 dark:text-emerald-400' />
                  <p className='font-medium text-emerald-700 dark:text-emerald-300'>
                    Connection established successfully!
                  </p>
                  <p className='text-sm mt-1 text-emerald-600/80 dark:text-emerald-400/80'>
                    You can now close this window.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className='flex flex-col items-center space-y-4 border-t bg-muted/10 p-6'>
            {(!connectionData?.status ||
              connectionData?.status === 'disconnected') && (
              <div className='space-y-4 w-full max-w-md'>
                <Button
                  size='lg'
                  className='w-full py-6 text-lg'
                  onClick={() => {
                    const url =
                      pageData.template_url +
                      `&param_ConnectionId=${connectionId || ''}`;
                    window.open(url, '_blank');
                  }}
                  disabled={
                    isConnectionLoading ||
                    !pageData.template_url ||
                    !connectionId
                  }
                >
                  Connect AWS Account
                  <ArrowRightIcon className='ml-2 h-5 w-5' />
                </Button>
                <p className='text-sm text-center text-muted-foreground'>
                  You'll be redirected to AWS CloudFormation to complete the
                  setup
                </p>
              </div>
            )}
          </CardFooter>
        </Card>

        <div className='flex items-center justify-center space-x-2 text-sm text-muted-foreground'>
          <LockIcon className='h-4 w-4' />
          <span>
            Your security is our priority. Access is granted securely through
            AWS CloudFormation.
          </span>
        </div>
      </div>
    </div>
  );
}

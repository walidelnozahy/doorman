'use client';

import { useState } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import {
  ShieldIcon,
  LockIcon,
  RefreshCwIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  Loader2,
} from 'lucide-react';
import { getPageById } from '@/utils/queries';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ConnectionStatus = 'initial' | 'connecting' | 'connected' | 'error';

export default function AccessRequestPage() {
  const params = useParams();
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('initial');

  // Replace the manual fetch with React Query
  const {
    data: pageData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['access-page', params.pageId],
    queryFn: () => getPageById(params.pageId as string),
  });
  console.log('error', error);
  const simulateConnection = async () => {
    setConnectionStatus('connecting');

    // Simulate a delay for the connection process
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // For demo, succeed 70% of the time
    if (Math.random() > 0.3) {
      setConnectionStatus('connected');
    } else {
      setConnectionStatus('error');
    }
  };

  const handleConnect = () => {
    // Example CloudFormation URL - replace with actual URL later
    window.open(
      'https://console.aws.amazon.com/cloudformation/home#/stacks/create/template',
      '_blank',
    );
    simulateConnection();
  };

  const handleRetry = () => {
    setConnectionStatus('initial');
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center p-4'>
        <div className='w-full max-w-md space-y-4'>
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Failed to load access page</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
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

  return (
    <div className='flex items-center justify-center p-8'>
      <div className='w-full max-w-3xl space-y-8'>
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>
            AWS Account Access Request
          </h1>
          <p className=' text-muted-foreground'>
            Review and grant secure access to AWS Account
          </p>
        </div>

        <Card className='border-2'>
          <CardHeader className='space-y-1'>
            <div className='flex items-center justify-between'>
              <Badge variant='outline' className='text-base px-4 py-1'>
                AWS Account ID: {pageData.account_id}
              </Badge>
              <Badge
                variant={
                  connectionStatus === 'connected'
                    ? 'success'
                    : connectionStatus === 'error'
                      ? 'destructive'
                      : 'secondary'
                }
                className={cn(
                  'px-3 py-1',
                  connectionStatus === 'connected' &&
                    'bg-emerald-50/30 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200/30 dark:border-emerald-400/30',
                )}
              >
                {connectionStatus === 'initial' && 'Ready to Connect'}
                {connectionStatus === 'connecting' && 'Connecting...'}
                {connectionStatus === 'connected' && 'Connected'}
                {connectionStatus === 'error' && 'Connection Failed'}
              </Badge>
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
            {connectionStatus !== 'initial' && (
              <div className='flex items-center justify-center space-y-2 pt-4'>
                {connectionStatus === 'connecting' && (
                  <div className='flex items-center space-x-2 text-muted-foreground'>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    <span>Establishing connection to AWS...</span>
                  </div>
                )}
                {connectionStatus === 'connected' && (
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
                {connectionStatus === 'error' && (
                  <div className='rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive w-full'>
                    <p className='font-medium mb-2'>
                      Failed to establish connection
                    </p>
                    <Button
                      variant='outline'
                      onClick={handleRetry}
                      className='border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground'
                    >
                      Try Again
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className='flex flex-col items-center space-y-4 border-t bg-muted/10 p-6'>
            {connectionStatus === 'initial' && (
              <div className='space-y-4 w-full max-w-md'>
                <Button
                  size='lg'
                  className='w-full py-6 text-lg'
                  onClick={handleConnect}
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

function LoadingSkeleton() {
  return (
    <div className='flex items-center justify-center p-4'>
      <div className='w-full max-w-3xl space-y-8'>
        <div className='text-center space-y-4'>
          <Skeleton className='h-8 w-[300px] mx-auto' />
          <Skeleton className='h-4 w-[200px] mx-auto' />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-[200px]' />
          </CardHeader>
          <CardContent className='space-y-6'>
            <Skeleton className='h-[200px] w-full' />
            <Skeleton className='h-20 w-full' />
          </CardContent>
          <CardFooter className='flex justify-center'>
            <Skeleton className='h-12 w-[300px]' />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

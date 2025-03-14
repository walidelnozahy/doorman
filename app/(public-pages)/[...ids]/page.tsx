import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldIcon, LockIcon, RefreshCwIcon, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { fetchPublicPage, fetchConnectionById } from '@/utils/server-fetchers';
import { ConnectionStatusPoller } from '@/components/connection-status-poller';
import { ConnectionActions } from '@/components/connection-actions';
import { ConnectButton } from '@/components/connect-button';

export default async function AccessRequestPage({
  params,
}: {
  params: Promise<{ ids: string[] }>;
}) {
  // Await params if needed in your setup
  const resolvedParams = await params;
  const pageId = resolvedParams.ids?.[0];
  const connectionId = resolvedParams.ids?.[1];

  if (!pageId) {
    return notFound();
  }

  try {
    // Fetch page data
    const pageData = await fetchPublicPage(pageId);

    if (!pageData) {
      return notFound();
    }

    // Fetch initial connection data if connectionId is provided
    let connectionData = null;

    if (connectionId) {
      connectionData = await fetchConnectionById(pageId, connectionId);
    }

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
            <p className='text-muted-foreground'>
              Review and grant secure access to AWS Account
            </p>
          </div>

          <Card className='border-2'>
            <CardHeader className='space-y-1'>
              <div className='flex items-center justify-between'>
                <Badge variant='outline' className='text-base px-4 py-1'>
                  AWS Account ID: {pageData.provider_account_id}
                </Badge>
                {connectionId && (
                  <ConnectionStatusPoller
                    pageId={pageId}
                    connectionId={connectionId}
                    initialConnection={connectionData}
                  />
                )}
              </div>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-4'>
                <div className='flex items-start space-x-3'>
                  <ShieldIcon className='h-5 w-5 text-primary mt-1' />
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-semibold mb-2'>
                      Requested Permissions
                    </h3>
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

              {/* Connection Status Messages - Client Component */}

              <ConnectionActions
                connectionData={connectionData}
                pageData={pageData}
                connectionId={connectionId}
              />
            </CardContent>
            <CardFooter className='flex flex-col items-center space-y-4 border-t bg-muted/10 p-6'>
              <ConnectButton
                pageData={pageData}
                connectionId={connectionId}
                initialConnectionStatus={connectionData?.status}
              />

              {connectionData && (
                <div className='text-center space-y-4'>
                  <p className='text-muted-foreground'>
                    To establish a connection, please use a valid connection ID
                    or contact the page owner.
                  </p>
                  {/* <Button
                    variant='outline'
                    onClick={() => (window.location.href = `/${pageId}`)}
                  >
                    Return to Page
                  </Button> */}
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
  } catch (error) {
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
}

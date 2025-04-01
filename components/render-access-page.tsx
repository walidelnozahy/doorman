import { LockIcon, ShieldIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { ConnectionStatusPoller } from './connection-status-poller';
import { ScrollArea } from './ui/scroll-area';
import { ConnectionActions } from './connection-actions';
import { ConnectButton } from './connect-button';

export const RenderAccessPage = ({
  pageData,
  connectionData,
  isViewOnly = false,
}: {
  pageData: any;
  connectionData?: any;
  isViewOnly?: boolean;
}) => {
  return (
    <div className='flex items-center justify-center p-8'>
      <div className='w-full max-w-3xl space-y-4'>
        <div className='text-center space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>
            {pageData.title}
          </h1>
          <p className='text-sm text-muted-foreground'>
            Review and grant secure access to AWS Account
          </p>
        </div>

        <Card className='border-2'>
          <CardHeader className='space-y-1'>
            <div className='flex items-center justify-between'>
              <Badge variant='outline' className='text-base px-4 py-1'>
                AWS Account ID: {pageData.provider_account_id}
              </Badge>
              {connectionData?.id && !isViewOnly && (
                <ConnectionStatusPoller
                  pageId={pageData.id}
                  connectionId={connectionData.id}
                  initialConnection={connectionData}
                />
              )}
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-4'>
              <div className='flex items-start space-x-3'>
                <ShieldIcon className='h-5 w-5 text-primary' />
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

              {(pageData.note || isViewOnly) && (
                <div className='flex items-start space-x-3'>
                  <LockIcon className='h-5 w-5 text-primary' />
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
              connectionId={connectionData?.id}
            />
          </CardContent>
          <CardFooter className='flex flex-col items-center space-y-4 border-t bg-muted/10 p-6'>
            <ConnectButton
              pageData={pageData}
              connectionId={connectionData?.id}
              initialConnectionStatus={connectionData?.status}
            />

            {connectionData && !isViewOnly && (
              <div className='text-center space-y-4'>
                <p className='text-muted-foreground'>
                  To establish a connection, please use a valid connection ID or
                  contact the page owner.
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
};

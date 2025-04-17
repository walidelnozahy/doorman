import { LockIcon, ShieldIcon } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../../../ui/card';
import { ScrollArea } from '../../../ui/scroll-area';
import { ConnectButton } from '../../connections/components/connect-button';

export const RenderAccessPage = ({
  pageData,
  connectionData,
  connectionId,
  isViewOnly = false,
}: {
  pageData: any;
  connectionData?: any;
  connectionId?: string;
  isViewOnly?: boolean;
}) => {
  return (
    <div className='flex items-center justify-center p-8'>
      <div className='w-full max-w-3xl space-y-8 animate-fade-up'>
        <div className='text-center space-y-3'>
          <h1 className='text-3xl font-bold tracking-tighter'>
            {pageData.title}
          </h1>
          <p className='text-base text-muted-foreground'>
            Review and grant secure access to AWS Account
          </p>
        </div>

        <Card className='border border-border/50 shadow-lg bg-background-secondary overflow-hidden'>
          <CardContent className='space-y-8 pt-6'>
            <div className='space-y-6'>
              <div className='flex items-start space-x-4'>
                <div className='mt-1'>
                  <ShieldIcon className='h-5 w-5 text-primary' />
                </div>
                <div className='flex-1 min-w-0 space-y-2'>
                  <h3 className='text-lg font-semibold'>
                    Requested Permissions
                  </h3>
                  <div className='rounded-lg border bg-muted/30 overflow-hidden transition-colors hover:bg-muted/50'>
                    <ScrollArea className='h-[200px] w-full'>
                      <pre className='text-sm p-4 whitespace-pre-wrap break-all text-muted-foreground'>
                        {JSON.stringify(pageData.permissions, null, 2)}
                      </pre>
                    </ScrollArea>
                  </div>
                </div>
              </div>

              {(pageData.note || isViewOnly) && (
                <div className='flex items-start space-x-4'>
                  <div className='mt-1'>
                    <LockIcon className='h-5 w-5 text-primary' />
                  </div>
                  <div className='space-y-2'>
                    <h3 className='text-lg font-semibold'>
                      Additional Information
                    </h3>
                    <p className='text-muted-foreground'>{pageData.note}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          {!isViewOnly && (
            <CardFooter className='flex flex-col items-center space-y-6 border-t bg-muted/10 p-8'>
              <ConnectButton
                pageData={pageData}
                connectionId={connectionId}
                initialConnectionStatus={connectionData?.status}
              />
            </CardFooter>
          )}
        </Card>

        {!isViewOnly && (
          <div className='flex items-center justify-center space-x-2 text-sm text-muted-foreground/80'>
            <LockIcon className='h-4 w-4' />
            <span>
              Your security is our priority. Access is granted securely through
              AWS CloudFormation.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

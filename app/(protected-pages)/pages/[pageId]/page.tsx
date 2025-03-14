import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatDate } from '@/utils/ago';
import { EmptyState } from '@/components/empty-state';
import { PermissionsViewer } from '@/components/permissions-viewer';
import { ConnectionsTable } from '@/components/connections-table';
import { CopyUrlButton } from '@/components/copy-url-button';
import { OpenInNewTabButton } from '@/components/open-in-new-tab-button';
import { fetchPage } from '@/utils/server-fetchers';
import { fetchConnections } from '@/utils/server-fetchers';
import { CreateConnectionButton } from '@/components/create-connection-button';
import { origin } from '@/config';

export default async function PageDetails({
  params,
}: {
  params: { pageId: string };
}) {
  const pageId = (await params).pageId;

  try {
    const page = await fetchPage(pageId);
    const connections = await fetchConnections(pageId);

    if (!page) {
      return notFound();
    }

    const pageUrl = `${origin || ''}/${pageId}`;

    const connectedCount = connections.filter(
      (c) => c.status === 'connected',
    ).length;
    const disconnectedCount = connections.filter(
      (c) => c.status === 'disconnected',
    ).length;

    return (
      <div className='container mx-auto py-10 space-y-8'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          <h1 className='text-2xl font-bold'>{page.title}</h1>
          <div className='flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-4'>
            <div className='flex items-center gap-2'>
              <CopyUrlButton url={pageUrl} />
              <OpenInNewTabButton url={pageUrl} />
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
                  <p className='text'>{page.title}</p>
                </div>

                <div>
                  <h3 className='text-sm font-medium text-muted-foreground mb-1'>
                    AWS Account
                  </h3>
                  <p className='text'>{page.provider_account_id}</p>
                </div>

                <div>
                  <h3 className='text-sm font-medium text-muted-foreground mb-1'>
                    Created
                  </h3>
                  <p className='text'>{formatDate(page.created_at || '')}</p>
                </div>

                {page.note && (
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
                <PermissionsViewer permissions={page.permissions} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connections Section */}
        <div className='space-y-6'>
          <div className='flex justify-between items-center'>
            <h2 className='text-xl font-semibold'>Connections</h2>
            <CreateConnectionButton
              pageId={pageId}
              providerAccountId={page.provider_account_id}
            />
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
                  {connections.length || 0}
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
                <div className='text-2xl font-bold'>{connectedCount || 0}</div>
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
                  {disconnectedCount || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Connections Table */}
          {connections && connections.length > 0 ? (
            <ConnectionsTable connections={connections} pageId={pageId} />
          ) : (
            <Card>
              <CardContent>
                <EmptyState
                  title='No connections found for this page.'
                  description='Create a connection to get started.'
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  } catch (error) {
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
              {error instanceof Error && (
                <code className='text-sm font-mono bg-destructive/10 p-2 rounded block'>
                  {error.message}
                </code>
              )}
            </AlertDescription>
          </div>
        </Alert>
      </div>
    );
  }
}

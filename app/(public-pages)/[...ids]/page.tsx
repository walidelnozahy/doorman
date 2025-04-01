import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RefreshCwIcon, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { fetchPublicPage, fetchConnectionById } from '@/utils/server-fetchers';
import { RenderAccessPage } from '@/components/render-access-page';

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
      <RenderAccessPage pageData={pageData} connectionData={connectionData} />
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

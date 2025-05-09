import { fetchPublicPage } from '@/lib/supabase/access-pages/get';
import { RenderAccessPage } from '@/components/features/access-pages/components/render-access-page';
import { fetchConnectionById } from '@/lib/supabase/connections/get';
import { ErrorState } from '@/components/error-state';
import config from '@/config';
import Link from 'next/link';

export default async function AccessRequestPage({
  params,
}: {
  params: Promise<{ ids: string[] }>;
}) {
  // Await params if needed in your setup
  const resolvedParams = await params;
  const pageId = resolvedParams.ids?.[0];
  const connectionId = resolvedParams.ids?.[1];
  let pageData;
  pageData = await fetchPublicPage(pageId);
  console.log('pageData', pageData);

  try {
    // Fetch page data

    if (!pageData) {
      return (
        <div className='min-h-screen flex flex-col items-center justify-center animate-fade-in'>
          <ErrorState
            title='Page Not Found'
            description='The requested access page could not be found.'
          />
          <div className='mt-8 flex items-center justify-center animate-fade-up-delay-200'>
            <div className='text-xs text-muted-foreground/60 flex items-center space-x-1'>
              <span>Powered by</span>
              <Link
                href={config.appUrl}
                className='font-medium text-primary/80 hover:underline'
              >
                Doorman
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // Fetch initial connection data if connectionId is provided
    let connectionData = null;

    if (connectionId) {
      connectionData = await fetchConnectionById(pageId, connectionId);
    }

    return (
      <div className='min-h-screen flex flex-col items-center justify-center animate-fade-in'>
        <div className='animate-fade-up'>
          <RenderAccessPage
            pageData={pageData}
            connectionData={connectionData}
            connectionId={connectionId}
          />
        </div>
        <div className='mt-8 flex items-center justify-center animate-fade-up-delay-200'>
          <div className='text-xs text-muted-foreground/60 flex items-center space-x-1'>
            <span>Powered by</span>
            <Link
              href={config.appUrl}
              className='font-medium text-primary/80 hover:underline'
              target='_blank'
            >
              Doorman
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center animate-fade-in'>
        <div className='animate-fade-up'>
          <ErrorState
            title='Failed to load access page'
            description='There was a problem loading the access page. Please try again.'
            error={error instanceof Error ? error : undefined}
          />
        </div>
        <div className='mt-8 flex items-center justify-center animate-fade-up-delay-200'>
          <div className='text-xs text-muted-foreground/60 flex items-center space-x-1'>
            <span>Powered by</span>
            <Link
              href={config.appUrl}
              className='font-medium text-primary/80 hover:underline'
            >
              Doorman
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

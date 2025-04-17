import type { Page } from '@/utils/types';
import { DeletePageDialog } from '@/components/features/access-pages/components/delete-access-page-dialog';
import { AccessPageCard } from '@/components/features/access-pages/components/access-page-card';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { fetchPages } from '@/lib/supabase/access-pages/get';
import { Suspense } from 'react';
import { CreateAccessPageTrigger } from '@/components/features/access-pages/create-access-page-trigger';
import { AccessPagesSkeleton } from '@/components/features/access-pages/components/access-pages-skeleton';

export default async function Pages() {
  let pages: Page[] = [];
  let error: Error | null = null;

  try {
    pages = await fetchPages();
  } catch (err) {
    error = err as Error;
    console.error('Error fetching pages:', error);
  }

  return (
    <Suspense fallback={<AccessPagesSkeleton />}>
      <div className='mx-auto py-10 flex flex-col animate-fade-in'>
        <div className='flex justify-between items-center mb-6 animate-fade-up'>
          <h1 className='text-2xl font-bold'>Access Pages</h1>
          <CreateAccessPageTrigger />
        </div>

        {error ? (
          <div className='flex-1 flex items-center justify-center animate-fade-up'>
            <ErrorState
              title='Unable to Load Pages'
              description='There was an error loading your access pages.'
              error={error}
            />
          </div>
        ) : !pages?.length ? (
          <div className='animate-fade-up'>
            <EmptyState
              title='No access pages created yet.'
              description='Click "Create Access Page" to get started.'
            />
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {pages.map((page: Page, index: number) => (
              <div
                key={page.id}
                className={`animate-fade-up-delay-${(index % 3) * 100}`}
              >
                <AccessPageCard page={page} />
              </div>
            ))}
          </div>
        )}

        <DeletePageDialog />
      </div>
    </Suspense>
  );
}

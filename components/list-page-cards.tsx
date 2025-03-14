'use client';

import { PageCard } from './page-card';
import { EmptyState } from './empty-state';
import { Page } from '@/utils/types';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle } from 'lucide-react';
import { useDeletePageDialog } from './delete-page-dialog';

export function ListPageCards({
  error,
  pages,
}: {
  error: Error | null;
  pages: Page[];
}) {
  const { toggleIsOpen } = useDeletePageDialog();
  return error ? (
    <div className='flex-1 flex items-center justify-center'>
      <Alert variant='destructive' className='max-w-lg w-full'>
        <div className='flex flex-col items-center text-center'>
          <AlertCircle className='h-8 w-8 mb-2' />
          <AlertTitle className='text-lg mb-2'>Unable to Load Pages</AlertTitle>
          <AlertDescription className='flex flex-col gap-2'>
            <p>There was an error loading your access pages.</p>
            {error?.message && (
              <code className='text-sm font-mono bg-destructive/10 p-2 rounded block'>
                {error?.message}
              </code>
            )}
          </AlertDescription>
        </div>
      </Alert>
    </div>
  ) : !pages?.length ? (
    <EmptyState
      title='No access pages created yet.'
      description='Click "Create Access Page" to get started.'
    />
  ) : (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {pages.map((page: Page) => (
        <PageCard
          key={page.id}
          page={page}
          onDeleteClick={() => toggleIsOpen(page.id, page.title)}
        />
      ))}
    </div>
  );
}

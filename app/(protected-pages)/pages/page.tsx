import type { Page } from '@/utils/types';
import { CreateAccessPageDialog } from '@/components/create-access-page-dialog';
import { DeletePageDialog } from '@/components/delete-page-dialog';
import { ListPageCards } from '@/components/list-page-cards';
import { fetchPages } from '@/utils/server-fetchers';
import { Suspense } from 'react';
import { CreateAccessPageButton } from '@/components/create-access-page-button';

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
    <Suspense fallback={<div>Loading...</div>}>
      <div className='mx-auto py-10 flex flex-col'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>Access Pages</h1>
          <CreateAccessPageButton />
        </div>

        <ListPageCards error={error} pages={pages} />
        <CreateAccessPageDialog />
        <DeletePageDialog />
      </div>
    </Suspense>
  );
}

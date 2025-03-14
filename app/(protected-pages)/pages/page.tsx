import type { Page } from '@/utils/types';
import {
  CreateAccessPageButton,
  CreateAccessPageDialog,
} from '@/components/create-access-page-dialog';
import { DeletePageDialog } from '@/components/delete-page-dialog';
import { ListPageCards } from '@/components/list-page-cards';
import { fetchPages } from '@/utils/server-fetchers';

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
    <div className='mx-auto py-10 flex flex-col'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Access Pages</h1>
        <CreateAccessPageButton />
      </div>

      <ListPageCards error={error} pages={pages} />

      <CreateAccessPageDialog />
      <DeletePageDialog />
    </div>
  );
}

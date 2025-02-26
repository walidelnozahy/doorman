'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import type { Page } from '@/utils/types';
import { fetchHandler } from '@/utils/queries';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { PagesSkeleton } from '@/components/skeletons/pages-skeleton';
import { CreateAccessPageDialog } from '@/components/create-access-page-dialog';
import { DeletePageDialog } from '@/components/delete-page-dialog';

import { PageCard } from '@/components/page-card';
import { EmptyState } from '@/components/empty-state';
export default function Pages() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletePageData, setDeletePageData] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const { toast } = useToast();

  const {
    isPending,
    data: pages,
    error,
    refetch,
  } = useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      const pages = await fetchHandler('/api/pages');
      return pages as Page[];
    },
  });

  const createPageMutation = useMutation({
    mutationFn: async (data: Page) => {
      const page = await fetchHandler('/api/pages', 'POST', data);
      return page as Page;
    },
    onSuccess: () => {
      refetch();
      setIsModalOpen(false);
      toast({
        title: 'Success',
        description: 'Page created successfully',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create page',
        variant: 'destructive',
      });
    },
  });

  const deletePageMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetchHandler(`/api/pages/${id}`, 'DELETE');
    },
    onSuccess: () => {
      refetch();
      toast({
        title: 'Success',
        description: 'Page deleted successfully',
        variant: 'default',
      });
      setDeletePageData(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete page',
        variant: 'destructive',
      });
    },
  });

  const onCreateAccessPage = async (data: Page) => {
    await createPageMutation.mutateAsync(data);
  };

  if (isPending) {
    return <PagesSkeleton />;
  }

  return (
    <div className='mx-auto py-10 flex flex-col'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Access Pages</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusIcon className='mr-2 h-4 w-4' /> Create Access Page
        </Button>
      </div>

      {error ? (
        <div className='flex-1 flex items-center justify-center'>
          <Alert variant='destructive' className='max-w-lg w-full'>
            <div className='flex flex-col items-center text-center'>
              <AlertCircle className='h-8 w-8 mb-2' />
              <AlertTitle className='text-lg mb-2'>
                Unable to Load Pages
              </AlertTitle>
              <AlertDescription className='flex flex-col gap-2'>
                <p>There was an error loading your access pages.</p>
                {error?.message && (
                  <code className='text-sm font-mono bg-destructive/10 p-2 rounded block'>
                    {error?.message}
                  </code>
                )}
                <Button
                  variant='outline'
                  className='mt-4'
                  onClick={() => refetch()}
                >
                  Try again
                </Button>
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
              onDelete={(id: string, title: string) =>
                setDeletePageData({ id, title })
              }
            />
          ))}
        </div>
      )}

      <CreateAccessPageDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateAccessPage={onCreateAccessPage}
        isLoading={createPageMutation.isPending}
      />

      <DeletePageDialog
        isOpen={!!deletePageData}
        isLoading={deletePageMutation.isPending}
        pageName={deletePageData?.title ?? ''}
        onClose={() => setDeletePageData(null)}
        onConfirm={() =>
          deletePageData?.id && deletePageMutation.mutate(deletePageData.id)
        }
      />
    </div>
  );
}

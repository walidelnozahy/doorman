'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import { deleteAccessPage } from '@/app/actions/delete-access-page';

export const useDeletePageDialog = () => {
  const [pageName, setPageName] = useQueryState('delete-page-name');
  const [pageId, setPageId] = useQueryState('delete-page-id');

  const isOpen = !!pageName && !!pageId;
  const toggleIsOpen = (pageId?: string, pageName?: string) => {
    if (pageId && pageName) {
      setPageName(pageName);
      setPageId(pageId);
    } else {
      setPageName(null);
      setPageId(null);
    }
  };
  return {
    pageName,
    pageId,
    isOpen,
    toggleIsOpen,
  };
};

export function DeletePageDialog() {
  const { pageId, pageName, isOpen, toggleIsOpen } = useDeletePageDialog();
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!pageId) return;

    try {
      setPending(true);
      const result = await deleteAccessPage(pageId);

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Page deleted successfully',
          variant: 'default',
        });

        toggleIsOpen();
      } else if (result.error?._global) {
        toast({
          title: 'Error',
          description: result.error._global,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <AlertDialog
      open={!!isOpen}
      onOpenChange={(open) => {
        if (!pending || !open) {
          toggleIsOpen();
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the access page "{pageName}" and remove
            all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={pending}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            type='button'
          >
            {pending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                <span>Deleting...</span>
              </>
            ) : (
              'Delete Page'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

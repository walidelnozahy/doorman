'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { deleteDomain } from '@/app/actions/delete-domain';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface DeleteDomainButtonProps {
  domain: string;
}

export function DeleteDomainButton({ domain }: DeleteDomainButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deleteDomain({ domain });

      if (result.success) {
        toast({
          title: 'Domain deleted',
          description: `The domain ${domain} has been successfully deleted.`,
        });

        // Refresh the current page to update the domains list
        router.refresh();
      } else {
        toast({
          title: 'Error',
          description:
            result.globalError || 'Failed to delete domain. Please try again.',
          variant: 'destructive',
        });
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Error deleting domain:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while deleting the domain.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant='ghost' size='icon' className='h-9 w-9 p-0'>
          <Trash2 className='h-4 w-4' />
          <span className='sr-only'>Delete domain</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this domain?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the domain{' '}
            <span className='font-medium'>{domain}</span> from your project.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

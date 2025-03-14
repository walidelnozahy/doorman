'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateConnectionDialog } from './create-connection-dialog';
import { parseAsBoolean, useQueryState } from 'nuqs';

type CreateConnectionButtonProps = {
  pageId: string;
  providerAccountId: string;
};

/**
 * This hook is used to manage the state of the create connection dialog
 * It uses URL query parameters to persist state across page refreshes
 * @param pageId - The ID of the page to create a connection for
 * @returns {isOpen: boolean, setIsOpen: (isOpen: boolean) => void}
 */
export const useCreateConnectionDialog = (pageId: string) => {
  const [isOpen, setIsOpen] = useQueryState(
    `create-connection-${pageId}`,
    parseAsBoolean,
  );

  return {
    isOpen,
    setIsOpen,
  };
};

export function CreateConnectionButton({
  pageId,
  providerAccountId,
}: CreateConnectionButtonProps) {
  const { isOpen, setIsOpen } = useCreateConnectionDialog(pageId);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size='sm'>
        <Plus className='h-4 w-4 mr-2' />
        Create Connection
      </Button>

      <CreateConnectionDialog
        isOpen={!!isOpen}
        onClose={() => setIsOpen(null)}
        pageId={pageId}
        providerAccountId={providerAccountId}
      />
    </>
  );
}

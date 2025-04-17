'use client';

import { PlusIcon } from 'lucide-react';
import { Button } from '../../../ui/button';
import { useCreateAccessPageDialog } from '@/hooks/use-create-access-page-dialog';

/**
 * This component is used to create a button that opens the create access page dialog
 * @returns {React.ReactNode}
 */
export const CreateAccessPageButton = () => {
  const { setIsOpen } = useCreateAccessPageDialog();

  return (
    <Button onClick={() => setIsOpen(true)}>
      <PlusIcon className='mr-2 h-4 w-4' /> Create Access Page
    </Button>
  );
};

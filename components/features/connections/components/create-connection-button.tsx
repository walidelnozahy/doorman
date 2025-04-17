'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCreateConnectionDialog } from '../hooks/use-create-connection-dialog';

type CreateConnectionButtonProps = {
  pageId: string;
};

export function CreateConnectionButton({}: CreateConnectionButtonProps) {
  const { setIsOpen } = useCreateConnectionDialog();

  return (
    <Button onClick={() => setIsOpen(true)} size='sm'>
      <Plus className='h-4 w-4 mr-2' />
      Create Connection
    </Button>
  );
}

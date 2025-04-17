'use client';

import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAddDomainDialog } from '@/components/features/custom-domains/hooks/use-add-domain-dialog';

/**
 * This component is used to create a button that opens the add domain dialog
 * @returns {React.ReactNode}
 */
export const AddDomainButton = () => {
  const { setIsOpen } = useAddDomainDialog();

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size='sm'>
        <Globe className='mr-2 h-4 w-4' /> Add Domain
      </Button>
    </>
  );
};

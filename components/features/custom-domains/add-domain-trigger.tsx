'use client';
import { AddDomainButton } from './components/add-domain-button';
import { AddDomainDialog } from './components/add-domain-dialog';
import { useAddDomainDialog } from './hooks/use-add-domain-dialog';

export const AddDomainTrigger = () => {
  const { isOpen } = useAddDomainDialog();

  return (
    <>
      <AddDomainButton />
      {isOpen && <AddDomainDialog />}
    </>
  );
};

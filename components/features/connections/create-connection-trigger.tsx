'use client';
import { useParams } from 'next/navigation';
import { CreateConnectionButton } from './components/create-connection-button';
import { CreateConnectionDialog } from './components/create-connection-dialog';
import { useCreateConnectionDialog } from './hooks/use-create-connection-dialog';

export const CreateConnectionTrigger = ({
  providerAccountId,
}: {
  providerAccountId: string;
}) => {
  const params = useParams();
  const { pageId } = params as { pageId: string };
  const { isOpen, setIsOpen } = useCreateConnectionDialog();

  if (!pageId || !providerAccountId) {
    console.error('Missing required parameters for creating connection');
    return null;
  }
  return (
    <>
      <CreateConnectionButton pageId={pageId} />
      <CreateConnectionDialog
        isOpen={!!isOpen}
        onClose={() => setIsOpen(null)}
        pageId={pageId}
        providerAccountId={providerAccountId}
      />
    </>
  );
};

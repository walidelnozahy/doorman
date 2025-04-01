'use client';

import { parseAsBoolean, useQueryState } from 'nuqs';

/**
 * This hook is used to manage the state of the create access page dialog
 * It is used to open and close the dialog
 * It is also used to reset the dialog state when the dialog is closed
 * @returns {isOpen: boolean, setIsOpen: (isOpen: boolean) => void}
 */
export const useCreateAccessPageDialog = () => {
  const [isOpen, setIsOpen] = useQueryState(
    'create-access-page',
    parseAsBoolean,
  );

  return {
    isOpen,
    setIsOpen,
  };
};

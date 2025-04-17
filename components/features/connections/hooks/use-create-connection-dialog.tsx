import { parseAsBoolean } from 'nuqs';
import { useQueryState } from 'nuqs';

/**
 * This hook is used to manage the state of the create connection dialog
 * It uses URL query parameters to persist state across page refreshes
 * @param pageId - The ID of the page to create a connection for
 * @returns {isOpen: boolean, setIsOpen: (isOpen: boolean) => void}
 */
export const useCreateConnectionDialog = () => {
  const [isOpen, setIsOpen] = useQueryState(
    `create-connection`,
    parseAsBoolean,
  );

  return {
    isOpen,
    setIsOpen,
  };
};

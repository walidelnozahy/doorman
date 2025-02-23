import { Page } from '@/utils/types';
import { Button } from './ui/button';
import {
  CopyIcon,
  ExternalLinkIcon,
  MoreVerticalIcon,
  TrashIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Link from 'next/link';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'timeago.js';

export type Column = {
  id: string;
  header: string;
  className?: string;
  cell: (page: Page) => React.ReactNode;
};

type StatusType =
  | 'connecting'
  | 'connected'
  | 'disconnecting'
  | 'disconnected'
  | 'idle';

const statusStyles: Record<StatusType, { label: string; className: string }> = {
  idle: {
    label: 'Idle',
    className:
      'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-500',
  },
  connecting: {
    label: 'Connecting',
    className:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500',
  },
  connected: {
    label: 'Connected',
    className:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500',
  },
  disconnecting: {
    label: 'Disconnecting',
    className:
      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-500',
  },
  disconnected: {
    label: 'Disconnected',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500',
  },
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  // You could add a toast notification here
};

type ColumnProps = {
  onDeleteClick?: (page: Page) => void;
};

export const createColumns = ({
  onDeleteClick,
}: ColumnProps = {}): Column[] => [
  {
    id: 'name',
    header: 'Name',
    className: 'w-[200px]',
    cell: (page) => <span className='font-medium'>{page.name}</span>,
  },
  {
    id: 'accountId',
    header: 'Account ID',
    className: 'w-[150px]',
    cell: function AccountIdCell(page) {
      return (
        <div className='flex items-center gap-2'>
          <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm'>
            {page.provider_account_id}
          </code>
          <CopyButton
            text={page.provider_account_id}
            message='Copied account ID'
          />
        </div>
      );
    },
  },
  {
    id: 'permissions',
    header: 'Permissions',
    className: 'w-[200px]',
    cell: (page) => {
      const permissions =
        typeof page.permissions === 'string'
          ? JSON.parse(page.permissions)
          : page.permissions;

      const truncatedJson = JSON.stringify(permissions).slice(0, 35) + '...';

      return (
        <div className='flex items-center gap-2'>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs truncate block cursor-help'>
                  {truncatedJson}
                </code>
              </TooltipTrigger>
              <TooltipContent side='right' className='max-w-[500px] p-0'>
                <ScrollArea className='h-[200px] w-[350px] p-4'>
                  <pre className='font-mono text-xs'>
                    {JSON.stringify(permissions, null, 2)}
                  </pre>
                </ScrollArea>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <CopyButton
            text={JSON.stringify(permissions, null, 2)}
            message='Copied permissions'
          />
        </div>
      );
    },
  },
  {
    id: 'note',
    header: 'Note',
    cell: (page) => (
      <span className='max-w-[300px] truncate text-muted-foreground'>
        {page.note}
      </span>
    ),
  },
  {
    id: 'created',
    header: 'Created',
    className: 'w-[120px]',
    cell: (page) => {
      if (!page.created_at) return null;

      const date = new Date(page.created_at);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const formattedDate =
        date < oneWeekAgo
          ? date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : format(date);

      return <span className='text-muted-foreground'>{formattedDate}</span>;
    },
  },
  {
    id: 'actions',
    header: '',
    className: 'w-[80px] text-right',
    cell: function ActionsCell(page) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='h-8 w-8'>
              <MoreVerticalIcon className='h-4 w-4' />
              <span className='sr-only'>Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem asChild>
              <Link
                href={`/${page.id}`}
                className='flex items-center'
                target='_blank'
              >
                <ExternalLinkIcon className='mr-2 h-4 w-4' />
                Open Page
              </Link>
            </DropdownMenuItem>
            <CopyLinkMenuItem pageId={page.id ?? ''} connectionId={''} />
            <DropdownMenuItem
              className='text-destructive'
              onClick={() => onDeleteClick?.(page)}
            >
              <TrashIcon className='mr-2 h-4 w-4' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function CopyButton({ text, message }: { text: string; message: string }) {
  const { copyToClipboard } = useCopyToClipboard();

  return (
    <Button
      variant='ghost'
      size='icon'
      className='h-6 w-6'
      onClick={(e) => {
        e.stopPropagation();
        copyToClipboard(text, message);
      }}
    >
      <CopyIcon className='h-3 w-3' />
      <span className='sr-only'>Copy text</span>
    </Button>
  );
}

function CopyLinkMenuItem({
  pageId,
  connectionId,
}: {
  pageId: string;
  connectionId: string;
}) {
  const { copyToClipboard } = useCopyToClipboard();

  return (
    <DropdownMenuItem
      onClick={() =>
        copyToClipboard(
          `${window.location.origin}/${pageId}`,
          'Copied page link',
        )
      }
    >
      <CopyIcon className='mr-2 h-4 w-4' />
      Copy Link
    </DropdownMenuItem>
  );
}

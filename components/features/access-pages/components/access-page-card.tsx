'use client';

import { Page } from '@/utils/types';
import {
  CopyIcon,
  ExternalLink,
  GlobeLockIcon,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useEffect, useState } from 'react';
import { fetchConnections } from '@/app/actions/fetch-connections';
import config from '@/config';
import { useDeletePageDialog } from './delete-access-page-dialog';
import { CopyButton } from '@/components/copy-button';
import { AwsIcon } from '@/components/icons/aws-icon';

interface PageCardProps {
  page: Page;
}

export function AccessPageCard({ page }: PageCardProps) {
  const { toggleIsOpen } = useDeletePageDialog();
  const { copyToClipboard } = useCopyToClipboard();
  const [connectionCount, setConnectionCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const pageUrl = `${config.origin || ''}/${page.slug || ''}`;

  // Fetch connections using server action
  useEffect(() => {
    const getConnections = async () => {
      setIsLoading(true);
      try {
        const connections = await fetchConnections(page.id || '');
        setConnectionCount(connections.length);
      } catch (error) {
        console.error('Error fetching connections:', error);
        setConnectionCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    getConnections();
  }, [page.id]);

  // Extract just the account number from the provider_account_id
  const accountNumber = page.provider_account_id;

  return (
    <Link
      href={`/pages/${page.id}`}
      className='block group'
      suppressHydrationWarning
    >
      <Card
        className='
          overflow-hidden
          transition-all
          duration-200
          border border-border/80
          hover:border-primary/70
          hover:shadow-xl
          cursor-pointer
          min-w-[320px]
          rounded-xl
          hover:bg-accent/10
          relative
          shadow-sm
          px-5 py-4
          flex flex-col
          
        '
      >
        <CardHeader className='px-0 py-0 space-y-0'>
          <div className='flex justify-between items-start gap-3'>
            <div className='min-w-0 flex flex-col gap-1'>
              <div className='flex items-center gap-2'>
                <AwsIcon className='h-4 w-4 text-primary/80' />
                <CardTitle className='text-base font-semibold truncate text-foreground group-hover:text-primary transition-colors duration-300'>
                  {page.title}
                </CardTitle>
              </div>
              <div className='flex items-center gap-2 text-xs text-muted-foreground/80'>
                <span className='max-w-[180px] truncate font-mono text-[13px] text-muted-foreground/90 group-hover:text-foreground/90 transition-colors duration-300'>
                  {pageUrl}
                </span>
                <CopyButton
                  value={pageUrl}
                  size='icon'
                  className='h-5 w-5 text-muted-foreground/70 hover:text-primary'
                />
              </div>
            </div>
            <div className='flex flex-col items-end gap-1 min-w-[60px]'>
              <div className='flex items-center gap-1.5 text-xs text-foreground/70 font-mono'>
                <span>{accountNumber}</span>
                <CopyButton
                  value={accountNumber}
                  size='icon'
                  className='h-4 w-4 text-muted-foreground/70 hover:text-primary'
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-6 w-6 text-muted-foreground/60 hover:text-primary/80'
                  >
                    <MoreHorizontal className='h-4 w-4' />
                    <span className='sr-only'>Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      copyToClipboard(`${pageUrl}/${page.id}`);
                    }}
                  >
                    <CopyIcon className='h-4 w-4 mr-2' />
                    Copy URL
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(pageUrl, '_blank');
                    }}
                  >
                    <ExternalLink className='h-4 w-4 mr-2' />
                    Open in new tab
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className='text-destructive focus:text-destructive'
                    onClick={(e) => {
                      e.preventDefault();
                      toggleIsOpen(page.id, page.title);
                    }}
                  >
                    <Trash2 className='h-4 w-4 mr-2' />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className='px-0 py-0 flex-grow'>
          {page.note ? (
            <CardDescription className='line-clamp-1 text-sm text-muted-foreground/80 group-hover:text-muted-foreground/90 transition-colors duration-300 my-3'>
              {page.note}
            </CardDescription>
          ) : null}
        </CardContent>
        <CardFooter className='px-0 py-0 pt-2 border-t border-border/40 group-hover:border-border/60 transition-colors duration-300 mt-auto'>
          <div className='flex items-center gap-1.5 text-xs text-foreground/70'>
            <GlobeLockIcon className='h-3.5 w-3.5 text-primary/70' />
            {isLoading ? (
              <span className='inline-block w-4 h-3 bg-muted animate-pulse rounded' />
            ) : (
              <span className='font-medium'>{connectionCount}</span>
            )}
            <span className='ml-1 text-muted-foreground/70'>
              connection{connectionCount !== 1 ? 's' : ''}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

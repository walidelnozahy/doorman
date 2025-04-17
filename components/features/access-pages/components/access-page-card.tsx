'use client';

import { Page } from '@/utils/types';
import {
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
        border-border/70
        hover:border-border
        cursor-pointer 
        h-[160px] 
        flex 
        flex-col 
        bg-background
        hover:bg-accent/[0.03]
        relative 
      '
      >
        <CardHeader className='pb-2 space-y-0'>
          <div className='flex justify-between items-start gap-4'>
            <div className='min-w-0 space-y-1.5'>
              <div className='flex items-center gap-2'>
                <GlobeLockIcon className='h-4 w-4 text-muted-foreground/70' />
                <CardTitle className='text-[15px] font-medium truncate text-foreground/90 group-hover:text-foreground transition-colors duration-300'>
                  {page.title}
                </CardTitle>
              </div>
              <div className='flex items-center gap-2 text-sm text-muted-foreground/60'>
                <span className='max-w-[280px] truncate group-hover:text-muted-foreground/80 transition-colors duration-300'>
                  {pageUrl}
                </span>
                <CopyButton value={pageUrl} size='sm' />
              </div>
            </div>
            <div onClick={(e) => e.preventDefault()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-6 w-6 text-muted-foreground/50 hover:text-accent transition-colors duration-200'
                  >
                    <MoreHorizontal className='h-3 w-3' />
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
                    <CopyButton value={`${pageUrl}/${page.id}`}>
                      Copy URL
                    </CopyButton>
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
        <CardContent className='pb-2 flex-grow'>
          {page.note ? (
            <CardDescription className='line-clamp-2 text-sm text-muted-foreground/60 group-hover:text-muted-foreground/70 transition-colors duration-300'>
              {page.note}
            </CardDescription>
          ) : (
            <div className='h-10'></div>
          )}
        </CardContent>
        <div className='border-t border-border/40 group-hover:border-border/50 transition-colors duration-300 mt-auto'></div>
        <CardFooter className='px-6 py-2.5 flex justify-between items-center'>
          <div className='flex items-center text-muted-foreground/60 group-hover:text-muted-foreground/70 text-sm gap-2 transition-colors duration-300'>
            <span>
              {isLoading ? (
                <span className='inline-block w-4 h-3 bg-muted animate-pulse rounded'></span>
              ) : (
                `${connectionCount} connection${connectionCount !== 1 ? 's' : ''}`
              )}
            </span>
          </div>
          <div className='flex items-center gap-1.5 text-xs text-muted-foreground/50'>
            <AwsIcon className='h-5 w-5' />
            <span>{accountNumber}</span>
            <CopyButton
              value={accountNumber}
              size='sm'
              variant='ghost'
              className='h-5 w-5'
            />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

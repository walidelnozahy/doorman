'use client';

import { Page } from '@/utils/types';
import {
  Copy,
  ExternalLink,
  GlobeLockIcon,
  Link2,
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
import { Badge } from '@/components/ui/badge';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useEffect, useState } from 'react';
import { fetchConnections } from '@/app/actions/fetch-connections';
import { hostName, origin } from '@/config';

interface PageCardProps {
  page: Page;
  onDeleteClick: () => void;
}

export function PageCard({ page, onDeleteClick }: PageCardProps) {
  const { copyToClipboard } = useCopyToClipboard();
  const [connectionCount, setConnectionCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const pageUrl = `${hostName || ''}/${page.slug}`;
  const urlToOpen = `${origin || ''}/${page.slug}`;

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
    <Link href={`/pages/${page.id}`} className='block' suppressHydrationWarning>
      <Card className='overflow-hidden hover:shadow-md transition-all duration-200 hover:bg-accent/20 cursor-pointer h-[150px] flex flex-col'>
        <CardHeader className='pb-2'>
          <div className='flex justify-between items-center gap-4'>
            <div className='min-w-0 max-w-[70%]'>
              <CardTitle className='text-base font-medium truncate'>
                {page.title}
              </CardTitle>
            </div>
            <div className='flex items-center gap-3 shrink-0'>
              <Badge variant='secondary' className='text-xs font-normal'>
                {accountNumber}
              </Badge>
              <div onClick={(e) => e.preventDefault()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 text-muted-foreground'
                    >
                      <MoreHorizontal className='h-4 w-4' />
                      <span className='sr-only'>Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        copyToClipboard(`${window.location.origin}/${page.id}`);
                      }}
                    >
                      <Copy className='h-4 w-4 mr-2' />
                      Copy URL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(urlToOpen, '_blank');
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
                        onDeleteClick();
                      }}
                    >
                      <Trash2 className='h-4 w-4 mr-2' />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className='pb-2 flex-grow'>
          {page.note ? (
            <CardDescription className='line-clamp-2'>
              {page.note}
            </CardDescription>
          ) : (
            <div className='h-10'></div> // Empty space placeholder when no note
          )}
        </CardContent>
        <div className='border-t border-border mt-auto'></div>
        <CardFooter className='px-6 py-2 flex justify-between items-center'>
          <div className='flex items-center text-muted-foreground text-xs gap-1'>
            <span className='max-w-[150px]'>
              {pageUrl.length > 30
                ? `${pageUrl.slice(0, 15)}...${pageUrl.slice(-15)}`
                : pageUrl}
            </span>
            <div className='flex items-center'>
              <Button
                variant='ghost'
                size='icon'
                className='h-6 w-6'
                onClick={(e) => {
                  e.preventDefault();
                  copyToClipboard(pageUrl);
                }}
              >
                <Copy className='h-3 w-3' />
                <span className='sr-only'>Copy URL</span>
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='h-6 w-6'
                onClick={(e) => {
                  e.preventDefault();
                  window.open(urlToOpen, '_blank');
                }}
              >
                <ExternalLink className='h-3 w-3' />
                <span className='sr-only'>Open in new tab</span>
              </Button>
            </div>
          </div>
          <div className='flex items-center text-muted-foreground text-sm'>
            <GlobeLockIcon className='h-3.5 w-3.5 mr-2' />
            <span className='truncate'>
              {isLoading ? (
                <span className='inline-block w-4 h-3 bg-muted animate-pulse rounded'></span>
              ) : (
                `${connectionCount} connection${connectionCount !== 1 ? 's' : ''}`
              )}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

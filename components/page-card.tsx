import { Page } from '@/utils/types';
import { formatDate } from '@/utils/ago';
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
import { useQuery } from '@tanstack/react-query';
import { fetchHandler } from '@/utils/queries';
import { Connection } from '@/utils/types';
import { Badge } from '@/components/ui/badge';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

interface PageCardProps {
  page: Page;
  onDelete: (id: string, name: string) => void;
}

export function PageCard({ page, onDelete }: PageCardProps) {
  const { copyToClipboard } = useCopyToClipboard();

  const pageUrl = `${window.location.origin}/${page.id}`;

  // Query for connections related to this page
  const { data: connections, isLoading } = useQuery({
    queryKey: ['connections-count', page.id],
    queryFn: async () => {
      const connections = await fetchHandler(
        `/api/connections?pageId=${page.id}`,
      );
      return connections as Connection[];
    },
    // Don't refetch on window focus for better performance
    refetchOnWindowFocus: false,
  });

  const connectionCount = connections?.length || 0;

  // Extract just the account number from the provider_account_id
  const accountNumber = page.provider_account_id;

  return (
    <Link href={`/pages/${page.id}`} className='block'>
      <Card className='overflow-hidden hover:shadow-md transition-all duration-200 hover:bg-accent/20 cursor-pointer'>
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
                        copyToClipboard(pageUrl);
                      }}
                    >
                      <Copy className='h-4 w-4 mr-2' />
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
                        onDelete(page.id!, page.title);
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
          {/* {page.note && (
            <CardDescription className='line-clamp-2 h-10 mt-4'>
              {page.note}
            </CardDescription>
          )} */}
        </CardHeader>
        <CardContent className='pb-2'>
          {page.note && (
            <CardDescription className='line-clamp-2 h-10 '>
              {page.note}
            </CardDescription>
          )}
        </CardContent>
        <div className='border-t border-border'></div>
        <CardFooter className='px-6 py-2 flex justify-between items-center'>
          <div className='flex items-center text-muted-foreground text-xs gap-1'>
            <span className='truncate max-w-[180px]'>{pageUrl}</span>
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
                  window.open(pageUrl, '_blank');
                }}
              >
                <ExternalLink className='h-3 w-3' />
                <span className='sr-only'>Open in new tab</span>
              </Button>
            </div>
          </div>
          <div className='flex items-center text-muted-foreground text-sm'>
            <GlobeLockIcon className='h-3.5 w-3.5 mr-2' />
            <span>
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

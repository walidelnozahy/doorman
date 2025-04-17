import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function AccessPageDetailsSkeleton() {
  return (
    <div className='container mx-auto py-10 space-y-8'>
      {/* Header skeleton */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <Skeleton className='h-8 w-64' />
        <div className='flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-4'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-9 w-24' />
            <Skeleton className='h-9 w-32' />
          </div>
        </div>
      </div>

      {/* Page Details Card skeleton */}
      <Card>
        <CardContent className='pt-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 h-full'>
            {/* Left Column - Details */}
            <div className='space-y-6'>
              <div>
                <Skeleton className='h-4 w-16 mb-2' />
                <Skeleton className='h-6 w-48' />
              </div>

              <div>
                <Skeleton className='h-4 w-24 mb-2' />
                <Skeleton className='h-6 w-36' />
              </div>

              <div>
                <Skeleton className='h-4 w-16 mb-2' />
                <Skeleton className='h-6 w-32' />
              </div>

              <div>
                <Skeleton className='h-4 w-12 mb-2' />
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-3/4' />
                </div>
              </div>
            </div>

            {/* Right Column - Permissions */}
            <div>
              <Skeleton className='h-4 w-24 mb-2' />
              <Skeleton className='h-[200px] w-full rounded-lg' />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connections Section skeleton */}
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='h-9 w-40' />
        </div>

        {/* Connection Stats skeleton */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className='pb-2'>
                <Skeleton className='h-4 w-32' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-8 w-12' />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Connections Table skeleton */}
        <div className='rounded-md border'>
          <div className='w-full'>
            {/* Table header */}
            <div className='flex items-center p-4 border-b'>
              <div className='flex-1'>
                <Skeleton className='h-4 w-28' />
              </div>
              <div className='flex-1'>
                <Skeleton className='h-4 w-28' />
              </div>
              <div className='flex-1'>
                <Skeleton className='h-4 w-24' />
              </div>
              <div className='flex-1'>
                <Skeleton className='h-4 w-16' />
              </div>
              <div className='flex-1'>
                <Skeleton className='h-4 w-16' />
              </div>
              <div className='w-[100px]'></div>
            </div>

            {/* Table rows */}
            {[1, 2, 3].map((row) => (
              <div
                key={row}
                className='flex items-center p-4 border-b last:border-0'
              >
                <div className='flex-1'>
                  <Skeleton className='h-5 w-24' />
                </div>
                <div className='flex-1'>
                  <Skeleton className='h-5 w-24' />
                </div>
                <div className='flex-1'>
                  <Skeleton className='h-5 w-32' />
                </div>
                <div className='flex-1'>
                  <Skeleton className='h-5 w-20' />
                </div>
                <div className='flex-1'>
                  <Skeleton className='h-6 w-24' />
                </div>
                <div className='w-[100px] flex justify-end gap-2'>
                  <Skeleton className='h-8 w-8 rounded-full' />
                  <Skeleton className='h-8 w-8 rounded-full' />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

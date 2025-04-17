import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export function ConnectionPageSkeleton() {
  return (
    <div className='flex items-center justify-center p-4'>
      <div className='w-full max-w-3xl space-y-8'>
        <div className='text-center space-y-4'>
          <Skeleton className='h-8 w-[300px] mx-auto' />
          <Skeleton className='h-4 w-[200px] mx-auto' />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-[200px]' />
          </CardHeader>
          <CardContent className='space-y-6'>
            <Skeleton className='h-[200px] w-full' />
            <Skeleton className='h-20 w-full' />
          </CardContent>
          <CardFooter className='flex justify-center'>
            <Skeleton className='h-12 w-[300px]' />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

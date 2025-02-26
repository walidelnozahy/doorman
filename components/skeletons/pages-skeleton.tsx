import { Skeleton } from '../ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';

export const PagesSkeleton = () => {
  return (
    <div className='container mx-auto py-10 flex flex-col'>
      <div className='flex justify-between items-center mb-6'>
        <Skeleton className='h-8 w-[200px]' />
        <Skeleton className='h-10 w-[180px]' />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <Card key={index} className='overflow-hidden'>
            <CardHeader className='pb-2'>
              <div className='flex justify-between items-center'>
                <Skeleton className='h-6 w-[180px]' />
                <div className='flex items-center gap-3'>
                  <Skeleton className='h-4 w-[80px]' />
                  <Skeleton className='h-8 w-8 rounded-full' />
                </div>
              </div>
              <div className='mt-2'>
                <Skeleton className='h-4 w-full mt-2' />
                <Skeleton className='h-4 w-3/4 mt-2' />
              </div>
            </CardHeader>
            <CardContent className='pb-2'>
              {/* Empty content area to match the real card */}
            </CardContent>
            <CardFooter className='pt-2 flex justify-between items-center'>
              <Skeleton className='h-4 w-[140px]' />
              <Skeleton className='h-4 w-[120px]' />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

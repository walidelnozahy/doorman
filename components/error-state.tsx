import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorStateProps {
  title?: string;
  description?: string;
  error?: Error;
  className?: string;
}

export function ErrorState({
  title = 'Unable to Load Data',
  description = 'There was an error loading the requested data.',
  error,
  className,
}: ErrorStateProps) {
  return (
    <div className='flex-1 flex items-center justify-center p-4'>
      <Alert variant='destructive' className={`max-w-lg w-full ${className}`}>
        <div className='flex flex-col items-center text-center'>
          <AlertCircle className='h-8 w-8 mb-2' />
          <AlertTitle className='text-lg mb-2'>{title}</AlertTitle>
          <AlertDescription className='flex flex-col gap-2'>
            <p>{description}</p>
            {error?.message && (
              <code className='text-sm font-mono bg-destructive/10 p-2 rounded block'>
                {error.message}
              </code>
            )}
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
}

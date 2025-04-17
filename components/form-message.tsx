export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FormMessage({ message }: { message: Message }) {
  return (
    <div className='flex flex-col gap-3 w-full max-w-md text-sm'>
      {'success' in message && (
        <div className='flex items-start gap-2 p-3 rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 animate-fade-in'>
          <CheckCircle className='h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0' />
          <p>{message.success}</p>
        </div>
      )}
      {'error' in message && (
        <div className='flex items-start gap-2 p-3 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 animate-fade-in'>
          <AlertCircle className='h-5 w-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0' />
          <p>{message.error}</p>
        </div>
      )}
      {'message' in message && (
        <div className='flex items-start gap-2 p-3 rounded-md bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 animate-fade-in'>
          <Info className='h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0' />
          <p>{message.message}</p>
        </div>
      )}
    </div>
  );
}

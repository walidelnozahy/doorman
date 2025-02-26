import { Inbox } from 'lucide-react';
import { ReactNode } from 'react';

export const EmptyState = ({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) => {
  return (
    <div className='h-[50vh] flex flex-col items-center justify-center'>
      <Inbox
        className='w-20 h-auto mb-2 text-muted-foreground'
        strokeWidth={1}
      />
      <div className='text-center text-muted-foreground max-w-sm mb-4'>
        {title}
        <br />
        {description}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

import { Badge } from './ui/badge';
import { cn } from '@/utils/cn';

export const StatusBadge = ({
  status,
  variant = 'success',
}: {
  status: string;
  variant?: 'success' | 'destructive' | 'outline';
}) => {
  const normalizedStatus = status.toLowerCase();

  // Determine the appropriate styling based on status
  const getStatusStyles = () => {
    switch (normalizedStatus) {
      case 'connected':
        return { indicator: 'bg-green-500' };
      case 'disconnected':
        return { indicator: 'bg-red-500' };
      case 'connecting':
      case 'disconnecting':
        return {
          indicator: 'bg-orange-500 animate-pulse',
        };
      default:
        return { indicator: 'bg-gray-500' };
    }
  };

  const { indicator } = getStatusStyles();

  // Capitalize first letter
  const displayStatus =
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <Badge
      variant={variant as any}
      className='flex items-center gap-1.5 px-2 w-fit'
    >
      <div className={cn('w-2 h-2 rounded-full', indicator)}></div>
      {displayStatus}
    </Badge>
  );
};

import { cn } from '@/utils/cn';
import { ConnectionStatus } from '@/utils/types';

// Map connection status to StatusBadge status
export const getStatusBadgeStatus = (status: ConnectionStatus) => {
  switch (status) {
    case 'connected':
      return 'active';
    case 'connecting':
    case 'disconnecting':
      return 'pending';
    case 'disconnected':
      return 'inactive';
    default:
      return 'inactive';
  }
};

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'error';
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const statusConfig = {
  active: {
    dotColor: 'bg-emerald-500/70',
    pulseColor: 'bg-emerald-400/40',
    textColor: 'text-emerald-500',
    defaultText: 'Active',
  },
  inactive: {
    dotColor: 'bg-muted-foreground/30',
    pulseColor: 'bg-muted-foreground/20',
    textColor: 'text-muted-foreground',
    defaultText: 'Inactive',
  },
  pending: {
    dotColor: 'bg-orange-500/70',
    pulseColor: 'bg-orange-400/40',
    textColor: 'text-orange-500',
    defaultText: 'Pending',
  },
  error: {
    dotColor: 'bg-destructive/70',
    pulseColor: 'bg-destructive/40',
    textColor: 'text-destructive',
    defaultText: 'Error',
  },
} as const;

const sizeConfig = {
  sm: {
    dotSize: 'h-1.5 w-1.5',
    textSize: 'text-xs',
    gap: 'gap-2',
  },
  md: {
    dotSize: 'h-2 w-2',
    textSize: 'text-sm',
    gap: 'gap-2.5',
  },
  lg: {
    dotSize: 'h-2.5 w-2.5',
    textSize: 'text-base',
    gap: 'gap-3',
  },
} as const;

export function StatusBadge({
  status,
  showText = true,
  size = 'md',
  className,
  text,
}: StatusBadgeProps) {
  const { dotColor, pulseColor, textColor, defaultText } = statusConfig[status];
  const { dotSize, textSize, gap } = sizeConfig[size];

  const displayText = text || defaultText;

  return (
    <div className={cn('flex items-center', gap, className)}>
      <div className='relative flex'>
        <span
          className={cn(
            'animate-ping absolute inline-flex h-full w-full rounded-full',
            pulseColor,
          )}
        />
        <span
          className={cn('relative inline-flex rounded-full', dotSize, dotColor)}
        />
      </div>
      {showText && (
        <span className={cn('font-medium', textSize, textColor)}>
          {displayText}
        </span>
      )}
    </div>
  );
}

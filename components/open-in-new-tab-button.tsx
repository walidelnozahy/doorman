'use client';

import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/utils/cn';

interface OpenInNewTabButtonProps {
  path: string;
  // Optional text to show next to the icon
  children?: React.ReactNode;
  // Size of the button
  size?: 'default' | 'sm' | 'lg' | 'icon';
  // Additional class names
  className?: string;
  // Optional variant override
  variant?: 'ghost' | 'default' | 'secondary' | 'outline';
}

export function OpenInNewTabButton({
  path,
  children,
  size = 'default',
  className,
  variant = 'outline',
}: OpenInNewTabButtonProps) {
  // Icon sizes mapped to button sizes
  const iconSizes = {
    default: 'h-4 w-4',
    sm: 'h-3 w-3',
    lg: 'h-5 w-5',
    icon: 'h-3 w-3',
  };

  const buttonSizes = {
    default: 'h-9 w-9',
    sm: 'h-7 w-7',
    lg: 'h-11 w-11',
    icon: 'h-6 w-6',
  };

  const iconSize = iconSizes[size as keyof typeof iconSizes];
  const isIconOnly = !children;

  return (
    <Button
      variant={variant}
      size={isIconOnly ? 'icon' : size}
      onClick={() => window.open(path, '_blank')}
      className={cn(
        'transition-colors duration-200',
        isIconOnly && buttonSizes[size as keyof typeof buttonSizes],
        className,
      )}
    >
      <ExternalLink className={cn(iconSize, 'transition-colors')} />
      {children}
    </Button>
  );
}

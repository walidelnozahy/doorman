'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

interface CopyButtonProps {
  value: string;
  // Optional text to show next to the icon
  children?: React.ReactNode;
  // Size of the button
  size?: 'default' | 'sm' | 'lg' | 'icon';
  // Additional class names
  className?: string;
  // Optional variant override
  variant?: 'ghost' | 'default' | 'secondary' | 'outline';
}

export function CopyButton({
  value,
  children,
  size = 'default',
  className,
  variant = 'ghost',
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const { copyToClipboard } = useCopyToClipboard();

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    copyToClipboard(value);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

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

  const Icon = hasCopied ? Check : Copy;
  const iconSize = iconSizes[size as keyof typeof iconSizes];
  const isIconOnly = !children;

  return (
    <Button
      variant={variant}
      size={isIconOnly ? 'icon' : size}
      onClick={handleCopy}
      className={cn(
        'transition-colors duration-200',
        isIconOnly && buttonSizes[size as keyof typeof buttonSizes],
        hasCopied && 'text-green-500',
        className,
      )}
    >
      <Icon className={cn(iconSize, 'transition-colors')} />
      {children}
    </Button>
  );
}

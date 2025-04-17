'use client';

import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { verifyDomain } from '@/app/actions/verify-domain';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { ToastProps } from '@/components/ui/toast';

interface CheckDomainStatusButtonProps {
  domain: string;
  isVerified: boolean;
  isConfigured: boolean;
}

type StatusMessage = {
  title: string;
  description: string;
  icon: React.ElementType;
  variant: NonNullable<ToastProps['variant']>;
  iconClassName: string;
};

export function CheckDomainStatusButton({
  domain,
  isVerified,
  isConfigured,
}: CheckDomainStatusButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const getStatusMessage = (
    verified: boolean,
    configured: boolean,
  ): StatusMessage => {
    if (verified && configured) {
      return {
        title: 'Domain is ready!',
        description: 'Your domain is verified and properly configured.',
        icon: CheckCircle2,
        variant: 'default',
        iconClassName: 'text-emerald-500',
      };
    } else if (verified && !configured) {
      return {
        title: 'Configuration pending',
        description:
          'Domain is verified, but DNS configuration is still pending. Please add the required DNS records.',
        icon: AlertTriangle,
        variant: 'default',
        iconClassName: 'text-amber-500',
      };
    } else if (!verified && configured) {
      return {
        title: 'Verification pending',
        description:
          'DNS is configured, but domain verification is still pending. Please add the verification record.',
        icon: AlertTriangle,
        variant: 'default',
        iconClassName: 'text-amber-500',
      };
    } else {
      return {
        title: 'Setup required',
        description:
          'Domain verification and DNS configuration are pending. Please add the required DNS records.',
        icon: AlertCircle,
        variant: 'default',
        iconClassName: 'text-amber-500',
      };
    }
  };

  const handleCheck = async () => {
    setIsLoading(true);
    try {
      const result = await verifyDomain({ domain });
      const message = getStatusMessage(
        result.is_verified,
        result.is_configured,
      );
      const Icon = message.icon;

      toast({
        title: message.title,
        description: message.description,
        variant: message.variant,
        icon: <Icon className={`${message.iconClassName} h-4 w-4`} />,
      });

      // Refresh the page to update the domain status
      router.refresh();
    } catch (error) {
      console.error('Error checking domain status:', error);
      toast({
        title: 'Error checking status',
        description: 'Failed to check domain status. Please try again.',
        variant: 'destructive',
        icon: <XCircle className='text-destructive' />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Only show button if either verification or configuration is pending
  if (isVerified && isConfigured) {
    return null;
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      className='h-8 w-8 p-0'
      onClick={handleCheck}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className='h-4 w-4 animate-spin' />
      ) : (
        <RefreshCw className='h-4 w-4' />
      )}
      <span className='sr-only'>Check domain status</span>
    </Button>
  );
}

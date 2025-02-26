'use client';

import type React from 'react';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Connection } from '@/utils/types';

type CreateConnectionDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreateConnection: (data: Connection) => Promise<void>;
  isLoading: boolean;
  providerAccountId: string; // This will be passed in and displayed as read-only
};

const defaultData = (providerAccountId: string) => ({
  provider_account_id: providerAccountId,
  connection_id: '',
  consumer_account_id: '',
  page_id: '',
});

export function CreateConnectionDialog({
  isOpen,
  onClose,
  onCreateConnection,
  isLoading,
  providerAccountId,
}: CreateConnectionDialogProps) {
  const [formData, setFormData] = useState<Connection>(
    defaultData(providerAccountId),
  );
  const [error, setError] = useState<string | null>(null);

  const validateCustomerAccountId = (value: string) => {
    // Only validate if a value is provided (since it's optional)
    if (value && !/^\d{12}$/.test(value)) {
      setError('Customer Account ID must be exactly 12 digits');
      return false;
    }
    setError(null);
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'consumer_account_id' && value) {
      validateCustomerAccountId(value);
    } else {
      setError(null);
    }
  };

  const handleCustomerAccountIdBlur = () => {
    if (formData.consumer_account_id) {
      validateCustomerAccountId(formData.consumer_account_id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.consumer_account_id &&
      !validateCustomerAccountId(formData.consumer_account_id)
    ) {
      return;
    }

    try {
      await onCreateConnection(formData);
      setFormData(defaultData(providerAccountId));
    } catch (err) {
      setError('Failed to create connection');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Create Connection</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='provider_account_id'>Provider Account ID</Label>
              <Input
                id='provider_account_id'
                name='provider_account_id'
                value={formData.provider_account_id}
                disabled
                className='bg-muted'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='connection_id'>Connection ID</Label>
              <Input
                id='connection_id'
                name='connection_id'
                placeholder='Enter connection ID'
                value={formData.connection_id}
                onChange={(e) => {
                  // Replace spaces with dashes and remove any characters that aren't alphanumeric or dashes
                  const sanitizedValue = e.target.value
                    .replace(/\s+/g, '-')
                    .replace(/[^a-zA-Z0-9-]/g, '');
                  handleInputChange({
                    ...e,
                    target: {
                      ...e.target,
                      value: sanitizedValue,
                      name: 'connection_id',
                    },
                  });
                }}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='consumer_account_id'>
                Customer Account ID (Optional)
              </Label>
              <Input
                id='consumer_account_id'
                name='consumer_account_id'
                placeholder='Enter 12-digit AWS account ID (e.g., 012345678901)'
                value={formData.consumer_account_id}
                onChange={handleInputChange}
                onBlur={handleCustomerAccountIdBlur}
                pattern='\d{12}'
                maxLength={12}
              />
            </div>
          </div>
          {error && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className='flex justify-end'>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className='mr-2'>Creating...</span>
                  <Loader2 className='h-4 w-4 animate-spin' />
                </>
              ) : (
                'Create Connection'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

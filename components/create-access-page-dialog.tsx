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
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Page } from '@/utils/types';

type CreateAccessPageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreateAccessPage: (data: Page) => Promise<void>;
  isLoading: boolean;
};

export function CreateAccessPageDialog({
  isOpen,
  onClose,
  onCreateAccessPage,
  isLoading,
}: CreateAccessPageModalProps) {
  const [formData, setFormData] = useState<Page>({
    name: '',
    provider_account_id: '',
    permissions: {},
    note: '',
  });
  const [permissionsText, setPermissionsText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateAccountId = (value: string) => {
    const accountIdRegex = /^\d{12}$/;
    if (!accountIdRegex.test(value)) {
      setError('Account ID must be exactly 12 digits');
      return false;
    }
    setError(null);
    return true;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === 'permissions') {
      setPermissionsText(value);
      try {
        const parsedPermissions = JSON.parse(value);
        setFormData((prev) => ({ ...prev, permissions: parsedPermissions }));
        setError(null);
      } catch (err) {
        setError('Invalid JSON format');
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name !== 'account_id') {
        setError(null);
      }
    }
  };

  const handleAccountIdBlur = () => {
    validateAccountId(formData.provider_account_id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAccountId(formData.provider_account_id)) {
      return;
    }
    try {
      await onCreateAccessPage(formData);
      setFormData({
        name: '',
        provider_account_id: '',
        permissions: {},
        note: '',
      });
    } catch (err) {
      setError('Invalid JSON in permissions field');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Create Access Page</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                name='name'
                placeholder='Enter a descriptive name for this access page'
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='provider_account_id'>Account ID</Label>
              <Input
                id='provider_account_id'
                name='provider_account_id'
                placeholder='Enter 12-digit AWS account ID (e.g., 012345678901)'
                value={formData.provider_account_id}
                onChange={handleInputChange}
                onBlur={handleAccountIdBlur}
                required
                pattern='\d{12}'
                maxLength={12}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='permissions'>Permissions (JSON)</Label>
              <Textarea
                id='permissions'
                name='permissions'
                placeholder={`{
    "Version": "2012-10-17",
    "Statement": [{
        "Effect": "Allow",
        "Action": [
            "cloudformation:CreateChangeSet"
        ],
        "Resource": "arn:aws:cloudformation:region:aws:transform/Serverless-2016-10-31"
    }]
}`}
                value={permissionsText}
                onChange={handleInputChange}
                required
                className='font-mono text-sm min-h-[300px]'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='note'>Note</Label>
              <Input
                id='note'
                name='note'
                placeholder='Add any additional notes or comments'
                value={formData.note}
                onChange={handleInputChange}
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
                  <Loader2 className='h-4 w-4 animate-spin' />
                  <span className='mr-2'>Creating...</span>
                </>
              ) : (
                'Create Access Page'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

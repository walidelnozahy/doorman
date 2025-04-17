'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState, useEffect, startTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Form, FormField } from '../../../ui/form';
import { useToast } from '@/hooks/use-toast';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { FormGlobalError } from '@/components/form-field-error';
import { createConnection } from '@/app/actions/create-connection';
import { createConnectionSchema } from '@/utils/schema/create-connection-schema';
import { useCreateConnectionDialog } from '../hooks/use-create-connection-dialog';

type CreateConnectionDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  pageId: string;
  providerAccountId: string;
};

const INITIAL_STATE = {
  data: null,
  errors: null,
  success: false,
};

export function CreateConnectionDialog({
  pageId,
  providerAccountId,
}: CreateConnectionDialogProps) {
  const { isOpen, setIsOpen } = useCreateConnectionDialog();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof createConnectionSchema>>({
    resolver: zodResolver(createConnectionSchema),
    defaultValues: {
      connection_id: '',
      consumer_account_id: '',
      provider_account_id: providerAccountId,
      page_id: pageId,
    },
  });

  const [formState, formAction, pending] = useActionState(
    createConnection,
    INITIAL_STATE,
  );

  // Handle dialog close with form reset
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setIsOpen(open);
  };

  const onSubmit = async (data: z.infer<typeof createConnectionSchema>) => {
    try {
      // Convert form data to FormData for the server action
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value || '');
      });

      // Call the server action inside startTransition
      startTransition(() => {
        formAction(formData);
      });
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Effect to handle server-side response
  useEffect(() => {
    // Handle success
    if (formState?.success) {
      toast({
        title: 'Success!',
        description: 'Connection created successfully.',
        variant: 'default',
      });
      setIsOpen(null);
      form.reset();
    }

    // Handle errors
    const errorKeys = Object.keys(formState?.errors || {});
    errorKeys.forEach((errorKey) => {
      if (formState?.errors && errorKey in formState.errors) {
        const errorArray = formState.errors[
          errorKey as keyof typeof formState.errors
        ] as string[];

        if (errorArray && errorArray.length > 0) {
          form.setError(errorKey as any, {
            message: errorArray[0],
          });
        }
      }
    });
  }, [formState, setIsOpen, toast, form]);

  return (
    <Dialog open={!!isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Create Connection</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='provider_account_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider Account ID</FormLabel>
                  <FormControl>
                    <Input {...field} disabled className='bg-muted' />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='connection_id'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Connection ID</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='Enter connection ID'
                        onChange={(e) => {
                          // Replace spaces with dashes and remove any characters that aren't alphanumeric or dashes
                          const sanitizedValue = e.target.value
                            .replace(/\s+/g, '-')
                            .replace(/[^a-zA-Z0-9-]/g, '');
                          field.onChange(sanitizedValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name='consumer_account_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Account ID (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Enter 12-digit AWS account ID (e.g., 012345678901)'
                      pattern='\d{12}'
                      maxLength={12}
                    />
                  </FormControl>
                  <FormDescription>
                    12-digit AWS account ID of the customer
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <input type='hidden' name='page_id' value={pageId} />

            <FormGlobalError error={formState?.errors} />

            <div className='flex justify-end'>
              <Button type='submit' disabled={pending}>
                {pending ? (
                  <>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    <span className='ml-2'>Creating...</span>
                  </>
                ) : (
                  'Create Connection'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

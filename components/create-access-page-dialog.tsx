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
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, PlusIcon } from 'lucide-react';
import { createAccessPage } from '@/app/actions/create-access-page';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { FormGlobalError } from '@/components/form-field-error';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormField } from './ui/form';
import { useToast } from '@/hooks/use-toast';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { createPageSchema } from '@/utils/schema/create-page-schema';
import { useQueryClient } from '@tanstack/react-query';

/**
import { useQueryState } from 'nuqs';
 * This hook is used to manage the state of the create access page dialog
 * It is used to open and close the dialog
 * It is also used to reset the dialog state when the dialog is closed
 * @returns {isOpen: boolean, setIsOpen: (isOpen: boolean) => void}
 */
const useCreateAccessPageDialog = () => {
  const [isOpen, setIsOpen] = useQueryState(
    'create-access-page',
    parseAsBoolean,
  );

  return {
    isOpen,
    setIsOpen,
  };
};

/**
 * This component is used to create a button that opens the create access page dialog
 * @returns {React.ReactNode}
 */
export const CreateAccessPageButton = () => {
  const { setIsOpen } = useCreateAccessPageDialog();

  return (
    <Button onClick={() => setIsOpen(true)}>
      <PlusIcon className='mr-2 h-4 w-4' /> Create Access Page
    </Button>
  );
};

const INITIAL_FORM_VALUES = {
  title: '',
  provider_account_id: '',
  permissions: '',
  note: '',
};
const INITIAL_STATE = {
  data: null,
  errors: null,
  success: false,
};

export function CreateAccessPageDialog() {
  const { isOpen, setIsOpen } = useCreateAccessPageDialog();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof createPageSchema>>({
    resolver: zodResolver(createPageSchema),
    defaultValues: INITIAL_FORM_VALUES,
  });

  const [formState, formAction, pending] = useActionState(
    createAccessPage,
    INITIAL_STATE,
  );

  // Handle dialog close with form reset
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setIsOpen(open);
  };

  const onSubmit = async (data: z.infer<typeof createPageSchema>) => {
    // You can do additional frontend validation here
    try {
      // Convert form data to FormData for the server action
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Call the server action inside startTransition
      startTransition(() => {
        formAction(formData);
      });
    } catch (error) {
      console.error('Form submission error:', error);
      // Handle any client-side errors
    }
  };

  // Effect to handle server-side errors
  useEffect(() => {
    // Handle success
    if (formState?.success) {
      toast({
        title: 'Success!',
        description: 'Access page created successfully.',
        variant: 'default',
      });
      setIsOpen(null);
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      form.reset();
    }

    // Handle errors
    const errorKeys = Object.keys(formState?.errors || {});
    errorKeys.forEach((errorKey) => {
      // Type guard to check if the key exists in the errors object
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
  }, [formState]);

  const formFields = [
    {
      name: 'title' as const,
      label: 'Title',
      description: 'Name displayed to your users.',
      component: Input,
      props: {
        placeholder: 'Production Database Access',
      },
    },
    {
      name: 'provider_account_id' as const,
      label: 'AWS Account ID',
      description: '12-digit AWS account ID for permissions.',
      component: Input,
      props: {
        pattern: '\\d{12}',
        placeholder: '123456789012',
      },
    },
    {
      name: 'permissions' as const,
      label: 'CloudFormation Stack Permissions Policy',
      description:
        'JSON policy defining user access to CloudFormation resources.',
      component: Textarea,
      props: {
        className: 'font-mono text-sm min-h-[300px]',
        placeholder: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "cloudformation:DescribeStacks",
      "cloudformation:DescribeStackEvents",
      "cloudformation:DescribeStackResource",
      "cloudformation:DescribeStackResources"
    ],
    "Resource": "*"
  }]
}`,
      },
    },
    {
      name: 'note' as const,
      label: 'Note',
      description: 'Additional information visible to users.',
      component: Input,
      props: {
        placeholder: 'Read-only access to CloudFormation resources',
      },
    },
  ];

  return (
    <Dialog open={!!isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Create Access Page</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {formFields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      <field.component {...formField} {...field.props} />
                    </FormControl>
                    <FormDescription>{field.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <FormGlobalError error={formState?.errors} />

            <div className='flex justify-end'>
              <Button type='submit' disabled={pending}>
                {pending ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Plus className='h-4 w-4' />
                )}
                <span className='ml-2'>Create Access Page</span>
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

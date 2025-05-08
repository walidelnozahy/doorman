'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus } from 'lucide-react';
import { createAccessPage } from '@/app/actions/create-access-page';
import { AwsIcon } from '@/components/icons/aws-icon';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormField } from '../../../ui/form';
import { useToast } from '@/hooks/use-toast';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { createPageSchema } from '@/utils/schema/create-page-schema';
import { useCreateAccessPageDialog } from '@/hooks/use-create-access-page-dialog';
import config from '@/config';

const DEFAULT_PERMISSIONS = `{
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
}`;
const formFields = [
  {
    name: 'slug' as const,
    label: 'Custom Slug',
    description: "Customize the last part of your page's URL",
    component: Input,
    defaultValue: '',
    props: {
      prefix: `${config.host}/`,
      placeholder: 'custom-path',
      pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', // simple kebab-case validator
    },
    transform: (value: string) => {
      // Convert spaces to dashes and ensure kebab-case format
      return value
        .toLowerCase()
        .replace(/ /g, '-') // Replace spaces with dashes
        .replace(/[^a-z0-9-]/g, '') // Remove any characters that aren't lowercase letters, numbers, or dashes
        .replace(/-+/g, '-'); // Replace multiple consecutive dashes with a single dash
    },
  },

  {
    name: 'title' as const,
    label: 'Title',
    description: 'Name displayed to your users.',
    component: Input,
    defaultValue: '',
    props: {
      placeholder: 'Production Database Access',
    },
  },
  {
    name: 'provider_account_id' as const,
    label: 'AWS Account ID',
    description: '12-digit AWS account ID for permissions.',
    component: Input,
    defaultValue: '',
    props: {
      pattern: '\\d{12}',
      placeholder: '123456789012',
      prefix: <AwsIcon className='h-6 w-6' />,
    },
  },
  {
    name: 'permissions' as const,
    label: 'AWS Permissions Policy',
    description:
      'JSON policy defining user access to CloudFormation resources.',
    component: Textarea,
    defaultValue: DEFAULT_PERMISSIONS,
    props: {
      className: 'font-mono text-sm min-h-[300px]',
      placeholder: DEFAULT_PERMISSIONS,
    },
  },
  {
    name: 'note' as const,
    label: 'Note',
    description: 'Additional information visible to users.',
    component: Input,
    defaultValue: '',
    props: {
      placeholder: 'Read-only access to CloudFormation resources',
    },
  },
];

// Define a simpler state type
type CreatePageFormState = {
  success: boolean;
  data?: any;
  errors?: Record<string, string | string[]> | null;
};

const INITIAL_STATE: CreatePageFormState = {
  success: false,
};

export function CreateAccessPageDialog() {
  const { isOpen, setIsOpen } = useCreateAccessPageDialog();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] =
    useState<CreatePageFormState>(INITIAL_STATE);

  const form = useForm<z.infer<typeof createPageSchema>>({
    mode: 'onBlur',
    resolver: zodResolver(createPageSchema),
    defaultValues: Object.fromEntries(
      formFields.map((field) => [field.name, field.defaultValue]),
    ),
  });

  // Handle dialog close with form reset
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setFormState(INITIAL_STATE);
    }
    setIsOpen(open);
  };

  const onSubmit = async (data: z.infer<typeof createPageSchema>) => {
    try {
      // Convert form data to FormData for the server action
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Use startTransition to handle the server action
      startTransition(async () => {
        const result = await createAccessPage(formData);
        setFormState(result);
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
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
      setIsOpen(false);
      form.reset();
    }

    // Handle global errors with toast
    if (formState?.errors && Object.keys(formState.errors).length > 0) {
      // Check if there are any global errors (not field-specific)
      const globalErrors =
        formState.errors && '_global' in formState.errors
          ? formState.errors._global
          : undefined;

      if (globalErrors && globalErrors.length > 0) {
        toast({
          title: 'Error',
          description: Array.isArray(globalErrors)
            ? globalErrors[0]
            : globalErrors,
          variant: 'destructive',
        });
      }

      // Handle field-specific errors
      const errorKeys = Object.keys(formState.errors).filter(
        (key) => key !== 'global' && key !== '_global',
      );

      errorKeys.forEach((errorKey) => {
        if (formState.errors && errorKey in formState.errors) {
          const errorValue =
            formState.errors[errorKey as keyof typeof formState.errors];

          const errorMessage = Array.isArray(errorValue)
            ? errorValue[0]
            : (errorValue as string);

          form.setError(errorKey as any, {
            message: errorMessage,
          });
        }
      });
    }
  }, [formState, toast, setIsOpen, form]);
  const formValues = form.watch();

  return (
    <Dialog open={!!isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[1000px] flex flex-col max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle>Create Access Page</DialogTitle>
        </DialogHeader>
        <div className='p-2 relative overflow-y-auto'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='grid grid-cols-2 gap-8'>
                <div className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    {formFields
                      .filter(
                        (field) =>
                          field.name === 'title' ||
                          field.name === 'provider_account_id',
                      )
                      .map((field) => (
                        <FormField
                          key={field.name}
                          control={form.control}
                          name={field.name}
                          render={({ field: formField }) => (
                            <FormItem className='mb-4'>
                              <FormLabel>{field.label}</FormLabel>
                              <FormControl>
                                <field.component
                                  {...formField}
                                  {...field.props}
                                />
                              </FormControl>
                              <FormDescription className='text-xs'>
                                {field.description}
                              </FormDescription>
                              <FormMessage className='text-xs' />
                            </FormItem>
                          )}
                        />
                      ))}
                  </div>

                  {formFields
                    .filter(
                      (field) =>
                        field.name !== 'permissions' &&
                        field.name !== 'title' &&
                        field.name !== 'provider_account_id',
                    )
                    .map((field) => (
                      <FormField
                        key={field.name}
                        control={form.control}
                        name={field.name}
                        render={({ field: formField }) => (
                          <FormItem className='mb-4'>
                            <FormLabel>{field.label}</FormLabel>
                            <FormControl>
                              <field.component
                                {...formField}
                                {...field.props}
                              />
                            </FormControl>
                            <FormDescription className='text-xs'>
                              {field.description}
                            </FormDescription>
                            <FormMessage className='text-xs' />
                          </FormItem>
                        )}
                      />
                    ))}
                </div>

                <div className='space-y-4'>
                  {formFields
                    .filter((field) => field.name === 'permissions')
                    .map((field) => (
                      <FormField
                        key={field.name}
                        control={form.control}
                        name={field.name}
                        render={({ field: formField }) => (
                          <FormItem className='mb-4'>
                            <FormLabel>{field.label}</FormLabel>
                            <FormControl>
                              <field.component
                                {...formField}
                                {...field.props}
                              />
                            </FormControl>
                            <FormDescription className='text-xs'>
                              {field.description}
                            </FormDescription>
                            <FormMessage className='text-xs' />
                          </FormItem>
                        )}
                      />
                    ))}
                </div>
              </div>
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            type='button'
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Plus className='h-4 w-4' />
            )}
            <span className='ml-2'>Create Access Page</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

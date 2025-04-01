'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState, useEffect, startTransition } from 'react';
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
import { useCreateAccessPageDialog } from '@/hooks/use-create-access-page-dialog';
import React from 'react';
import { origin } from '@/config';
import { RenderAccessPage } from './render-access-page';

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
      prefix: `${origin}/`,
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
    },
  },
  {
    name: 'permissions' as const,
    label: 'CloudFormation Stack Permissions Policy',
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

const INITIAL_STATE = {
  data: null,
  errors: null,
  success: false,
};

export function CreateAccessPageDialog() {
  const { isOpen, setIsOpen } = useCreateAccessPageDialog();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof createPageSchema>>({
    mode: 'onBlur',
    resolver: zodResolver(createPageSchema),
    defaultValues: Object.fromEntries(
      formFields.map((field) => [field.name, field.defaultValue]),
    ),
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
          description: globalErrors,
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
      <DialogContent className='sm:max-w-[1200px] flex flex-col max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle>Create Access Page</DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-2 gap-8 relative overflow-y-auto '>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='grid grid-cols-2 gap-4 auto-rows-min'
            >
              {formFields.map((field, index) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                    <FormItem
                      className={`${
                        field.name === 'title' ||
                        field.name === 'provider_account_id'
                          ? 'col-span-1'
                          : 'col-span-2'
                      }`}
                    >
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl className='ml-1'>
                        <field.component
                          {...formField}
                          {...field.props}
                          onChange={(
                            e: React.ChangeEvent<
                              HTMLInputElement | HTMLTextAreaElement
                            >,
                          ) => {
                            // Apply transform function if it exists
                            if (field.transform && 'value' in e.target) {
                              e.target.value = field.transform(e.target.value);
                            }
                            formField.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormDescription className='text-xs'>
                        {field.description}
                      </FormDescription>
                      <FormMessage className='text-xs ' />
                    </FormItem>
                  )}
                />
              ))}
            </form>
          </Form>
          {/* <Separator orientation='vertical' /> */}
          <div className='flex flex-col space-y-2'>
            <div className='flex justify-between'>
              <h3 className='font-semibold'>Preview</h3>
              <span className='text-xs text-muted-foreground'>
                {origin}/{formValues.slug}
              </span>
            </div>
            <div className='bg-muted/50 rounded-sm'>
              <RenderAccessPage
                pageData={{
                  ...formValues,
                  permissions: JSON.parse(formValues.permissions),
                }}
                isViewOnly
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type='button'
            onClick={form.handleSubmit(onSubmit)}
            disabled={pending}
          >
            {pending ? (
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

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus } from 'lucide-react';
import { addDomain } from '@/app/actions/add-domain';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormField } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { useParams } from 'next/navigation';
import { useAddDomainDialog } from '@/components/features/custom-domains/hooks/use-add-domain-dialog';
import { useTransition } from 'react';

// Schema for domain validation
const addDomainSchema = z.object({
  domain: z.string().min(1, 'Domain is required'),
});

const formFields = [
  {
    name: 'domain' as const,
    label: 'Domain',
    description: 'Enter your custom domain (e.g., app.example.com)',
    component: Input,
    defaultValue: '',
    props: {
      placeholder: 'app.example.com',
    },
  },
];

// Define a simpler state type
type DomainFormState = {
  success: boolean;
  data?: {
    domain: string;
    verification_details?: {
      type: string;
      name: string;
      value: string;
    } | null;
    configuration_details?: {
      type: string;
      name: string;
      value: string;
    }[];
  };
  globalError?: string;
  fieldErrors?: Record<string, string>;
  needs_verification?: boolean;
  needs_configuration?: boolean;
};

const INITIAL_STATE: DomainFormState = {
  success: false,
};

export function AddDomainDialog() {
  const { isOpen, setIsOpen } = useAddDomainDialog();
  const params = useParams();
  const { pageId } = params as { pageId: string };
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<DomainFormState>(INITIAL_STATE);

  const form = useForm<z.infer<typeof addDomainSchema>>({
    mode: 'onBlur',
    resolver: zodResolver(addDomainSchema),
    defaultValues: {
      domain: '',
    },
  });

  // Handle dialog close with form reset
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setFormState(INITIAL_STATE);
    }
    setIsOpen(open);
  };

  const onSubmit = async (data: z.infer<typeof addDomainSchema>) => {
    try {
      // Use startTransition to handle the server action
      startTransition(async () => {
        console.log('Submitting domain:', data.domain);
        const result = await addDomain({
          domain: data.domain,
          page_id: pageId,
        });

        console.log('Server action result:', result);
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

  useEffect(() => {
    if (formState?.success) {
      // Close the dialog and reset the form
      setIsOpen(false);
      form.reset();

      // Show a success toast
      toast({
        title: 'Domain Added!',
        description: 'Your domain has been added successfully.',
        variant: 'default',
      });
    }

    // Handle global errors with toast
    if (formState?.globalError) {
      console.log('Displaying error:', formState.globalError);
      toast({
        title: 'Error',
        description: formState.globalError,
        variant: 'destructive',
      });
    }

    // Handle field-specific errors
    if (formState?.fieldErrors) {
      Object.entries(formState.fieldErrors).forEach(([field, message]) => {
        form.setError(field as any, {
          message,
        });
      });
    }
  }, [formState, form, toast, setIsOpen]);

  // Remove the DNS instructions display section
  return (
    <Dialog open={!!isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Add Custom Domain</DialogTitle>
        </DialogHeader>
        {formState?.globalError && (
          <div className='bg-destructive/10 text-destructive p-3 rounded-md mb-4 text-sm'>
            {formState.globalError}
          </div>
        )}
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
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
          </form>
        </Form>

        <DialogFooter>
          <Button
            type='button'
            disabled={isPending}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isPending ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Plus className='h-4 w-4' />
            )}
            <span className='ml-2'>Add Domain</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

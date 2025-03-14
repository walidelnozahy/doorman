import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface FormFieldErrorProps {
  error: any;
  fieldName: string;
}

/**
 * A component to display form field validation errors
 * @param error - The error object from form state
 * @param fieldName - The name of the field to check for errors
 */
export function FormFieldError({ error, fieldName }: FormFieldErrorProps) {
  if (!error || !(fieldName in error) || !error[fieldName]) {
    return null;
  }

  return (
    <div className='flex items-center gap-2 text-destructive text-sm mt-1'>
      <AlertCircle className='h-4 w-4' />
      <span>{error[fieldName]._errors?.[0] || 'Invalid input'}</span>
    </div>
  );
}

/**
 * A component to display global form errors
 * @param error - The error object from form state
 */
export function FormGlobalError({ error }: { error: any }) {
  if (!error || !('_global' in error)) {
    return null;
  }

  return (
    <Alert variant='destructive'>
      <AlertCircle className='h-4 w-4' />
      <AlertDescription>{error._global}</AlertDescription>
    </Alert>
  );
}

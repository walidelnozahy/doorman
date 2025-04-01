import { validateSlug } from '@/app/actions/validate-slug';
import { z } from 'zod';

export const createPageSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be in kebab-case format (lowercase letters, numbers, and hyphens)',
    )
    .refine(
      async (slug) => {
        try {
          // Validate slug with server action
          return validateSlug(slug);
        } catch (error) {
          // If the API call fails, we should fail validation to be safe
          console.error('Error validating slug:', error);
          return false;
        }
      },
      {
        message: 'This slug is already taken',
      },
    ),
  title: z.string().min(1, 'Title is required'),
  provider_account_id: z
    .string()
    .regex(/^\d{12}$/, 'Account ID must be exactly 12 digits'),
  permissions: z.string().refine((value) => {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  }, 'Invalid JSON format'),
  note: z.string().optional(),
});

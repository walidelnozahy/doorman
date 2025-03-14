import { z } from 'zod';

export const createPageSchema = z.object({
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

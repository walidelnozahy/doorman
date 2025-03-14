import { z } from 'zod';
// Define the schema for connection creation
export const createConnectionSchema = z.object({
  connection_id: z.string().min(1, 'Connection ID is required'),
  consumer_account_id: z
    .string()
    .regex(/^\d{12}$/, 'Customer Account ID must be exactly 12 digits')
    .optional()
    .or(z.literal('')),
  provider_account_id: z.string().min(1, 'Provider Account ID is required'),
  page_id: z.string().min(1, 'Page ID is required'),
});

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from '@/lib/supabase/get-authenticate-user';
import { createConnectionSchema } from '@/utils/schema/create-connection-schema';

/**
 * Server action to create a new connection
 * 1. Validate user authentication
 * 2. Parse and validate form data
 * 3. Create connection in database
 * 4. Revalidate cache
 */
export async function createConnection(prevState: any, formData: FormData) {
  try {
    /**
     * Check if user is authenticated
     */
    const supabase = await createClient();
    const user = await getAuthenticatedUser(supabase);

    /**
     * Parse form data and check validation
     */
    const parsedData = createConnectionSchema.safeParse({
      connection_id: formData.get('connection_id'),
      consumer_account_id: formData.get('consumer_account_id') || '',
      provider_account_id: formData.get('provider_account_id'),
      page_id: formData.get('page_id'),
    });

    if (!parsedData.success) {
      return {
        data: null,
        errors: parsedData.error.flatten().fieldErrors,
        success: false,
      };
    }

    /**
     * Create connection
     */
    const insertData = {
      connection_id: parsedData.data.connection_id,
      consumer_account_id: parsedData.data.consumer_account_id || null,
      provider_account_id: parsedData.data.provider_account_id,
      page_id: parsedData.data.page_id,
      status: 'disconnected', // Default status for new connections
    };

    /**
     * Insert connection
     */
    const { data, error } = await supabase
      .from('connections')
      .insert([insertData])
      .select();

    if (error) {
      // Check for duplicate connection_id error
      if (error.message.includes('connections_connection_id_unique')) {
        return {
          data: null,
          errors: {
            connection_id: [
              'This connection ID already exists. Please use a unique ID.',
            ],
          },
          success: false,
        };
      }
      throw error;
    }

    /**
     * Get the created connection with its ID
     */
    const createdConnection = data[0];

    revalidatePath(`/pages/${parsedData.data.page_id}`); // Revalidate cache to refresh data
    return { data: createdConnection, errors: null, success: true };
  } catch (error) {
    console.error('Error creating connection:', error);
    return {
      data: null,
      errors: { _global: 'Failed to create connection' },
      success: false,
    };
  }
}

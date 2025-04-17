// Generic fetch handler for all API requests
// Parameters:
//   url: string - The API endpoint
//   method?: string - HTTP method (defaults to 'GET')
//   body?: any - Request body (optional)

import config from '@/config';

// Returns: Promise<T>
export async function fetchHandler<T>(
  url: string,
  method: string = 'GET',
  body?: any,
): Promise<T> {
  try {
    url = `${config.origin}${url}`;

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      // Try to extract error message from response
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          errorData.message ||
          errorData ||
          `Failed to ${method.toLowerCase()} ${url}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Error ${method.toLowerCase()}ing ${url}:`, error);
    throw error;
  }
}

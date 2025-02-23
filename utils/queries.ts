import { Page, TemplateRequest } from './types';

// Generic fetch handler for all API requests
// Parameters:
//   url: string - The API endpoint
//   method?: string - HTTP method (defaults to 'GET')
//   body?: any - Request body (optional)
// Returns: Promise<T>
export async function fetchHandler<T>(
  url: string,
  method: string = 'GET',
  body?: any,
): Promise<T> {
  try {
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
      if (response.status === 404 && url.includes('/connections/')) {
        return null as T;
      }
      throw new Error(`Failed to ${method.toLowerCase()} ${url}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error ${method.toLowerCase()}ing ${url}:`, error);
    throw error;
  }
}

export async function generateTemplate(request: TemplateRequest) {
  const origin = process.env.NEXT_PUBLIC_API_ORIGIN;
  if (!origin) {
    throw new Error('API origin is not defined');
  }

  const response = await fetch(`${origin}/generate-template`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to generate template');
  }

  return response.json();
}

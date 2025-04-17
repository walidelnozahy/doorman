import { TemplateRequest } from '../utils/types';

export async function generateTemplate(request: TemplateRequest) {
  try {
    const apiOrigin = process.env.CORE_API_ORIGIN;
    if (!apiOrigin) {
      throw new Error('API origin is not defined');
    }

    const response = await fetch(`${apiOrigin}/generate-template`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      // Try to extract error message from response
      const errorData = await response.json().catch(() => ({}));

      throw new Error(
        errorData.error ||
          errorData.message ||
          errorData ||
          'Failed to generate template',
      );
    }

    return response.json();
  } catch (error) {
    console.error('Error generating template:', error);
    throw error;
  }
}

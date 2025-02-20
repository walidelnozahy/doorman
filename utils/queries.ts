import { Page } from './types';

export async function getAllPages() {
  try {
    const response = await fetch('/api/pages');
    if (!response.ok) {
      throw new Error('Failed to fetch pages');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching pages:', error);
    throw error;
  }
}

export async function getPageById(id: string) {
  try {
    const response = await fetch(`/api/pages/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch page');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching page:', error);
    throw error;
  }
}

export async function createPage(page: Omit<Page, 'id'>) {
  try {
    const response = await fetch('/api/pages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(page),
    });

    if (!response.ok) {
      throw new Error('Failed to create page');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating page:', error);
    throw error;
  }
}

export async function updatePage(id: string, updates: Partial<Page>) {
  try {
    const response = await fetch(`/api/pages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update page');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating page:', error);
    throw error;
  }
}

export async function deletePage(id: string) {
  try {
    const response = await fetch(`/api/pages/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete page');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting page:', error);
    throw error;
  }
}

import { NotesResponse, MessageResponse } from '../../types'; // Assuming you have these types defined

const API_BASE_URL = 'http://127.0.0.1:5000';

// Fetch only notes belonging to the logged-in user
export async function getNotes(): Promise<NotesResponse> {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('No access token found');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/get_all_notes`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch notes');
    }

    const data = await response.json();
    if (!Array.isArray(data.notes)) {
      throw new Error('Invalid response format');
    }

    return data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
}

// Create a note for the logged-in user
export const createNote = async (title: string, content: string, folderId: number | null): Promise<MessageResponse> => {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
    body: JSON.stringify({ title, content, folder_id: folderId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create note');
  }

  return await response.json();
};
// Update a note for the logged-in user
export async function updateNote(
  id: number,
  title: string,
  content: string
): Promise<MessageResponse> {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    },
    body: JSON.stringify({ title, content }),
  });

  if (!response.ok) {
    throw new Error('Failed to update note');
  }

  return response.json();
}

// Delete a note for the logged-in user
export async function deleteNote(id: number): Promise<MessageResponse> {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to delete note');
  }

  return response.json();
}

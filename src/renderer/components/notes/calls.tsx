const API_BASE_URL = 'http://127.0.0.1:5000';

export interface Note {
  id: number;
  title: string;
  content: string;
}

interface NotesResponse {
  notes: Note[];
}

interface MessageResponse {
  message: string;
}

export async function getNotes(): Promise<NotesResponse> {
  const response = await fetch(`${API_BASE_URL}/notes`);
  if (!response.ok) {
    throw new Error('Failed to fetch notes');
  }
  const data = await response.json();
  if (!data.notes) {
    throw new Error('Invalid response format');
  }
  return data;
}

export async function createNote(
  title: string,
  content: string,
): Promise<MessageResponse> {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, content }),
  });
  if (!response.ok) {
    throw new Error('Failed to create note');
  }
  return response.json();
}

export async function updateNote(
  id: number,
  title: string,
  content: string,
): Promise<MessageResponse> {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, content }),
  });
  if (!response.ok) {
    throw new Error('Failed to update note');
  }
  return response.json();
}

export async function deleteNote(id: number): Promise<MessageResponse> {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete note');
  }
  return response.json();
}

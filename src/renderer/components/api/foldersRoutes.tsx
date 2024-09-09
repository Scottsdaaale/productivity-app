import { Note, Folder } from '../../types'; // Assuming you have these types defined

const API_BASE_URL = 'http://127.0.0.1:5000'; // Adjust this to match your backend URL

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred');
    }
    return response.json();
};

// Create a new folder
export const createFolder = async (name: string, parentId: number | null): Promise<{ message: string, folder_id: number }> => {
    const response = await fetch(`${API_BASE_URL}/folders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ name, parent_id: parentId })
    });
    return handleResponse(response);
};

// Get all folders for the current user
export const getFolders = async (): Promise<{ folders: Folder[] }> => {
    const response = await fetch(`${API_BASE_URL}/folders`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    });
    return handleResponse(response);
};

// Update a folder
export const updateFolder = async (folderId: number, name: string, parentId: number | null): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/folders/${folderId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ name, parent_id: parentId })
    });
    return handleResponse(response);
};

// Delete a folder
export const deleteFolder = async (folderId: number): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/folders/${folderId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    });
    return handleResponse(response);
};

// Create a new note within a folder
export const createNoteInFolder = async (folderId: number, title: string, content: string): Promise<{ message: string, note_id: number }> => {
    const response = await fetch(`${API_BASE_URL}/folders/${folderId}/notes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ title, content })
    });
    return handleResponse(response);
};

// Get all notes within a folder
export const getNotesInFolder = async (folderId: number): Promise<{ notes: Note[] }> => {
    const response = await fetch(`${API_BASE_URL}/folders/${folderId}/notes`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    });
    return handleResponse(response);
};

// Move a note to a different folder or to the root level
export const moveNote = async (noteId: number, newFolderId: number | null): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}/move`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ folder_id: newFolderId })
    });
    return handleResponse(response);
};
import {
    TodoFolder,
    TodoFoldersResponse,
    CreateTodoFolderRequest,
    UpdateTodoFolderRequest,
    MessageResponse,
    Todo
} from '../../../types';

const API_BASE_URL = 'http://127.0.0.1:5000';

const token = localStorage.getItem('access_token');

export const todoFolderApi = {
    async getFolders(): Promise<TodoFoldersResponse> {
        const response = await fetch(`${API_BASE_URL}/todo-folders`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            throw new Error(errorData.message || 'Failed to fetch folders');
        }
        return response.json();
    },

    async createFolder(folderData: CreateTodoFolderRequest): Promise<MessageResponse> {
        const response = await fetch(`${API_BASE_URL}/todo-folders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`

            },
            body: JSON.stringify(folderData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            throw new Error(errorData.message || 'Failed to create folder');
        }

        return response.json();
    },

    async updateFolder(folderId: number, folderData: UpdateTodoFolderRequest): Promise<MessageResponse> {
        const response = await fetch(`${API_BASE_URL}/todo-folders/${folderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`

            },
            body: JSON.stringify(folderData)
        });
        return response.json();
    },

    async deleteFolder(folderId: number): Promise<MessageResponse> {
        const response = await fetch(`${API_BASE_URL}/todo-folders/${folderId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`

            }
        });
        return response.json();
    },

    async getFolderTodos(folderId: number): Promise<{ todos: Todo[] }> {
        const response = await fetch(`${API_BASE_URL}/todo-folders/${folderId}/todos`, {
            headers: {
                'Authorization': `Bearer ${token}`

            }
        });
        return response.json();
    }
};
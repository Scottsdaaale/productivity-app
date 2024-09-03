const API_BASE_URL = 'http://127.0.0.1:5000';

export interface User {
    id: number;
    username: string;
    email: string;
}

interface UsersResponse {
    users: User[];
}

export async function getUsers(): Promise<UsersResponse> {
    const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    return response.json();
}

export async function getUser(userId: number): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch user');
    }
    return response.json();
}

export async function updateUser(userId: number, username?: string, email?: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ username, email }),
    });
    if (!response.ok) {
        throw new Error('Failed to update user');
    }
    return response.json();
}

export async function deleteUser(userId: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to delete user');
    }
    return response.json();
}

import { Todo, TodosResponse, CreateTodoRequest, UpdateTodoRequest, MessageResponse } from '../../../types';

const API_BASE_URL = 'http://127.0.0.1:5000';
const getToken = () => localStorage.getItem('access_token');
const token = getToken();
export const todoRoutes = {
    async createTodo(todoData: CreateTodoRequest): Promise<MessageResponse> {
        if (!token) {
            throw new Error('No authentication token found');
        }
        try {
            const response = await fetch(`${API_BASE_URL}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(todoData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server response:', errorData);
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error creating todo:', error);
            throw error;
        }
    },

    async getTodos(): Promise<TodosResponse> {
        const response = await fetch(`${API_BASE_URL}/todos`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    },

    async getTodo(todoId: number): Promise<Todo> {
        const response = await fetch(`${API_BASE_URL}/todos/${todoId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    },

    async updateTodo(todoId: number, todoData: UpdateTodoRequest): Promise<MessageResponse> {
        const response = await fetch(`${API_BASE_URL}/todos/${todoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(todoData)
        });
        return response.json();
    },

    async deleteTodo(todoId: number): Promise<MessageResponse> {
        const response = await fetch(`${API_BASE_URL}/todos/${todoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    }
};
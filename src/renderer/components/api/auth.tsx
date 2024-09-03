const API_BASE_URL = 'http://127.0.0.1:5000';

export interface AuthResponse {
  access_token: string;
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error('Failed to login');
  }
  return response.json();
}

export async function register(username: string, email: string, password: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) {
    throw new Error('Failed to register');
  }
  return response.json();
}

export const logout = () => {
  // Clear token from local storage
  localStorage.removeItem('access_token');
  // Optionally, you can add additional cleanup here
};
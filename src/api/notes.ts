const API_URL = 'http://127.0.0.1:5000/notes'; // adjust this if your backend is on a different port

let authToken: string | null = null;

export const setAuthToken = (token: string) => {
  authToken = token;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

const apiCall = (endpoint: string, method: string, body?: object) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  }).then(handleResponse);
};

export const getNotes = () => apiCall('/notes', 'GET');
export const createNote = (title: string, content: string) =>
  apiCall('/notes', 'POST', { title, content });
export const updateNote = (id: number, title: string, content: string) =>
  apiCall(`/notes/${id}`, 'PUT', { title, content });
export const deleteNote = (id: number) => apiCall(`/notes/${id}`, 'DELETE');

export interface AuthResponse {
  access_token: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  folder_id: number | null;
}

export interface NotesResponse {
  notes: Note[];
}

export interface MessageResponse {
  message: string;
  note?: Note; // For responses that might include a note
  folder?: Folder; // For responses that might include a folder
}

export interface Folder {
  id: number;
  name: string;
  parent_id: number | null;
  created_at: string; // Consider using Date if you parse dates on the frontend
  updated_at: string; // Consider using Date if you parse dates on the frontend
  user_id: number;
}

export interface FoldersResponse {
  folders: Folder[];
}

// Request types for creating/updating notes and folders
export interface CreateNoteRequest {
  title: string;
  content: string;
  folder_id?: number | null;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  folder_id?: number | null;
}

export interface CreateFolderRequest {
  name: string;
  parent_id?: number | null;
}

export interface UpdateFolderRequest {
  name?: string;
  parent_id?: number | null;
}

// Generic error response
export interface ErrorResponse {
  message: string;
}

export interface Todo {
  id: number;
  name: string;
  description?: string;
  due_date?: string;
  priority?: string;
  completed: boolean;
  folder_id?: number;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export interface TodosResponse {
  todos: Todo[];
}

export interface CreateTodoRequest {
  name: string;
  description?: string;
  due_date?: string;
  priority?: string;
  completed?: boolean;
  folder_id?: number;
}

export interface UpdateTodoRequest {
  name?: string;
  description?: string;
  due_date?: string;
  priority?: string;
  completed?: boolean;
  folder_id?: number;
}

// Update MessageResponse to include todo
export interface MessageResponse {
  message: string;
  note?: Note;
  folder?: Folder;
  todo?: Todo;
}

export interface TodoFolder {
  id: number;
  name: string;
  parent_id: number | null;
  user_id: number;
}

export interface TodoFoldersResponse {
  folders: TodoFolder[];
}

export interface CreateTodoFolderRequest {
  name: string;
  parent_id?: number | null;
}

export interface UpdateTodoFolderRequest {
  name?: string;
  parent_id?: number | null;
}

// Update MessageResponse to include todoFolder
export interface MessageResponse {
  message: string;
  note?: Note;
  folder?: Folder;
  todo?: Todo;
  todoFolder?: TodoFolder;
}
// types.ts

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

export interface Folder {
  id: number;
  name: string;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export interface FoldersResponse {
  folders: Folder[];
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

export interface TodoFolder {
  id: number;
  name: string;
  parent_id: number | null;
  user_id: number;
}

export interface TodoFoldersResponse {
  folders: TodoFolder[];
}

// Consolidated MessageResponse
export interface MessageResponse {
  message: string;
  note?: Note;
  folder?:
    | Folder
    | {
        id: number;
        name: string;
        parent_id: number | null;
      };
  todo?: Todo;
  todoFolder?: TodoFolder;
}

// Request types
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

export interface CreateTodoFolderRequest {
  name: string;
  parent_id?: number | null;
}

export interface UpdateTodoFolderRequest {
  name?: string;
  parent_id?: number | null;
}

// Generic error response
export interface ErrorResponse {
  message: string;
}

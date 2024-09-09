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

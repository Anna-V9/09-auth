import api from './api';
import type { Note, NoteTag } from '@/types/note';
import type { User } from '@/types/user';


export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content?: string;
  tag: NoteTag;
}

export const fetchNotes = async (
  page: number,
  perPage: number,
  search?: string,
  tag?: NoteTag
): Promise<NotesResponse> => {
  const { data } = await api.get<NotesResponse>('/notes', {
    params: { page, perPage, search, ...(tag ? { tag } : {}) },
  });
  return data;
};

export const fetchNoteById = async (noteId: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${noteId}`);
  return data;
};

export const createNote = async (
  payload: CreateNotePayload
): Promise<Note> => {
  const { data } = await api.post<Note>('/notes', payload);
  return data;
};

export const deleteNote = async (noteId: string): Promise<void> => {
  await api.delete(`/notes/${noteId}`);
};


interface RegisterPayload {
  email: string;
  password: string;
}

export const register = async (payload: RegisterPayload): Promise<User> => {
  const { data } = await api.post<User>('/auth/register', payload);
  return data;
};

interface LoginPayload {
  email: string;
  password: string;
}

export const login = async (payload: LoginPayload): Promise<User> => {
  const { data } = await api.post<User>('/auth/login', payload);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/me');
  return data;
};

interface UpdateMePayload {
  username?: string;
}

export const updateMe = async (payload: UpdateMePayload): Promise<User> => {
  const { data } = await api.patch<User>('/users/me', payload);
  return data;
};

export const checkSession = async (): Promise<User | null> => {
  try {
    const { data } = await api.get<User>('/auth/session');
    return data;
  } catch {
    return null;
  }
};
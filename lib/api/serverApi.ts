
import { cookies } from 'next/headers';
import type { AxiosResponse } from 'axios';

import api from './api'; 
import type { Note, NoteTag } from '@/types/note';
import type { User } from '@/types/user';


const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  
  return cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join('; ');
};

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number,
  perPage: number,
  search?: string,
  tag?: NoteTag
): Promise<NotesResponse> => {
  const cookieString = await getAuthHeaders();
  
  const { data } = await api.get<NotesResponse>('/notes', {
    params: {
      page,
      perPage,
      search,
      ...(tag ? { tag } : {}),
    },
    headers: { Cookie: cookieString },
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieString = await getAuthHeaders();
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieString },
  });
  return data;
};

export const getCurrentUser = async (): Promise<User> => {
  const cookieString = await getAuthHeaders();
  const { data } = await api.get<User>('/users/me', {
    headers: { Cookie: cookieString },
  });
  return data;
};

export const checkSession = async (): Promise<AxiosResponse<User> | null> => {
  try {
    const cookieString = await getAuthHeaders();
    return await api.get<User>('/auth/session', {
      headers: { Cookie: cookieString },
    });
  } catch {
    return null;
  }
};

export const refreshSession = async (
  refreshToken: string
): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  const cookieString = await getAuthHeaders();
  
  
  const { data } = await api.post(
    '/auth/refresh',
    { refreshToken },
    { 
      headers: { Cookie: cookieString } 
    }
  );

  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };
};
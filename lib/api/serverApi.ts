import axios from 'axios';
import { cookies } from 'next/headers';
import type { Note, NoteTag } from '@/types/note';
import type { User } from '@/types/user';

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

const serverApi = async () => {
  const cookieStore = cookies(); 

  return axios.create({
    baseURL,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
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
  const api = await serverApi();
  const { data } = await api.get<NotesResponse>('/notes', {
    params: { page, perPage, search, ...(tag ? { tag } : {}) },
  });
  return data;
};


export const fetchNoteById = async (id: string): Promise<Note> => {
  const api = await serverApi();
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};


export const getCurrentUser = async (): Promise<User> => {
  const api = await serverApi();
  const { data } = await api.get<User>('/users/me');
  return data;
};


export const checkSession = async (): Promise<User | null> => {
  try {
    const api = await serverApi();
    const { data } = await api.get<User>('/auth/session');
    return data;
  } catch {
    return null;
  }
};


export const refreshSession = async (refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  const { data } = await axios.post(
    `${baseURL}/auth/refresh`,
    { refreshToken },
    { withCredentials: true }
  );

  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };
};
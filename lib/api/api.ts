import axios from 'axios';
import type { Note } from '@/types/note';

const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

type FetchNotesResponse = {
  notes: Note[];
  totalPages: number;
};

export const fetchNotes = async (params?: {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}): Promise<FetchNotesResponse> => {
  const { data } = await api.get<FetchNotesResponse>('/notes', { params });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const deleteNote = async (id: string) => {
  const { data } = await api.delete(`/notes/${id}`);
  return data;
};

export default api;
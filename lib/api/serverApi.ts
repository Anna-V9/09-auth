import axios from 'axios';
import { cookies } from 'next/headers';
import type { Note, NoteTag } from '@/types/note';

const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';

const serverApi = () => {
  const cookieStore = cookies();

  return axios.create({
    baseURL,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
};

export const fetchNotes = async (
  page: number,
  perPage: number,
  search?: string,
  tag?: NoteTag
) => {
  const { data } = await serverApi().get('/notes', {
    params: {
      page,
      perPage,
      search,
      ...(tag ? { tag } : {}),
    },
  });

  return data;
};

export const fetchNoteById = async (id: string) => {
  const { data } = await serverApi().get(`/notes/${id}`);
  return data;
};
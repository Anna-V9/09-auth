'use client';

import { useState, useEffect } from 'react';
import css from './NoteForm.module.css';
import { useNoteStore, DraftNote } from '@/lib/store/noteStore';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote as createNoteApi } from '@/lib/api/clientApi';
import type { NoteTag } from '@/types/note';

interface NoteFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}


interface NoteFormState extends DraftNote {
  tag: NoteTag;
}

const NoteForm: React.FC<NoteFormProps> = ({ onSuccess, onCancel }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  
  const initialForm: NoteFormState = {
    ...draft,
    tag: (draft.tag as NoteTag) || 'Todo',
  };

  const [form, setForm] = useState<NoteFormState>(initialForm);

  useEffect(() => {
    setDraft(form);
  }, [form, setDraft]);

  const mutation = useMutation({
    mutationFn: (note: NoteFormState) =>
      createNoteApi(note), 
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onSuccess?.();
      router.back();
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    
    if (name === 'tag') {
      setForm((prev) => ({ ...prev, tag: value as NoteTag }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  const handleCancel = () => {
    onCancel?.();
    router.back();
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          minLength={3}
          maxLength={50}
          className={css.input}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={form.content}
          onChange={handleChange}
          rows={8}
          maxLength={500}
          className={css.textarea}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          value={form.tag}
          onChange={handleChange}
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
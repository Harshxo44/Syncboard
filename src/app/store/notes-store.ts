import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface NotesState {
  notes: Note[];
  addNote: (userId: string, title: string, content: string) => void;
  updateNote: (noteId: string, title: string, content: string) => void;
  deleteNote: (noteId: string) => void;
  getUserNotes: (userId: string) => Note[];
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],

      addNote: (userId, title, content) => {
        const newNote: Note = {
          id: `note-${Date.now()}`,
          title,
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId,
        };
        set((state) => ({ notes: [...state.notes, newNote] }));
      },

      updateNote: (noteId, title, content) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId
              ? { ...note, title, content, updatedAt: new Date().toISOString() }
              : note
          ),
        }));
      },

      deleteNote: (noteId) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== noteId),
        }));
      },

      getUserNotes: (userId) => {
        return get().notes.filter((note) => note.userId === userId);
      },
    }),
    {
      name: 'notes-storage',
    }
  )
);

import { Note, CreateNoteDto, UpdateNoteDto } from '@/types/note';

const STORAGE_KEY = 'boversal_notes';

// Helper functions for localStorage
const getNotesFromStorage = (): Note[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

const saveNotesToStorage = (notes: Note[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

export const noteService = {
  // Get all notes
  getNotes: async (): Promise<Note[]> => {
    return Promise.resolve(getNotesFromStorage());
  },

  // Get a single note by ID
  getNoteById: async (id: string): Promise<Note> => {
    const notes = getNotesFromStorage();
    const note = notes.find((n) => n.id === id);
    
    if (!note) {
      throw new Error('Note not found');
    }
    
    return Promise.resolve(note);
  },

  // Create a new note
  createNote: async (data: CreateNoteDto): Promise<Note> => {
    const notes = getNotesFromStorage();
    
    const newNote: Note = {
      id: `note-${Date.now()}`,
      ...data,
      userId: 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    notes.push(newNote);
    saveNotesToStorage(notes);
    
    return Promise.resolve(newNote);
  },

  // Update a note
  updateNote: async (id: string, data: UpdateNoteDto): Promise<Note> => {
    const notes = getNotesFromStorage();
    const index = notes.findIndex((n) => n.id === id);
    
    if (index === -1) {
      throw new Error('Note not found');
    }
    
    const updatedNote: Note = {
      ...notes[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    notes[index] = updatedNote;
    saveNotesToStorage(notes);
    
    return Promise.resolve(updatedNote);
  },

  // Delete a note
  deleteNote: async (id: string): Promise<void> => {
    const notes = getNotesFromStorage();
    const filtered = notes.filter((n) => n.id !== id);
    saveNotesToStorage(filtered);
    
    return Promise.resolve();
  },

  // Search notes
  searchNotes: async (query: string): Promise<Note[]> => {
    const notes = getNotesFromStorage();
    const lowerQuery = query.toLowerCase();
    
    const filtered = notes.filter((note) =>
      note.title.toLowerCase().includes(lowerQuery) ||
      note.content.toLowerCase().includes(lowerQuery) ||
      note.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
    
    return Promise.resolve(filtered);
  },

  // Get notes by tag
  getNotesByTag: async (tag: string): Promise<Note[]> => {
    const notes = getNotesFromStorage();
    const filtered = notes.filter((note) => note.tags?.includes(tag));
    
    return Promise.resolve(filtered);
  },
};

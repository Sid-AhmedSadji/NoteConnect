import React, { createContext, useContext, useState, useEffect } from 'react';
import { SortOption, FilterOption } from '@/types';
import Note from 'models/Note';
import NoteApi from '@/api/NoteApi';
import { useAuth } from './AuthContext';

interface NotesContextProps {
  notes: Note[];
  filteredNotes: Note[];
  sortOption: SortOption;
  filterOption: FilterOption;
  searchQuery: string;
  isLoading: boolean;
  setSortOption: (option: SortOption) => void;
  setFilterOption: (option: FilterOption) => void;
  setSearchQuery: (query: string) => void;
  updateNote: (note: Note) => Promise<void>;
  recalculateNotes: () => Promise<void>;
  addNote: (noteData: Omit<Note, '_id'>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

const NotesContext = createContext<NotesContextProps | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [filterOption, setFilterOption] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { authState } = useAuth();

  const fetchNotes = async () => {
    setIsLoading(true);
    
    try {
      
      const response = await NoteApi.getNote();
      setNotes(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchNotes();
    } else {
      setNotes([]);
    }
  }, [authState.isAuthenticated]);

  useEffect(() => {
    let result = [...notes];

    if (filterOption === 'liked') result = result.filter(note => note.liked);
    else if (filterOption === 'active') result = result.filter(note => !note.isDead);
    else if (filterOption === 'dead') result = result.filter(note => note.isDead);

    if (searchQuery) {
      if (searchQuery.trim().length === 0) return;
      const rawQuery = searchQuery.trim().toLowerCase();
      const formattedQuery = Note.formatName(searchQuery).toLowerCase();
  
      result = result.filter(note => {
          return (
              note.name.toLowerCase().includes(rawQuery) ||
              note.name.toLowerCase().includes(formattedQuery) ||
              note.link.toLowerCase().includes(rawQuery)
          );
      });
  }

    result.sort((a, b) => {
      if (sortOption === 'name') return a.name.localeCompare(b.name);
      if (sortOption === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      return b.note - a.note;
    });

    setFilteredNotes(result);
  }, [notes, sortOption, filterOption, searchQuery]);

  const updateNote = async (updatedNote: Note) => {
    try {
      await NoteApi.updateNote({ id: updatedNote._id, updateNote: updatedNote });
      setNotes(prevNotes =>
        prevNotes.map(n => (n._id === updatedNote._id ? updatedNote : n))
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la note:", error);
    }
  };

  const addNote = async (noteData: Omit<Note, '_id'>) => {
    try {
      const response = await NoteApi.createNote({ note: noteData });
      const newNote = new Note(response.data);
      setNotes(prev => [newNote, ...prev]);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la note:", error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await NoteApi.deleteNote({ id });
      setNotes(prev => prev.filter(n => n._id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de la note:", error);
    }
  };

  const recalculateNotes = async () => {
    setIsLoading(true);
    try {
      const updatedNotes = await NoteApi.calculNotes();
      setNotes(updatedNotes.data);
    } catch (error) {
      console.error("Erreur lors du recalcul des notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        filteredNotes,
        sortOption,
        filterOption,
        searchQuery,
        isLoading,
        setSortOption,
        setFilterOption,
        setSearchQuery,
        updateNote,
        recalculateNotes,
        addNote,
        deleteNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes doit être utilisé dans un NotesProvider');
  }
  return context;
};

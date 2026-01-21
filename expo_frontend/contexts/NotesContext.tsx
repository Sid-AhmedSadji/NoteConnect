import NoteApi from '@/api/NoteApi';
import { FilterOption, SortOption } from '@/types';
import Note from '@models/Note';
import useToast from '@toast/use-toast';
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useDebounce } from '@/hooks/useDebounce'; // custom hook debounce

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
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [filterOption, setFilterOption] = useState<FilterOption>('all');
  const [rawSearchQuery, setRawSearchQuery] = useState('');
  const searchQuery = useDebounce(rawSearchQuery, 300); // debounce 300ms
  const [isLoading, setIsLoading] = useState(false);

  const { authState } = useAuth();
  const { toast } = useToast();

  // handleApiCall simplifié
  const handleApiCall = async <T>(apiCall: () => Promise<T>, errorMsg: string): Promise<T | null> => {
    try {
      const data = await apiCall();
      return data.data ;
    } catch (error: any) {
      console.error(errorMsg, error?.message ?? error);
      toast({ title: 'Erreur', description: error?.message ?? errorMsg, variant: 'destructive' });
      return null;
    }
  };

  // fetch notes
  const fetchNotes = async () => {
    setIsLoading(true);
    const data = await handleApiCall(() => NoteApi.getNote(), 'Erreur lors du chargement des notes');
    if (data) {
      // ajouter _searchName et _formattedName pour recherche rapide
      const processed = data.map((n: any) => ({
        ...n,
        _searchName: n.name.toLowerCase(),
        _formattedName: Note.formatName(n.name).toLowerCase(),
      }));
      setNotes(processed.map(n => new Note(n)));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (authState.isAuthenticated) fetchNotes();
    else setNotes([]);
  }, [authState.isAuthenticated]);

  // filtrage selon filterOption et searchQuery
  const filtered = useMemo(() => {
    let result = [...notes];

    if (filterOption === 'liked') result = result.filter(n => n.liked);
    else if (filterOption === 'active') result = result.filter(n => !n.isDead);
    else if (filterOption === 'dead') result = result.filter(n => n.isDead);

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(n =>
        n._searchName.includes(q) ||
        n._formattedName.includes(q) ||
        n.link.toLowerCase().includes(q)
      );
    }

    return result;
  }, [notes, filterOption, searchQuery]);

  // tri
  const filteredNotes = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortOption === 'name') return a.name.localeCompare(b.name);
      if (sortOption === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      return (b.note ?? 0) - (a.note ?? 0);
    });
  }, [filtered, sortOption]);

  // CRUD
  const updateNote = async (updatedNote: Note) => {
    const data = await handleApiCall(() => NoteApi.updateNote({ id: updatedNote._id, updateNote: updatedNote }), 'Erreur lors de la mise à jour de la note');
    if (data) setNotes(prev => prev.map(n => (n._id === updatedNote._id ? new Note(data) : n)));
  };

  const addNote = async (noteData: Omit<Note, '_id'>) => {
    const data = await handleApiCall(() => NoteApi.createNote({ note: noteData }), 'Erreur lors de l\'ajout de la note');
    if (data) setNotes(prev => [new Note(data), ...prev]);
  };

  const deleteNote = async (id: string) => {
    const data = await handleApiCall(() => NoteApi.deleteNote({ id }), 'Erreur lors de la suppression de la note');
    if (data !== null) setNotes(prev => prev.filter(n => n._id !== id));
  };

  const recalculateNotes = async () => {
    setIsLoading(true);
    const data = await handleApiCall(() => NoteApi.calculNotes(), 'Erreur lors du recalcul des notes');
    if (data) setNotes(data.map((n: any) => new Note(n)));
    setIsLoading(false);
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
        setSearchQuery: setRawSearchQuery,
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
  if (!context) throw new Error('useNotes doit être utilisé dans un NotesProvider');
  return context;
};

export default NotesProvider;

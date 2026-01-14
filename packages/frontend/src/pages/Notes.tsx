
import React from 'react';
import Header from '@/components/Header';
import SearchAndFilterBar from '@/components/SearchAndFilterBar';
import NotesList from '@/components/NotesList';
import CreateNoteDialog from '@/components/CreateNoteDialog';
import { useNotes } from '@/contexts/NotesContext';

const Notes: React.FC = () => {
  const { filteredNotes } = useNotes();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 pb-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Mes Notes</h2>
            <p className="text-muted-foreground">
              {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''} {filteredNotes.length > 0 ? 'trouvée' + (filteredNotes.length !== 1 ? 's' : '') : ''}
            </p>
          </div>
          <CreateNoteDialog />
        </div>

        <SearchAndFilterBar />
        <NotesList />
      </main>
    </div>
  );
};

export default Notes;

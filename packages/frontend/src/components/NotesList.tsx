
import React from 'react';
import NoteCard from './NoteCard';
import { useNotes } from '@/contexts/NotesContext';
import { FileIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Note } from 'models';

const NotesList: React.FC = () => {
  const { 
    filteredNotes, 
    updateNote,
    deleteNote,
  } = useNotes();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      await deleteNote(id);
      toast({
        title: "Note supprimée",
        description: "La note a été supprimée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la note",
        variant: "destructive",
      });
    }
  };

  const handleUpdate= async (note: Note) => {
    try {
      await updateNote(note);
      toast({
        title: "Lien mis à jour",
        description: `${note.name} a été modifié avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: `Impossible de modifier ${note.name} `,
        variant: "destructive",
      });
    }
  };


  if (filteredNotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
        <FileIcon size={48} className="opacity-30 mb-4" />
        <p className="text-lg">Aucune note à afficher</p>
        <p className="text-sm">Modifiez vos filtres ou ajoutez une nouvelle note</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredNotes.map((note) => (
        <NoteCard
          key={note._id}
          note={note}
          UpdateNote={handleUpdate}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default NotesList;

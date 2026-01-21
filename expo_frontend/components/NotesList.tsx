import { useNotes } from '@contexts/NotesContext';
import { Feather } from '@expo/vector-icons';
import useToast from '@toast/use-toast';
import { Note } from 'models';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import NoteCard from './NoteCard';

const NotesList: React.FC = () => {
  const { filteredNotes, updateNote, deleteNote } = useNotes();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      await deleteNote(id);
      toast({
        title: "Note supprimée",
        description: "La note a été supprimée avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error?.message || "Impossible de supprimer la note",
        type: "error",
      });
    }
  };

  const handleUpdate = async (note: Note) => {
    try {
      await updateNote(note);
      toast({
        title: "Lien mis à jour",
        description: `${note.name} a été modifié avec succès`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error?.message || `Impossible de modifier ${note.name}`,
        type: "error",
      });
    }
  };

  if (filteredNotes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Feather
          name="file-text"
          size={48}
          color="rgba(0,0,0,0.3)"
          style={styles.emptyIcon}
        />
        <Text style={styles.emptyTitle}>Aucune note à afficher</Text>
        <Text style={styles.emptySubtitle}>
          Modifiez vos filtres ou ajoutez une nouvelle note
        </Text>
      </View>
    );
  }

  return (
    //keyboard hide when scroll
    
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardDismissMode='on-drag'  >
      <View style={styles.flexContainer}>
        {filteredNotes.map((item) => (
            <NoteCard
              note={item}
              UpdateNote={handleUpdate}
              onDelete={handleDelete}
              key={item._id}
            />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({

  flexContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    height: 240,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default NotesList;
import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useAuth } from '@contexts/AuthContext';
import { useNotes } from '@/contexts/NotesContext';

import Header from '@/components/Header';
import CreateNoteDialog from '@/components/CreateNoteDialog';
import SearchAndFilterBar from '@/components/SearchAndFilterBar';
import NotesList from '@/components/NotesList';

export default function Index() {
  const router = useRouter();

  const { filteredNotes } = useNotes();
  const { authState } = useAuth();
  const { isAuthenticated, isLoading } = authState;

  // ✅ Redirection déplacée dans un useEffect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <View className="min-h-screen flex items-center justify-center bg-background">
        <Text className="text-lg">Chargement...</Text>
      </View>
    );
  }

  // Optionnel : éviter un flash du contenu
  if (!isAuthenticated) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Mes Notes</Text>
            <Text style={styles.subtitle}>
              {filteredNotes.length} note
              {filteredNotes.length !== 1 ? 's' : ''}{' '}
              {filteredNotes.length > 0
                ? 'trouvée' + (filteredNotes.length !== 1 ? 's' : '')
                : ''}
            </Text>
          </View>
          <CreateNoteDialog />
        </View>

        <SearchAndFilterBar />
        <NotesList />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17171C',
    flexDirection: 'column',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    width: '100%',
    alignSelf: 'center',
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});

import { useNotes } from '@contexts/NotesContext';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';

const SearchAndFilterBar: React.FC = () => {
  const {
    sortOption,
    filterOption,
    searchQuery,
    isLoading,
    setSortOption,
    setFilterOption,
    setSearchQuery,
    recalculateNotes,
  } = useNotes();

  return (
    <BlurView style={styles.container} tint="dark" intensity={25}>
      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={18} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par nom ou lien..."
          placeholderTextColor="#6B7280"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* FILTERS */}
      <View style={styles.filterContainer}>
        <View style={styles.pickerWrapper}>
          <FontAwesome name="sort" size={16} color="#9CA3AF" />
          <Picker
            selectedValue={sortOption}
            style={styles.picker}
            dropdownIconColor="#9CA3AF"
            onValueChange={setSortOption}
          >
            <Picker.Item label="Nom" value="name" />
            <Picker.Item label="Date" value="date" />
            <Picker.Item label="Note" value="note" />
          </Picker>
        </View>

        <View style={styles.pickerWrapper}>
          <Feather name="filter" size={16} color="#9CA3AF" />
          <Picker
            selectedValue={filterOption}
            style={styles.picker}
            dropdownIconColor="#9CA3AF"
            onValueChange={setFilterOption}
          >
            <Picker.Item label="Toutes" value="all" />
            <Picker.Item label="Favorites" value="liked" />
            <Picker.Item label="Actives" value="active" />
            <Picker.Item label="Archivées" value="dead" />
          </Picker>
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={recalculateNotes}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Feather name="rotate-cw" size={16} color="#fff" />
          )}
          <Text style={styles.buttonText}>Recalculer</Text>
        </TouchableOpacity>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  /* SEARCH */
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(23,23,28,0.7)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  searchInput: {
    flex: 1,
    color: '#E5E7EB',
    fontSize: 14,
  },

  /* FILTERS */
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(23,23,28,0.7)',
    borderRadius: 12,
    paddingHorizontal: 8,
    height: 44,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  picker: {
    width: 120,
    color: '#E5E7EB',
    backgroundColor: 'transparent',
  },

  /* BUTTON */
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#A855F7',
    shadowColor: '#A855F7',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default SearchAndFilterBar;

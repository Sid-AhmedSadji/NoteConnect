import { Feather, FontAwesome5,MaterialCommunityIcons } from '@expo/vector-icons';
import Note from '@models/Note';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';

interface NoteCardProps {
  note: Note;
  UpdateNote: (note: Note) => void;
  onDelete: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, UpdateNote, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [linkValue, setLinkValue] = useState(note.link);
  const [nameValue, setNameValue] = useState(note.name);

  const handleSave = () => {
    const updatedNote = note.updateNote({ link: linkValue, name: nameValue });
    UpdateNote(updatedNote);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLinkValue(note.link);
    setNameValue(note.name);
    setIsEditing(false);
  };

  const handleToggleLiked = () => {
    const updatedNote = new Note({ ...note, liked: !note.liked });
    UpdateNote(updatedNote);
  };

  const handleToggleIsDead = () => {
    const updatedNote = new Note({ ...note, isDead: !note.isDead });
    UpdateNote(updatedNote);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: fr,
      });
    } catch {
      return 'Date invalide';
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Supprimer la note",
      "Êtes-vous sûr de vouloir supprimer cette note ? Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => onDelete(note._id),
        },
      ]
    );
  };

  return (
    <View style={[styles.card, note.isDead && styles.deadCard]}>
      {/* En-tête */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {isEditing ? (
            <TextInput
              value={nameValue}
              onChangeText={setNameValue}
              style={styles.textInput}
              placeholder="Nom de la note"
            />
          ) : (
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail" >
              {note.name}
            </Text>
          )}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={handleToggleLiked}
            style={styles.iconButton}
          >
            <Feather
              name="heart"
              size={18}
              color={note.liked ? "#F87171" : "#9CA3AF"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleToggleIsDead}
            style={styles.iconButton}
          >
            <MaterialCommunityIcons
              name="emoticon-dead"
              size={18}
              color={note.isDead ? "#4B5563" : "#9CA3AF"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={confirmDelete} style={styles.iconButton}>
            <Feather name="trash" size={18} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Zone d'édition ou affichage du lien */}
      <View style={styles.body}>
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              value={linkValue}
              onChangeText={setLinkValue}
              style={[styles.textInput, styles.linkInput]}
              selectTextOnFocus
              placeholder="Lien de la note"
            />
            <TouchableOpacity
              onPress={handleSave}
              style={styles.iconButton}
            >
              <Feather name="check" size={16} color="#4B5563" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.iconButton}
            >
              <Feather name="x" size={16} color="#4B5563" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.linkContainer}>
            <Feather name="link" size={14} color="#9CA3AF" />
            <Text
              style={styles.linkText}
              numberOfLines={1}
              ellipsizeMode="tail"
              onPress={() => {
                // Pour ouvrir le lien, vous pouvez utiliser Linking.openURL(note.link)
              }}
            >
              {note.link}
            </Text>
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              style={styles.iconButton}
            >
              <Feather name="edit-2" size={14} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Note: {note.note}/100</Text>
        </View>
        <Text style={styles.dateText}>{formatDate(note.date)}</Text>
      </View>

      {note.modificationCount > 0 && (
        <Text style={styles.modificationText}>
          {note.modificationCount} modification{note.modificationCount > 1 ? 's' : ''}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1C1C23",
    borderRadius: 16,
    padding: 16,
    marginVertical: 15,
  
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  deadCard: {
    opacity: 0.7,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#F9FAFB",
    letterSpacing: 0.3,
  },  
  textInput: {
    height: 38,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    color: "#F9FAFB",
  },
  
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  iconButton: {
    padding: 4,
    marginHorizontal: 2,
  },
  body: {
    marginTop: 8,
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  linkInput: {
    flex: 1,
    marginRight: 8,
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  
  linkText: {
    flex: 1,
    marginLeft: 6,
    color: "#9CA3AF",
    fontSize: 13,
  },
  
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    color: "white",
  },
  dateText: {
    fontSize: 12,
    color: "#6B7280",
  },
  modificationText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    textAlign: "right",
  },
});

export default NoteCard;
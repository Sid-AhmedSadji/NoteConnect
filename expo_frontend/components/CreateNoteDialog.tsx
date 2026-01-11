import { useNotes } from '@/contexts/NotesContext';
import useToast from '@/toast/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as z from 'zod';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const formSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  link: z.string().url("L'URL doit être valide"),
});

type FormData = z.infer<typeof formSchema>;

const CreateNoteDialog = () => {
  const { toast } = useToast();
  const { addNote } = useNotes();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', link: '' },
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: FormData) => {
    setLoading(true);
    try {
      await addNote(values);
      toast({
        title: 'Note créée',
        description: 'La note a bien été créée',
      });
      reset();
      setModalVisible(false);
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {/* Trigger */}
      <TouchableOpacity
        style={styles.triggerButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={1}
      >
        <Feather name="plus" size={16} color="#fff" />
        <Text style={styles.triggerButtonText}>Nouvelle note</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="fade" transparent>
        <BlurView tint="dark" intensity={40} style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Créer une note</Text>

            {/* Nom */}
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputGroup}>
                  <View style={styles.inputWrapper}>
                    <Feather name="edit-3" size={16} color="#9CA3AF" />
                    <TextInput
                      style={styles.input}
                      placeholder="Nom de la note"
                      placeholderTextColor="#6B7280"
                      value={value}
                      onChangeText={onChange}
                    />
                  </View>
                  {errors.name && (
                    <Text style={styles.errorText}>{errors.name.message}</Text>
                  )}
                </View>
              )}
            />

            {/* Lien */}
            <Controller
              control={control}
              name="link"
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputGroup}>
                  <View style={styles.inputWrapper}>
                    <Feather name="link" size={16} color="#9CA3AF" />
                    <TextInput
                      style={styles.input}
                      placeholder="https://exemple.com"
                      placeholderTextColor="#6B7280"
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="none"
                    />
                  </View>
                  {errors.link && (
                    <Text style={styles.errorText}>{errors.link.message}</Text>
                  )}
                </View>
              )}
            />

            {/* Actions */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.disabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>Créer</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              disabled={loading}
            >
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  /* Trigger */
  triggerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  triggerButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 420,
    backgroundColor: 'rgba(23,23,28,1)',
    borderRadius: 16,
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
  },

  /* Inputs */
  inputGroup: {
    gap: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(17,17,23,0.8)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  input: {
    flex: 1,
    color: '#E5E7EB',
    fontSize: 14,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
  },

  /* Buttons */
  submitButton: {
    marginTop: 6,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  cancelText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default CreateNoteDialog;

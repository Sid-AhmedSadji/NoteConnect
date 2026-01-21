import axiosInstance from '../libs/axiosInstance';
import Note from '@models/Note';

const NoteApi = {
  getNote: async (): Promise<Note[]> => {
    const response = await axiosInstance.get('/Notes');
    return response.data;
  },

  createNote: async ({ note }: { note: Omit<Note, '_id'> }): Promise<Note> => {
    if (!note) throw new Error('Note is required');
    const response = await axiosInstance.post('/Notes', note);
    return response;
  },

  updateNote: async ({ id, updateNote }: { id: string; updateNote: Note }): Promise<Note> => {
    if (!id) throw new Error('Note ID is required');
    if (!updateNote) throw new Error('Note is required');
    const response = await axiosInstance.put(`/Notes/${id}`, updateNote);
    return response;
  },

  deleteNote: async ({ id }: { id: string }): Promise<{ success: boolean }> => {
    if (!id) throw new Error('Note ID is required');
    const response = await axiosInstance.delete(`/Notes/${id}`);
    return response;
  },

  calculNotes: async (): Promise<Note[]> => {
    const response = await axiosInstance.post('/Notes/calcul-notes');
    return response;
  },

  pingNotes: async (): Promise<any> => {
    const response = await axiosInstance.post('/Notes/ping');
    return response;
  }
};

export default NoteApi;

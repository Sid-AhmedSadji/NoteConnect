import axiosInstance from './axiosInstance';

const NoteApi = {
  getNote: async () => {
    return await axiosInstance.get('/Notes');
  },

  createNote: async ({ note }) => {
    if (!note) throw new Error('Note is required');
    return await axiosInstance.post('/Notes', note);
  },

  updateNote: async ({ id, updateNote, }) => {
    if (!id) throw new Error('Note ID is required');
    return await axiosInstance.put(`/Notes/${id}`, updateNote);
  },

  deleteNote: async ({ id }) => {
    if (!id) throw new Error('Note ID is required');
    return await axiosInstance.delete(`/Notes/${id}`);
  },

  calculNotes: async () => {
    return await axiosInstance.post('/Notes/calcul-notes');
  },

  pingNotes: async () => {
    return await axiosInstance.post('/Notes/ping');
  },
};

export default NoteApi;

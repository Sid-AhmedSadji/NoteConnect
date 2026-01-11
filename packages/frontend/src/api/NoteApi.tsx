import axiosInstance from './axiosInstance';

const NoteApi = {
    // Ici, 'res' contient déjà { status, message, data } grâce à l'intercepteur
    getNote: async () => {
        const res = await axiosInstance.get('/Notes');
        return res; // On retourne l'objet complet pour avoir le message et le status si besoin
    },

    createNote: async (note) => { // Plus simple sans destructuration si tu passes l'objet directement
        if (!note) throw new Error('Note is required');
        return await axiosInstance.post('/Notes', note);
    },

    updateNote: async (id, updateData) => {
        if (!id) throw new Error('Note ID is required');
        return await axiosInstance.put(`/Notes/${id}`, updateData);
    },

    deleteNote: async (id) => {
        if (!id) throw new Error('Note ID is required');
        return await axiosInstance.delete(`/Notes/${id}`);
    },

    calculNotes: async () => {
        return await axiosInstance.post('/Notes/calcul-notes');
    },

    pingNotes: async () => {
        return await axiosInstance.post('/Notes/ping');
    }
}

export default NoteApi;
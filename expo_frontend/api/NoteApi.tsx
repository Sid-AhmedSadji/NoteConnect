import axiosInstance from '../libs/axiosInstance';

const NoteApi = {

    getNote: async () =>{
        const response = await axiosInstance.get('/Notes');
        return response.data;
    },

    createNote : async ({note}) =>{
        if (!note)
            throw new Error('Note is required');
        const response = await axiosInstance.post('/Notes', note);
        return response.data;

    },

    updateNote: async ({id, updateNote}) =>{
        if (!id)
            throw new Error('Note ID is required');
        if (!updateNote)
            throw new Error('Note is required');
        const response = await axiosInstance.put('/Notes/'+id,updateNote);
        return response.data;
    },

    deleteNote: async ({id}) =>{
        if (!id)
            throw new Error('Note ID is required');
        const response = await axiosInstance.delete('/Notes/'+id);
        return response.data;
    },

    calculNotes: async () =>{
        const response = await axiosInstance.post('/Notes/calcul-notes');
        return response.data;
    },

    pingNotes: async () =>{
        const response = await axiosInstance.post('/Notes/ping');
        return response.data;
    }
}

export default NoteApi;
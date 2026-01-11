import axiosInstance from './axiosInstance';

const UserApi = {
    login: async ({ username, password }) => {
        if (!username || !password) throw new Error('Username and password are required');
        return await axiosInstance.post('/user/login', { username, password });
    },

    register: async ({ username, password }) => {
        if (!username || !password) throw new Error('Username and password are required');
        return await axiosInstance.post('/user', { username, password });
    },

    me: async () => {
        return await axiosInstance.get('/user/me');
    },

    update: async ({ _id, username, password }) => {
        if (!_id) throw new Error('User ID is required');
        return await axiosInstance.put(`/user/${_id}`, { username, password });
    },

    delete: async ({ _id }) => {
        if (!_id) throw new Error('User ID is required');
        return await axiosInstance.delete(`/user/${_id}`);
    },

    logout: async () => {
        return await axiosInstance.post('/user/logout');
    },

    verifyPassword: async ({ password }) => {
        if (!password) throw new Error('Password is required');
        return await axiosInstance.post('/user/verify-password', { password });
    },
};

export default UserApi;
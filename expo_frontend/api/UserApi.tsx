import axiosInstance from '../libs/axiosInstance';

const UserApi = {
    login: async ({username, password}) => {
        if (!username || !password)
            throw new Error('Username and password are required');
        const response = await axiosInstance.post('/user/login', {username: username, password: password});
        return response.data;
    },
    logout: async () => {
        const response = await axiosInstance.post('/user/logout');
        return response.data;
    },
    register: async ({username, password}) => {
        if (!username || !password)
            throw new Error('Username and password are required');
        const response = await axiosInstance.post('/user', { username : username, password: password});
        return response.data;
    },
    delete: async ({_id}) => {
        if (!_id)
            throw new Error('User ID is required');
        const response = await axiosInstance.delete('/user/' + _id);
        return response.data;
    },
    update: async ({_id, username, password}) => {
        const response = await axiosInstance.put('/user/' + _id, { username : username, password: password});
        return response.data;
    },
    me: async () => {
        const response = await axiosInstance.get('/user/me');
        return response.data;
    },
    verifyPassword: async ({password}) => {
        if (!password)
            throw new Error('Password is required');
        const response = await axiosInstance.post('/user/verify-password', {password: password});
        return response.data;
    },
};

export default UserApi;
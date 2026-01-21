import axiosInstance from '../libs/axiosInstance';
import User from '@models/User';

interface LoginData { username: string; password: string; }

const UserApi = {
  login: async ({ username, password }: LoginData): Promise<User> => {
    if (!username || !password) throw new Error('Username and password are required');
    const response = await axiosInstance.post('/user/login', { username, password });
    return response;
  },

  logout: async (): Promise<{ success: boolean }> => {
    const response = await axiosInstance.post('/user/logout');
    return response;
  },

  register: async ({ username, password }: LoginData): Promise<User> => {
    if (!username || !password) throw new Error('Username and password are required');
    const response = await axiosInstance.post('/user', { username, password });
    return response;
  },

  delete: async ({ _id }: { _id: string }): Promise<{ success: boolean }> => {
    if (!_id) throw new Error('User ID is required');
    const response = await axiosInstance.delete(`/user/${_id}`);
    return response;
  },

  update: async ({ _id, username, password }: { _id: string; username: string; password: string }): Promise<User> => {
    const response = await axiosInstance.put(`/user/${_id}`, { username, password });
    return response;
  },

  me: async (): Promise<User> => {
    const response = await axiosInstance.get('/user/me');
    return response;
  },

  verifyPassword: async ({ password }: { password: string }): Promise<{ valid: boolean }> => {
    if (!password) throw new Error('Password is required');
    const response = await axiosInstance.post('/user/verify-password', { password });
    return response;
  },
};

export default UserApi;

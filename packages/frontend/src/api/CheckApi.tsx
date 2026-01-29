import axiosInstance from './axiosInstance';

const CheckApi = {
  getChecks: async () => {
    return await axiosInstance.get('/checks');
  },

  getChecksPending: async () => {
    return await axiosInstance.get('/checks/pending');
  },

  validateCheck: async ({ id, success, }) => {
    if (!id) throw new Error('Check ID is required');
    return await axiosInstance.post(`/checks/validate/${id}`, { success });
  },

  actualiseCheck: async ({ id }) => {
    if (!id) throw new Error('Check ID is required');
    return await axiosInstance.put(`/checks/refresh/${id}`);
  },
};

export default CheckApi;

import axios from 'axios';

if (!import.meta.env.VITE_API_URL) 
    throw new Error('VITE_API_URL is not defined in the environment variables');

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, 
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        const errorData = error.response?.data;
        const message = errorData?.message || error.message || 'Erreur inconnue';
        
        console.error('Erreur API :', {
            status: error.response?.status,
            message: message
        });

        return Promise.reject(errorData || { message });
    }
);

export default axiosInstance;
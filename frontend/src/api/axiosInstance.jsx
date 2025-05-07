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
    (response) => response,
    (error) => {
        console.error('Erreur dans la requête :', 
            error.response?.data || error.message || 'Erreur inconnue');  
        return Promise.reject(error);
    }
);

export default axiosInstance;
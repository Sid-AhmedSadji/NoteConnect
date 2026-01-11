// libs/axiosInstance.ts ----------------------------------------------------
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import * as SecureStore from 'expo-secure-store';

/* ----------------------------------------------------------------------- */
/* ENV & validations                                                       */
/* ----------------------------------------------------------------------- */
const API_URL   = process.env.EXPO_PUBLIC_API_URL;
const TOKEN_KEY = process.env.EXPO_PUBLIC_TOKEN_KEY; // nom du cookie

if (!API_URL)  throw new Error('EXPO_PUBLIC_API_URL is not defined');
if (!TOKEN_KEY) throw new Error('EXPO_PUBLIC_TOKEN_KEY is not defined');

/* ----------------------------------------------------------------------- */
/* Instance                                                                */
/* ----------------------------------------------------------------------- */
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  // withCredentials est ignoré par React Native, mais on le garde pour le web
  withCredentials: true,
});

/* ----------------------------------------------------------------------- */
/* Helpers                                                                 */
/* ----------------------------------------------------------------------- */
const getStoredCookie = () => SecureStore.getItemAsync(TOKEN_KEY);
const storeCookie     = (cookie: string) =>
  SecureStore.setItemAsync(TOKEN_KEY, cookie);
const clearCookie     = () => SecureStore.deleteItemAsync(TOKEN_KEY);

/* ----------------------------------------------------------------------- */
/* REQUEST INTERCEPTOR : injecte le cookie                                 */
/* ----------------------------------------------------------------------- */
axiosInstance.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    try {
      const cookie = await getStoredCookie();
      if (cookie) {
        config.headers = {
          ...(config.headers ?? {}),
          Cookie: cookie, // clé “Cookie” sensible à la casse
        };
      }
    } catch (err) {
      console.warn('[axios] Unable to read cookie from SecureStore', err);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/* ----------------------------------------------------------------------- */
/* RESPONSE INTERCEPTOR : mémorise le nouveau cookie + purge 401           */
/* ----------------------------------------------------------------------- */
axiosInstance.interceptors.response.use(
  async (response: AxiosResponse) => {
    try {
      const rawHeader = response.headers['set-cookie'] ?? response.headers['Set-Cookie'];
      if (rawHeader) {
        // Axios peut renvoyer un tableau selon la plateforme
        const cookie = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;
        await storeCookie(cookie);
      }
    } catch (err) {
      console.warn('[axios] Unable to save cookie to SecureStore', err);
    }
    return response;
  },

  async (error: AxiosError) => {
    // Si l’API retourne 401, on supprime le cookie local pour forcer la reco
    
    if (error.response?.status === 401) {
      await clearCookie();
    }

    console.error(
      '[axios] request error:',
      error.response?.data ?? error.message
    );
    return Promise.reject(error);
  }
);

export default axiosInstance;
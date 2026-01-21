// libs/axiosInstance.ts ----------------------------------------------------
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';

/* ----------------------------------------------------------------------- */
/* ENV & validations                                                       */
/* ----------------------------------------------------------------------- */
const API_URL = process.env.EXPO_PUBLIC_API_URL;
const TOKEN_KEY = process.env.EXPO_PUBLIC_TOKEN_KEY;

if (!API_URL) throw new Error('EXPO_PUBLIC_API_URL is not defined');
if (!TOKEN_KEY) throw new Error('EXPO_PUBLIC_TOKEN_KEY is not defined');

/* ----------------------------------------------------------------------- */
/* SecureStore helpers                                                     */
/* ----------------------------------------------------------------------- */
const getStoredCookie = async (): Promise<string | null> =>
  await SecureStore.getItemAsync(TOKEN_KEY);

const storeCookie = async (cookie: string): Promise<void> =>
  await SecureStore.setItemAsync(TOKEN_KEY, cookie);

const clearCookie = async (): Promise<void> =>
  await SecureStore.deleteItemAsync(TOKEN_KEY);

/* ----------------------------------------------------------------------- */
/* Cookie parser : garde uniquement la valeur avant ";"                   */
/* ----------------------------------------------------------------------- */
const parseCookie = (rawCookie: string): string => rawCookie.split(';')[0];

/* ----------------------------------------------------------------------- */
/* Axios instance                                                          */
/* ----------------------------------------------------------------------- */
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // ignoré sur RN mais utile sur web
});

/* ----------------------------------------------------------------------- */
/* Request interceptor : injecte le cookie                                 */
/* ----------------------------------------------------------------------- */
axiosInstance.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    try {
      const cookie = await getStoredCookie();
      if (cookie) {
        config.headers = { ...config.headers, Cookie: cookie };
      }
    } catch (err) {
      console.warn('[axios] Unable to read cookie from SecureStore', err);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/* ----------------------------------------------------------------------- */
/* Response interceptor : mémorise le cookie + purge 401                   */
/* ----------------------------------------------------------------------- */
axiosInstance.interceptors.response.use(
  async (response: AxiosResponse) => {
    try {
      const rawHeader =
        response.headers['set-cookie'] ?? response.headers['Set-Cookie'];
      if (rawHeader) {
        const cookie = Array.isArray(rawHeader)
          ? parseCookie(rawHeader[0])
          : parseCookie(rawHeader);
        await storeCookie(cookie);
      }
    } catch (err) {
      console.warn('[axios] Unable to save cookie to SecureStore', err);
    }
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn('[axios] 401 Unauthorized — clearing cookie');
      await clearCookie();
    }

    const message =
      error?.response?.data?.message ||
      error.message ||
      'Erreur inconnue';
    console.error('[axios] Request error:', message);

    return Promise.reject(new Error(message));
  }
);

/* ----------------------------------------------------------------------- */
/* Wrapper pour normaliser la réponse du backend                           */
/* ----------------------------------------------------------------------- */
export const apiRequest = async <T>(request: Promise<AxiosResponse<any>>): Promise<T> => {
  const res = await request;
  const { status, message, data } = res.data;

  if (status === 'error') throw new Error(message);
  return data as T;
};

/* ----------------------------------------------------------------------- */
/* Helper GET                                                              */
/* ----------------------------------------------------------------------- */
export const apiGet = async <T>(url: string): Promise<T> => {
  return apiRequest<T>(axiosInstance.get(url));
};

/* ----------------------------------------------------------------------- */
/* Export axios instance                                                   */
/* ----------------------------------------------------------------------- */
export default axiosInstance;

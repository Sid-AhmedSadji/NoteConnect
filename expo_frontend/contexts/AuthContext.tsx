import UserApi from '@/api/UserApi';
import { AuthState } from '@/types';
import User from '@models/User';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '@/libs/axiosInstance';

interface AuthContextProps {
  authState: AuthState;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { username: string; password: string }) => Promise<void>;
  deleteProfile: (_id: string) => Promise<void>;
  verifyPassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const handleApiCall = async <T>(apiCall: () => Promise<{ status: string; message: string; data: T }>, errorMsg: string): Promise<T | null> => {
    try {
      const response = await apiCall();
      return response;
    } catch (error: any) {
      console.error(errorMsg, error?.message ?? error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const data = await handleApiCall(() => apiRequest(UserApi.me()), 'Erreur lors de la récupération de l’utilisateur');
      if (data) setAuthState({ user: new User(data), isAuthenticated: true, isLoading: false });
      else setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    };
    fetchUser();
  }, []);

  const login = async (username: string, password: string) => {
    const data = await handleApiCall(() => apiRequest(UserApi.login({ username, password })), 'Erreur lors de la connexion');
    if (data) setAuthState({ user: new User(data), isAuthenticated: true, isLoading: false });
  };

  const register = async (username: string, password: string) => {
    await handleApiCall(() => apiRequest(UserApi.register({ username, password })), 'Erreur lors de l\'inscription');
  };

  const logout = async () => {
    await handleApiCall(() => apiRequest(UserApi.logout()), 'Erreur lors de la déconnexion');
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
  };

  const updateProfile = async (data: { username: string; password: string }) => {
    if (!authState.user) throw new Error('Utilisateur non connecté');
    const updated = await handleApiCall(() => apiRequest(UserApi.update({ _id: authState.user._id, ...data })), 'Erreur lors de la mise à jour du profil');
    if (updated) setAuthState({ user: new User(updated), isAuthenticated: true, isLoading: false });
  };

  const deleteProfile = async (_id: string) => {
    await handleApiCall(() => apiRequest(UserApi.delete({ _id })), 'Erreur lors de la suppression du profil');
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
  };

  const verifyPassword = async (password: string) => {
    await handleApiCall(() => apiRequest(UserApi.verifyPassword({ password })), 'Erreur lors de la vérification du mot de passe');
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        register,
        logout,
        updateProfile,
        deleteProfile,
        verifyPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  return context;
};

export default AuthProvider;

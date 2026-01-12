import UserApi from '@/api/UserApi';
import { AuthState } from '@/types';
import User from '@models/User';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '@/libs/axiosInstance'; // <- notre wrapper

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

  /* ----------------------------------------------------------------------- */
  /* Initial fetch user                                                      */
  /* ----------------------------------------------------------------------- */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiRequest(UserApi.me());
        setAuthState({
          user: new User(data),
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };
    fetchUser();
  }, []);

  /* ----------------------------------------------------------------------- */
  /* Auth actions                                                            */
  /* ----------------------------------------------------------------------- */
  const login = async (username: string, password: string) => {
    const data = await apiRequest(UserApi.login({ username, password }));
    setAuthState({ user: new User(data), isAuthenticated: true, isLoading: false });
  };

  const register = async (username: string, password: string) => {
    await apiRequest(UserApi.register({ username, password }));
  };

  const logout = async () => {
    await apiRequest(UserApi.logout());
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
  };

  const updateProfile = async (data: { username: string; password: string }) => {
    if (!authState.user) throw new Error('Utilisateur non connecté');
    const updated = await apiRequest(UserApi.update({ _id: authState.user._id, ...data }));
    setAuthState({ user: new User(updated), isAuthenticated: true, isLoading: false });
  };

  const deleteProfile = async (_id: string) => {
    await apiRequest(UserApi.delete({ _id }));
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
  };

  const verifyPassword = async (password: string) => {
    await apiRequest(UserApi.verifyPassword({ password }));
  };

  /* ----------------------------------------------------------------------- */
  /* Provider                                                                */
  /* ----------------------------------------------------------------------- */
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

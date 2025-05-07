import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState } from '@/types';
import User from 'models/User';
import UserApi from '@/api/UserApi';

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await UserApi.me();
        console.log(response.data);
        setAuthState({
          user: new User(response.data),
          isAuthenticated: true,
          isLoading: false,
        });
      } catch(error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    fetchUser();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await UserApi.login({ username, password });
      setAuthState({
        user: new User(response.data),
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw error.response.data.message;
    }
  };

  const register = async (username: string, password: string) => {
    try {
      await UserApi.register({ username, password });
    } catch (error) {
      throw error.response.data.message;
    }
  };

  const logout = async () => {
    try {
      await UserApi.logout();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      throw error.response.data.message;
    }
  };

  const updateProfile = async ( data: { username: string; password: string }) => {
    try {
      console.log( data);
      console.log(authState.user._id);
      const response = await UserApi.update({ _id: authState.user._id, ...data });
      setAuthState({
        user: new User(response.data),
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw error.response.data.message;
    }
  };

  const deleteProfile = async (_id: string) => {
    try {
      await UserApi.delete({ _id });
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      throw error.response.data.message;
    }
  };

  const verifyPassword = async (password: string) => {
    try {
      await UserApi.verifyPassword({ password });
    } catch (error) {
      throw error.response.data.message;
    }
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
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};

export default AuthProvider;

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState } from '@/types';
import { User } from '@noteconnect/models';
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
        setAuthState({
          user: new User(response.data),
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
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
      throw error;
    }
  };

  const register = async (username: string, password: string) => {
    try {
      await UserApi.register({ username, password });
    } catch (error) {
      throw error;
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
      throw error;
    }
  };

  const updateProfile = async (data: { username: string; password: string }) => {
    if (!authState.user) {
      throw new Error('Utilisateur non authentifié');
    }

    try {
      const response = await UserApi.update({
        _id: authState.user._id,
        ...data,
      });

      setAuthState({
        user: new User(response.data),
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw error;
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
      throw error;
    }
  };

  const verifyPassword = async (password: string) => {
    try {
      await UserApi.verifyPassword({ password });
    } catch (error) {
      throw error;
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

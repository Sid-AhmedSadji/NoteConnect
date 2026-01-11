import { NotesProvider } from "@/contexts/NotesContext";
import { AuthProvider } from "@contexts/AuthContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ToastProvider from '@toast/ToastProvider';
import { Slot } from 'expo-router';
import Toast from 'react-native-toast-message';

const qc = new QueryClient();

export default function Root() {
  
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <NotesProvider>
          <ToastProvider>
            <Slot />
            <Toast />
          </ToastProvider>
        </NotesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
import React from 'react';
import Toast from 'react-native-toast-message';
import { useToastStore } from './toastStore';

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts } = useToastStore();

  /* Feed every toast in the queue to the renderer ------------------------ */
  React.useEffect(() => {
    toasts.forEach(t => {
      Toast.show({
        type: t.type,
        text1: t.title,
        text2: t.subtitle,
        position: t.position ?? 'top',
        visibilityTime: t.duration ?? 3000,
      });
    });
  }, [toasts]);

  return (
    <>
      {children}
      <Toast />
    </>
  );
}
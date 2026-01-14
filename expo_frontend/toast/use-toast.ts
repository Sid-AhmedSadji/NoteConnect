import { pushToast, ToastKind } from './toastStore';

export default function useToast() {
  const toast = (options: {
    title: string;
    description?: string;
    type?: ToastKind;
    duration?: number;
  }) => {
    const { title, description, type = 'info', duration } = options;
    return pushToast({ type, title, subtitle: description, duration });
  };

  const success = (
    title: string,
    description?: string,
    duration?: number
  ) =>
    pushToast({ type: 'success', title, subtitle: description, duration });
  const error = (
    title: string,
    description?: string,
    duration?: number
  ) =>
    pushToast({ type: 'error', title, subtitle: description, duration });
  const info = (
    title: string,
    description?: string,
    duration?: number
  ) =>
    pushToast({ type: 'info', title, subtitle: description, duration });

  return { toast, success, error, info };
}
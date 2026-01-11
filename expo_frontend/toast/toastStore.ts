// ──────────────────────────────────────────────────────────────────────────
// toastStore.ts – state + API (aucune dépendance UI)
// ──────────────────────────────────────────────────────────────────────────
import React from 'react';
import type { ToastShowParams } from 'react-native-toast-message';

/* Config ----------------------------------------------------------------- */
const LIMIT       = 3;      // nombre max simultané
const AUTO_REMOVE = 5_000;  // ms après dismiss avant purge

/* Types ------------------------------------------------------------------ */
export type ToastKind = 'success' | 'error' | 'info';

export type ToastData = {
  id: string;
  type: ToastKind;
  title: string;
  subtitle?: string;
  position?: ToastShowParams['position'];
  duration?: number; // ms – override de la durée par défaut
};

interface State { toasts: ToastData[] }

/* Internal state --------------------------------------------------------- */
let state: State = { toasts: [] };
const listeners: Array<(s: State) => void> = [];

let uid = 0;
const nextId = () => (++uid).toString();

const timeouts = new Map<string, NodeJS.Timeout>();

/* Helpers ---------------------------------------------------------------- */
const notify = () => listeners.forEach(l => l(state));

function scheduleHardRemove(id: string) {
  if (timeouts.has(id)) return;
  const t = setTimeout(() => {
    timeouts.delete(id);
    state = { toasts: state.toasts.filter(t => t.id !== id) };
    notify();
  }, AUTO_REMOVE);
  timeouts.set(id, t);
}

/* Public API ------------------------------------------------------------- */
// Ajoute un toast et renvoie des helpers pour l'update / dismiss
export function pushToast(input: Omit<ToastData, 'id'>) {
  const toast: ToastData = { ...input, id: nextId() };
  state = { toasts: [toast, ...state.toasts].slice(0, LIMIT) };
  notify();

  return {
    id: toast.id,

    update: (patch: Partial<Omit<ToastData, 'id'>>) => {
      state = {
        toasts: state.toasts.map(t =>
          t.id === toast.id ? { ...t, ...patch } : t
        ),
      };
      notify();
    },

    dismiss: () => dismissToast(toast.id),
  };
}

/** Ferme un toast précis (ou tous si `id` omis) */
export function dismissToast(id?: string) {
  if (id) scheduleHardRemove(id);
  else state.toasts.forEach(t => scheduleHardRemove(t.id));
  // on cache immédiatement (open=false éventuel dans un renderer)
  notify();
}

/** Hook React pour s'abonner au store depuis la UI */
export function useToastStore() {
  const [, force] = React.useReducer(x => x + 1, 0);

  React.useEffect(() => {
    listeners.push(force);
    return () => {
      const idx = listeners.indexOf(force);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  return state;
}
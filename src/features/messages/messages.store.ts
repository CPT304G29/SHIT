import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MessagesState {
  read: Record<string, true>;
  dismissed: Record<string, true>;
  markRead: (id: string) => void;
  markUnread: (id: string) => void;
  markAllRead: (ids: string[]) => void;
  dismiss: (id: string) => void;
  reset: () => void;
}

export const useMessagesStore = create<MessagesState>()(
  persist(
    (set) => ({
      read: {},
      dismissed: {},
      markRead: (id) =>
        set((s) => ({ read: { ...s.read, [id]: true } })),
      markUnread: (id) =>
        set((s) => {
          const { [id]: _drop, ...rest } = s.read;
          void _drop;
          return { read: rest };
        }),
      markAllRead: (ids) =>
        set((s) => {
          const next = { ...s.read };
          for (const id of ids) next[id] = true;
          return { read: next };
        }),
      dismiss: (id) =>
        set((s) => ({ dismissed: { ...s.dismissed, [id]: true } })),
      reset: () => set({ read: {}, dismissed: {} }),
    }),
    { name: 'shit-messages' }
  )
);

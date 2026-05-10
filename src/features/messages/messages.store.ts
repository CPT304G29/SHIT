import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MessagesState {
  read: Record<string, true>;
  dismissed: Record<string, true>;
  snoozed: Record<string, number>; // id -> epoch ms until which it's hidden
  markRead: (id: string) => void;
  markUnread: (id: string) => void;
  markAllRead: (ids: string[]) => void;
  dismiss: (id: string) => void;
  dismissMany: (ids: string[]) => void;
  snooze: (id: string, untilEpochMs: number) => void;
  snoozeMany: (ids: string[], untilEpochMs: number) => void;
  unsnooze: (id: string) => void;
  reset: () => void;
}

export const useMessagesStore = create<MessagesState>()(
  persist(
    (set) => ({
      read: {},
      dismissed: {},
      snoozed: {},
      markRead: (id) => set((s) => ({ read: { ...s.read, [id]: true } })),
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
      dismiss: (id) => set((s) => ({ dismissed: { ...s.dismissed, [id]: true } })),
      dismissMany: (ids) =>
        set((s) => {
          const next = { ...s.dismissed };
          for (const id of ids) next[id] = true;
          return { dismissed: next };
        }),
      snooze: (id, until) =>
        set((s) => ({ snoozed: { ...s.snoozed, [id]: until } })),
      snoozeMany: (ids, until) =>
        set((s) => {
          const next = { ...s.snoozed };
          for (const id of ids) next[id] = until;
          return { snoozed: next };
        }),
      unsnooze: (id) =>
        set((s) => {
          const { [id]: _drop, ...rest } = s.snoozed;
          void _drop;
          return { snoozed: rest };
        }),
      reset: () => set({ read: {}, dismissed: {}, snoozed: {} }),
    }),
    { name: 'shit-messages' }
  )
);

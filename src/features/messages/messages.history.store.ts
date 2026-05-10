import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface InventorySnapshot {
  quantity: number;
  at: number; // epoch ms
}

interface HistoryState {
  // itemId -> ordered list of snapshots, oldest first
  history: Record<string, InventorySnapshot[]>;
  record: (itemId: string, quantity: number, at?: number) => void;
  prune: (olderThanMs: number, now?: number) => void;
  reset: () => void;
}

const MAX_PER_ITEM = 8;
const RETENTION_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

export const useMessagesHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: {},
      record: (itemId, quantity, at = Date.now()) =>
        set((s) => {
          const prev = s.history[itemId] ?? [];
          const last = prev[prev.length - 1];
          if (last && last.quantity === quantity) return s; // no change, skip
          const next = [...prev, { quantity, at }].slice(-MAX_PER_ITEM);
          return { history: { ...s.history, [itemId]: next } };
        }),
      prune: (olderThanMs, now = Date.now()) =>
        set((s) => {
          const cutoff = now - olderThanMs;
          const next: Record<string, InventorySnapshot[]> = {};
          for (const [id, snaps] of Object.entries(s.history)) {
            const kept = snaps.filter((sn) => sn.at >= cutoff);
            if (kept.length) next[id] = kept;
          }
          return { history: next };
        }),
      reset: () => set({ history: {} }),
    }),
    {
      name: 'shit-messages-history',
      version: 1,
      partialize: (s) => ({ history: s.history }),
    }
  )
);

export const HISTORY_RETENTION_MS = RETENTION_MS;

import { useEffect } from 'react';
import { useInventoryStore } from '@/features/inventory/inventory.store';
import { HISTORY_RETENTION_MS, useMessagesHistoryStore } from './messages.history.store';

/**
 * Subscribes to inventory changes and persists per-item quantity snapshots.
 * Pruning runs once on mount to drop entries older than the retention window.
 */
export function useTrackInventoryHistory() {
  useEffect(() => {
    useMessagesHistoryStore.getState().prune(HISTORY_RETENTION_MS);

    // Capture initial snapshot for items that have no history yet so the
    // baseline exists even without further edits.
    const initial = useInventoryStore.getState().items;
    const { record } = useMessagesHistoryStore.getState();
    for (const it of initial) record(it.id, it.quantity);

    const unsub = useInventoryStore.subscribe((state, prev) => {
      if (state.items === prev.items) return;
      const recordFn = useMessagesHistoryStore.getState().record;
      for (const it of state.items) recordFn(it.id, it.quantity);
    });

    return () => unsub();
  }, []);
}

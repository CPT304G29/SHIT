import { useMemo } from 'react';
import { useInventoryStore } from '@/features/inventory/inventory.store';
import { computeRapidDropPercent, deriveMessages } from './messages.derive';
import { useMessagesStore } from './messages.store';
import { useMessagesSettingsStore } from './messages.settings.store';
import { useMessagesHistoryStore } from './messages.history.store';
import { useNow } from './useNow';
import type { Message } from './messages.types';

const RAPID_WINDOW_MS = 24 * 60 * 60 * 1000;

export function useMessages(): Message[] {
  const now = useNow();
  const items = useInventoryStore((s) => s.items);
  const read = useMessagesStore((s) => s.read);
  const dismissed = useMessagesStore((s) => s.dismissed);
  const snoozed = useMessagesStore((s) => s.snoozed);
  const thresholds = useMessagesSettingsStore((s) => s.thresholds);
  const enabledTypes = useMessagesSettingsStore((s) => s.enabledTypes);
  const history = useMessagesHistoryStore((s) => s.history);

  return useMemo(() => {
    const derived = deriveMessages(items, {
      thresholds,
      enabledTypes,
      history,
      now,
      rapidDecreaseWindowMs: RAPID_WINDOW_MS,
    });
    return derived
      .filter((m) => !dismissed[m.id])
      .filter((m) => {
        const until = snoozed[m.id];
        return !until || until <= now;
      })
      .map((m) => ({
        ...m,
        read: !!read[m.id],
        dismissed: false,
        snoozedUntil: snoozed[m.id] && snoozed[m.id] > now ? snoozed[m.id] : null,
      }));
  }, [items, read, dismissed, snoozed, thresholds, enabledTypes, history, now]);
}

/**
 * Returns the raw derived messages without read/dismissed/snoozed filters.
 * Useful for the toast / pruning effect in App that needs to know which ids
 * are *currently* active in the underlying inventory state.
 */
export function useAllDerivedMessages() {
  const now = useNow();
  const items = useInventoryStore((s) => s.items);
  const thresholds = useMessagesSettingsStore((s) => s.thresholds);
  const enabledTypes = useMessagesSettingsStore((s) => s.enabledTypes);
  const history = useMessagesHistoryStore((s) => s.history);

  return useMemo(
    () =>
      deriveMessages(items, {
        thresholds,
        enabledTypes,
        history,
        now,
        rapidDecreaseWindowMs: RAPID_WINDOW_MS,
      }),
    [items, thresholds, enabledTypes, history, now]
  );
}

export function useUnreadCount(): number {
  const messages = useMessages();
  return messages.filter((m) => !m.read).length;
}

/**
 * Returns the percent drop for the given item against snapshots within the
 * rapid-decrease window. Used by the row body to fill in {{percent}}.
 */
export function useRapidDropPercent(itemId: string): number {
  const now = useNow();
  const snapshots = useMessagesHistoryStore((s) => s.history[itemId]);
  const items = useInventoryStore((s) => s.items);
  const item = items.find((it) => it.id === itemId);
  if (!item) return 0;
  return Math.round(computeRapidDropPercent(snapshots, item.quantity, now, RAPID_WINDOW_MS));
}

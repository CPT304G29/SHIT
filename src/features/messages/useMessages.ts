import { useMemo } from 'react';
import { useInventoryStore } from '@/features/inventory/inventory.store';
import { deriveMessages } from './messages.derive';
import { useMessagesStore } from './messages.store';
import { useMessagesSettingsStore } from './messages.settings.store';
import type { Message } from './messages.types';

export function useMessages(now: number = Date.now()): Message[] {
  const items = useInventoryStore((s) => s.items);
  const read = useMessagesStore((s) => s.read);
  const dismissed = useMessagesStore((s) => s.dismissed);
  const snoozed = useMessagesStore((s) => s.snoozed);
  const thresholds = useMessagesSettingsStore((s) => s.thresholds);
  const enabledTypes = useMessagesSettingsStore((s) => s.enabledTypes);

  return useMemo(() => {
    const derived = deriveMessages(items, { thresholds, enabledTypes });
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
  }, [items, read, dismissed, snoozed, thresholds, enabledTypes, now]);
}

export function useUnreadCount(): number {
  const messages = useMessages();
  return messages.filter((m) => !m.read).length;
}

import { useMemo } from 'react';
import { useInventoryStore } from '@/features/inventory/inventory.store';
import { deriveMessages } from './messages.derive';
import { useMessagesStore } from './messages.store';
import type { Message } from './messages.types';

export function useMessages(): Message[] {
  const items = useInventoryStore((s) => s.items);
  const read = useMessagesStore((s) => s.read);
  const dismissed = useMessagesStore((s) => s.dismissed);

  return useMemo(() => {
    const derived = deriveMessages(items);
    return derived
      .filter((m) => !dismissed[m.id])
      .map((m) => ({ ...m, read: !!read[m.id], dismissed: false }));
  }, [items, read, dismissed]);
}

export function useUnreadCount(): number {
  const messages = useMessages();
  return messages.filter((m) => !m.read).length;
}

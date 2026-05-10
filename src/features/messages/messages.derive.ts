import type { InventoryItem } from '@/features/inventory/inventory.types';
import {
  HIGH_VALUE_THRESHOLD,
  LOW_STOCK_THRESHOLD,
  type DerivedMessage,
} from './messages.types';

export function deriveMessages(items: InventoryItem[]): DerivedMessage[] {
  const out: DerivedMessage[] = [];

  for (const item of items) {
    const totalValue = item.unitPrice * item.quantity;
    const base = {
      itemId: item.id,
      itemNameKey: item.nameKey,
      quantity: item.quantity,
      totalValue,
      createdAt: item.updatedAt,
    };

    if (item.quantity === 0) {
      out.push({
        ...base,
        id: `outOfStock:${item.id}`,
        type: 'outOfStock',
        severity: 'critical',
      });
    } else if (item.quantity < LOW_STOCK_THRESHOLD) {
      out.push({
        ...base,
        id: `lowStock:${item.id}`,
        type: 'lowStock',
        severity: 'warning',
      });
    }

    if (totalValue >= HIGH_VALUE_THRESHOLD) {
      out.push({
        ...base,
        id: `highValue:${item.id}`,
        type: 'highValue',
        severity: 'info',
      });
    }
  }

  return out.sort((a, b) => severityRank(b.severity) - severityRank(a.severity) || b.createdAt - a.createdAt);
}

function severityRank(s: DerivedMessage['severity']): number {
  if (s === 'critical') return 2;
  if (s === 'warning') return 1;
  return 0;
}

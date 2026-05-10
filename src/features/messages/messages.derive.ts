import type { InventoryItem } from '@/features/inventory/inventory.types';
import type { DerivedMessage } from './messages.types';
import {
  DEFAULT_THRESHOLDS,
  type MessageThresholds,
} from './messages.settings.store';

export interface DeriveOptions {
  thresholds?: MessageThresholds;
  enabledTypes?: {
    outOfStock?: boolean;
    lowStock?: boolean;
    highValue?: boolean;
  };
}

export function deriveMessages(
  items: InventoryItem[],
  options: DeriveOptions = {}
): DerivedMessage[] {
  const thresholds = options.thresholds ?? DEFAULT_THRESHOLDS;
  const enabled = {
    outOfStock: options.enabledTypes?.outOfStock ?? true,
    lowStock: options.enabledTypes?.lowStock ?? true,
    highValue: options.enabledTypes?.highValue ?? true,
  };

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

    if (enabled.outOfStock && item.quantity === 0) {
      out.push({
        ...base,
        id: `outOfStock:${item.id}`,
        type: 'outOfStock',
        severity: 'critical',
      });
    } else if (enabled.lowStock && item.quantity > 0 && item.quantity < thresholds.lowStock) {
      out.push({
        ...base,
        id: `lowStock:${item.id}`,
        type: 'lowStock',
        severity: 'warning',
      });
    }

    if (enabled.highValue && totalValue >= thresholds.highValue) {
      out.push({
        ...base,
        id: `highValue:${item.id}`,
        type: 'highValue',
        severity: 'info',
      });
    }
  }

  return out.sort(
    (a, b) => severityRank(b.severity) - severityRank(a.severity) || b.createdAt - a.createdAt
  );
}

function severityRank(s: DerivedMessage['severity']): number {
  if (s === 'critical') return 2;
  if (s === 'warning') return 1;
  return 0;
}

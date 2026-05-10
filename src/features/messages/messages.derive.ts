import type { InventoryItem } from '@/features/inventory/inventory.types';
import type { DerivedMessage } from './messages.types';
import {
  DEFAULT_THRESHOLDS,
  type MessageThresholds,
} from './messages.settings.store';
import type { InventorySnapshot } from './messages.history.store';

export interface DeriveOptions {
  thresholds?: MessageThresholds;
  enabledTypes?: {
    outOfStock?: boolean;
    lowStock?: boolean;
    highValue?: boolean;
    rapidDecrease?: boolean;
  };
  history?: Record<string, InventorySnapshot[]>;
  now?: number;
  rapidDecreaseWindowMs?: number;
}

const DEFAULT_RAPID_WINDOW_MS = 24 * 60 * 60 * 1000;

export function deriveMessages(
  items: InventoryItem[],
  options: DeriveOptions = {}
): DerivedMessage[] {
  const thresholds = options.thresholds ?? DEFAULT_THRESHOLDS;
  const enabled = {
    outOfStock: options.enabledTypes?.outOfStock ?? true,
    lowStock: options.enabledTypes?.lowStock ?? true,
    highValue: options.enabledTypes?.highValue ?? true,
    rapidDecrease: options.enabledTypes?.rapidDecrease ?? true,
  };
  const history = options.history;
  const now = options.now ?? Date.now();
  const windowMs = options.rapidDecreaseWindowMs ?? DEFAULT_RAPID_WINDOW_MS;

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

    if (enabled.rapidDecrease && history && item.quantity > 0) {
      const dropPercent = computeRapidDropPercent(history[item.id], item.quantity, now, windowMs);
      if (dropPercent >= thresholds.rapidDecreasePercent) {
        out.push({
          ...base,
          id: `rapidDecrease:${item.id}`,
          type: 'rapidDecrease',
          severity: 'warning',
        });
      }
    }
  }

  return out.sort(
    (a, b) => severityRank(b.severity) - severityRank(a.severity) || b.createdAt - a.createdAt
  );
}

export function computeRapidDropPercent(
  snapshots: InventorySnapshot[] | undefined,
  currentQty: number,
  now: number,
  windowMs: number
): number {
  if (!snapshots || snapshots.length === 0) return 0;
  const cutoff = now - windowMs;
  // baseline = oldest snapshot within the comparison window; fall back to oldest overall
  const inWindow = snapshots.filter((s) => s.at >= cutoff);
  const baseline = (inWindow[0] ?? snapshots[0]).quantity;
  if (baseline <= 0) return 0;
  if (currentQty >= baseline) return 0;
  return ((baseline - currentQty) / baseline) * 100;
}

function severityRank(s: DerivedMessage['severity']): number {
  if (s === 'critical') return 2;
  if (s === 'warning') return 1;
  return 0;
}

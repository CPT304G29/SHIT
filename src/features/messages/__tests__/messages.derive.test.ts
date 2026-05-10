import { describe, it, expect } from 'vitest';
import { deriveMessages } from '../messages.derive';
import type { InventoryItem } from '@/features/inventory/inventory.types';

function makeItem(over: Partial<InventoryItem>): InventoryItem {
  return {
    id: 'x',
    nameKey: 'item.x',
    quantity: 50,
    categoryKey: 'category.shirt',
    unitPrice: 1000,
    createdAt: 0,
    updatedAt: 0,
    ...over,
  };
}

describe('deriveMessages', () => {
  it('emits outOfStock for quantity 0', () => {
    const msgs = deriveMessages([makeItem({ id: '1', quantity: 0 })]);
    expect(msgs).toHaveLength(1);
    expect(msgs[0]).toMatchObject({
      id: 'outOfStock:1',
      type: 'outOfStock',
      severity: 'critical',
      itemId: '1',
    });
  });

  it('emits lowStock for quantity below threshold', () => {
    const msgs = deriveMessages([makeItem({ id: '2', quantity: 5 })]);
    expect(msgs).toHaveLength(1);
    expect(msgs[0]).toMatchObject({ type: 'lowStock', severity: 'warning' });
  });

  it('does not emit lowStock at exactly threshold', () => {
    const msgs = deriveMessages([makeItem({ id: '3', quantity: 10 })]);
    expect(msgs.filter((m) => m.type === 'lowStock')).toHaveLength(0);
  });

  it('emits highValue when total value crosses threshold', () => {
    const msgs = deriveMessages([
      makeItem({ id: '4', quantity: 100, unitPrice: 20_000 }), // 2,000,000
    ]);
    expect(msgs.some((m) => m.type === 'highValue' && m.severity === 'info')).toBe(true);
  });

  it('emits both outOfStock and highValue when value condition still applies — but quantity 0 means value 0, so highValue does not fire', () => {
    const msgs = deriveMessages([makeItem({ id: '5', quantity: 0, unitPrice: 99_999 })]);
    expect(msgs).toHaveLength(1);
    expect(msgs[0].type).toBe('outOfStock');
  });

  it('emits both lowStock and highValue when both apply', () => {
    const msgs = deriveMessages([makeItem({ id: '6', quantity: 5, unitPrice: 250_000 })]);
    expect(msgs.map((m) => m.type).sort()).toEqual(['highValue', 'lowStock']);
  });

  it('returns nothing for healthy items', () => {
    const msgs = deriveMessages([makeItem({ id: '7', quantity: 50, unitPrice: 1000 })]);
    expect(msgs).toHaveLength(0);
  });

  it('sorts critical before warning before info', () => {
    const msgs = deriveMessages([
      makeItem({ id: 'a', quantity: 5, unitPrice: 1000 }),
      makeItem({ id: 'b', quantity: 0, unitPrice: 1000 }),
      makeItem({ id: 'c', quantity: 100, unitPrice: 20_000 }),
    ]);
    expect(msgs.map((m) => m.severity)).toEqual(['critical', 'warning', 'info']);
  });

  it('produces stable ids per type+item so re-deriving is idempotent', () => {
    const items = [makeItem({ id: '8', quantity: 0 })];
    const a = deriveMessages(items);
    const b = deriveMessages(items);
    expect(a.map((m) => m.id)).toEqual(b.map((m) => m.id));
  });

  it('honors a custom lowStock threshold', () => {
    const items = [makeItem({ id: '9', quantity: 25 })];
    const def = deriveMessages(items);
    expect(def).toHaveLength(0);

    const tighter = deriveMessages(items, {
      thresholds: { lowStock: 50, highValue: 1_000_000, rapidDecreasePercent: 30 },
    });
    expect(tighter[0]?.type).toBe('lowStock');
  });

  it('honors a custom highValue threshold', () => {
    const items = [makeItem({ id: '10', quantity: 50, unitPrice: 1000 })]; // 50,000
    const def = deriveMessages(items);
    expect(def.filter((m) => m.type === 'highValue')).toHaveLength(0);

    const lowered = deriveMessages(items, {
      thresholds: { lowStock: 10, highValue: 10_000, rapidDecreasePercent: 30 },
    });
    expect(lowered.some((m) => m.type === 'highValue')).toBe(true);
  });

  it('respects enabledTypes flag to suppress a category', () => {
    const items = [makeItem({ id: '11', quantity: 0 })];
    const muted = deriveMessages(items, { enabledTypes: { outOfStock: false } });
    expect(muted).toHaveLength(0);
  });
});

import { describe, it, expect } from 'vitest';
import { computeRapidDropPercent, deriveMessages } from '../messages.derive';
import type { InventoryItem } from '@/features/inventory/inventory.types';

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

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

describe('computeRapidDropPercent', () => {
  it('returns 0 with no snapshots', () => {
    expect(computeRapidDropPercent(undefined, 50, 0, DAY)).toBe(0);
    expect(computeRapidDropPercent([], 50, 0, DAY)).toBe(0);
  });

  it('returns 0 when current >= baseline', () => {
    const snaps = [{ quantity: 50, at: 0 }];
    expect(computeRapidDropPercent(snaps, 50, 0, DAY)).toBe(0);
    expect(computeRapidDropPercent(snaps, 100, 0, DAY)).toBe(0);
  });

  it('computes percent drop from oldest in-window snapshot', () => {
    const now = 100 * HOUR;
    const snaps = [
      { quantity: 100, at: now - 10 * HOUR }, // baseline
      { quantity: 80, at: now - 5 * HOUR },
    ];
    expect(computeRapidDropPercent(snaps, 50, now, DAY)).toBeCloseTo(50);
  });

  it('falls back to oldest overall when nothing is in-window', () => {
    const now = 100 * HOUR;
    const snaps = [
      { quantity: 200, at: now - 5 * DAY }, // outside 1-day window
    ];
    expect(computeRapidDropPercent(snaps, 100, now, DAY)).toBeCloseTo(50);
  });
});

describe('deriveMessages with rapidDecrease', () => {
  it('emits rapidDecrease when drop exceeds threshold', () => {
    const now = 10 * DAY;
    const items = [makeItem({ id: 'r1', quantity: 30 })];
    const history = {
      r1: [{ quantity: 100, at: now - 6 * HOUR }],
    };
    const msgs = deriveMessages(items, {
      thresholds: { lowStock: 10, highValue: 1_000_000, rapidDecreasePercent: 30 },
      history,
      now,
    });
    expect(msgs.some((m) => m.type === 'rapidDecrease')).toBe(true);
  });

  it('does not emit rapidDecrease when drop is below threshold', () => {
    const now = 10 * DAY;
    const items = [makeItem({ id: 'r2', quantity: 90 })];
    const history = {
      r2: [{ quantity: 100, at: now - 6 * HOUR }],
    };
    const msgs = deriveMessages(items, {
      thresholds: { lowStock: 10, highValue: 1_000_000, rapidDecreasePercent: 30 },
      history,
      now,
    });
    expect(msgs.filter((m) => m.type === 'rapidDecrease')).toHaveLength(0);
  });

  it('respects enabledTypes.rapidDecrease=false', () => {
    const now = 10 * DAY;
    const items = [makeItem({ id: 'r3', quantity: 10 })];
    const history = { r3: [{ quantity: 100, at: now - HOUR }] };
    const msgs = deriveMessages(items, {
      history,
      now,
      enabledTypes: { rapidDecrease: false },
    });
    expect(msgs.some((m) => m.type === 'rapidDecrease')).toBe(false);
  });

  it('skips rapidDecrease when current quantity is 0 (outOfStock takes over)', () => {
    const now = 10 * DAY;
    const items = [makeItem({ id: 'r4', quantity: 0 })];
    const history = { r4: [{ quantity: 100, at: now - HOUR }] };
    const msgs = deriveMessages(items, { history, now });
    expect(msgs.map((m) => m.type)).toEqual(['outOfStock']);
  });
});

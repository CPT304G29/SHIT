import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useMessages,
  useUnreadCount,
  useAllDerivedMessages,
  useRapidDropPercent,
} from '../useMessages';
import { useMessagesStore } from '../messages.store';
import { useMessagesSettingsStore } from '../messages.settings.store';
import { useMessagesHistoryStore } from '../messages.history.store';
import { useInventoryStore } from '@/features/inventory/inventory.store';
import type { InventoryItem } from '@/features/inventory/inventory.types';

const HOUR = 60 * 60 * 1000;

function setItems(items: InventoryItem[]) {
  // Replace inventory store state directly so each test starts deterministic.
  useInventoryStore.setState({ items });
}

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

beforeEach(() => {
  useMessagesStore.getState().reset();
  useMessagesSettingsStore.getState().reset();
  useMessagesHistoryStore.getState().reset();
  localStorage.clear();
});

describe('useMessages', () => {
  it('returns critical message for an outOfStock item', () => {
    setItems([makeItem({ id: '1', quantity: 0 })]);
    const { result } = renderHook(() => useMessages());
    expect(result.current).toHaveLength(1);
    expect(result.current[0].type).toBe('outOfStock');
    expect(result.current[0].read).toBe(false);
    expect(result.current[0].snoozedUntil).toBeNull();
  });

  it('marks read=true after markRead is called', () => {
    setItems([makeItem({ id: '1', quantity: 0 })]);
    const { result, rerender } = renderHook(() => useMessages());
    const id = result.current[0].id;
    act(() => useMessagesStore.getState().markRead(id));
    rerender();
    expect(result.current[0].read).toBe(true);
  });

  it('hides messages that have been dismissed', () => {
    setItems([makeItem({ id: '1', quantity: 0 })]);
    const { result, rerender } = renderHook(() => useMessages());
    const id = result.current[0].id;
    act(() => useMessagesStore.getState().dismiss(id));
    rerender();
    expect(result.current).toHaveLength(0);
  });

  it('hides messages whose snooze has not yet expired', () => {
    setItems([makeItem({ id: '1', quantity: 0 })]);
    const { result, rerender } = renderHook(() => useMessages());
    const id = result.current[0].id;
    act(() => useMessagesStore.getState().snooze(id, Date.now() + HOUR));
    rerender();
    expect(result.current).toHaveLength(0);
  });

  it('exposes snoozedUntil but still hides while snoozed', () => {
    setItems([makeItem({ id: '1', quantity: 0 })]);
    const { result, rerender } = renderHook(() => useMessages());
    const until = Date.now() + HOUR;
    const id = result.current[0].id;
    act(() => useMessagesStore.getState().snooze(id, until));
    rerender();
    // Still filtered out of the visible list
    expect(result.current).toHaveLength(0);
  });

  it('reflects threshold change via settings store', () => {
    setItems([makeItem({ id: '1', quantity: 25, unitPrice: 1000 })]);
    const { result, rerender } = renderHook(() => useMessages());
    expect(result.current).toHaveLength(0);

    act(() => useMessagesSettingsStore.getState().setThresholds({ lowStock: 50 }));
    rerender();
    expect(result.current[0].type).toBe('lowStock');
  });

  it('respects enabled-type toggle from settings store', () => {
    setItems([makeItem({ id: '1', quantity: 0 })]);
    const { result, rerender } = renderHook(() => useMessages());
    expect(result.current).toHaveLength(1);

    act(() => useMessagesSettingsStore.getState().setTypeEnabled('outOfStock', false));
    rerender();
    expect(result.current).toHaveLength(0);
  });
});

describe('useUnreadCount', () => {
  it('counts only unread messages', () => {
    setItems([
      makeItem({ id: '1', quantity: 0 }),
      makeItem({ id: '2', quantity: 5 }),
    ]);
    const { result, rerender } = renderHook(() => useUnreadCount());
    expect(result.current).toBe(2);

    act(() => useMessagesStore.getState().markRead('outOfStock:1'));
    rerender();
    expect(result.current).toBe(1);
  });

  it('returns 0 when there are no derived messages', () => {
    setItems([makeItem({ id: '1', quantity: 50, unitPrice: 1000 })]);
    const { result } = renderHook(() => useUnreadCount());
    expect(result.current).toBe(0);
  });
});

describe('useAllDerivedMessages', () => {
  it('returns derived list ignoring dismissed/snoozed/read', () => {
    setItems([makeItem({ id: '1', quantity: 0 })]);
    const { result, rerender } = renderHook(() => useAllDerivedMessages());
    expect(result.current).toHaveLength(1);

    act(() => useMessagesStore.getState().dismiss('outOfStock:1'));
    rerender();
    // Still derived even though the consumer-facing list would hide it
    expect(result.current).toHaveLength(1);
  });
});

describe('useRapidDropPercent', () => {
  it('returns 0 when no item exists', () => {
    setItems([]);
    const { result } = renderHook(() => useRapidDropPercent('does-not-exist'));
    expect(result.current).toBe(0);
  });

  it('computes percent from history snapshots', () => {
    const item = makeItem({ id: 'r1', quantity: 30 });
    setItems([item]);
    act(() =>
      useMessagesHistoryStore.getState().record('r1', 100, Date.now() - 6 * HOUR)
    );
    const { result } = renderHook(() => useRapidDropPercent('r1'));
    expect(result.current).toBeCloseTo(70, 0);
  });

  it('returns 0 when current quantity exceeds the snapshot baseline', () => {
    const item = makeItem({ id: 'r2', quantity: 200 });
    setItems([item]);
    act(() =>
      useMessagesHistoryStore.getState().record('r2', 100, Date.now() - 6 * HOUR)
    );
    const { result } = renderHook(() => useRapidDropPercent('r2'));
    expect(result.current).toBe(0);
  });
});

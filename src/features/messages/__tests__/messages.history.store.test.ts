import { describe, it, expect, beforeEach } from 'vitest';
import { useMessagesHistoryStore } from '../messages.history.store';

beforeEach(() => {
  useMessagesHistoryStore.getState().reset();
  localStorage.removeItem('shit-messages-history');
});

describe('messages.history.store', () => {
  it('record appends a snapshot for a new item', () => {
    useMessagesHistoryStore.getState().record('a', 50, 1000);
    expect(useMessagesHistoryStore.getState().history.a).toEqual([{ quantity: 50, at: 1000 }]);
  });

  it('record skips when quantity is unchanged from last snapshot', () => {
    const r = useMessagesHistoryStore.getState().record;
    r('a', 50, 1000);
    r('a', 50, 2000); // same quantity, should be skipped
    expect(useMessagesHistoryStore.getState().history.a).toEqual([{ quantity: 50, at: 1000 }]);
  });

  it('record appends when quantity changes', () => {
    const r = useMessagesHistoryStore.getState().record;
    r('a', 50, 1000);
    r('a', 40, 2000);
    r('a', 30, 3000);
    expect(useMessagesHistoryStore.getState().history.a).toEqual([
      { quantity: 50, at: 1000 },
      { quantity: 40, at: 2000 },
      { quantity: 30, at: 3000 },
    ]);
  });

  it('caps each item at 8 snapshots, dropping the oldest', () => {
    const r = useMessagesHistoryStore.getState().record;
    for (let i = 0; i < 12; i++) {
      r('a', 100 - i, i * 1000);
    }
    const snaps = useMessagesHistoryStore.getState().history.a;
    expect(snaps).toHaveLength(8);
    // Oldest kept should be the 4th recorded (i=4)
    expect(snaps[0].quantity).toBe(100 - 4);
    expect(snaps[snaps.length - 1].quantity).toBe(100 - 11);
  });

  it('record uses Date.now() when at is omitted', () => {
    const before = Date.now();
    useMessagesHistoryStore.getState().record('a', 5);
    const snap = useMessagesHistoryStore.getState().history.a[0];
    expect(snap.quantity).toBe(5);
    expect(snap.at).toBeGreaterThanOrEqual(before);
  });

  it('prune drops snapshots older than the retention window', () => {
    const now = 100_000;
    const r = useMessagesHistoryStore.getState().record;
    r('a', 100, now - 10_000); // recent
    r('a', 90, now - 5_000); // recent
    r('b', 50, now - 50_000); // outside 30s window

    useMessagesHistoryStore.getState().prune(30_000, now);
    const h = useMessagesHistoryStore.getState().history;
    expect(h.a).toHaveLength(2);
    expect(h.b).toBeUndefined();
  });

  it('prune drops items entirely when nothing within window', () => {
    const now = 100_000;
    useMessagesHistoryStore.getState().record('a', 50, now - 10_000_000);
    useMessagesHistoryStore.getState().prune(60_000, now);
    expect(useMessagesHistoryStore.getState().history.a).toBeUndefined();
  });

  it('prune uses Date.now() when no `now` arg given', () => {
    useMessagesHistoryStore.getState().record('a', 50, Date.now() - 1000);
    useMessagesHistoryStore.getState().prune(10_000_000); // generous window — should keep
    expect(useMessagesHistoryStore.getState().history.a).toHaveLength(1);

    useMessagesHistoryStore.getState().prune(0); // tight window — should drop
    expect(useMessagesHistoryStore.getState().history.a).toBeUndefined();
  });

  it('reset clears every entry', () => {
    useMessagesHistoryStore.getState().record('a', 50);
    useMessagesHistoryStore.getState().record('b', 30);
    useMessagesHistoryStore.getState().reset();
    expect(useMessagesHistoryStore.getState().history).toEqual({});
  });
});

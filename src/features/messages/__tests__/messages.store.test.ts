import { describe, it, expect, beforeEach } from 'vitest';
import { useMessagesStore } from '../messages.store';

beforeEach(() => {
  useMessagesStore.getState().reset();
  // Clear persisted state to keep tests independent
  localStorage.removeItem('shit-messages');
});

describe('messages.store', () => {
  describe('read', () => {
    it('markRead sets a single id', () => {
      useMessagesStore.getState().markRead('a');
      expect(useMessagesStore.getState().read).toEqual({ a: true });
    });

    it('markUnread removes a single id without touching siblings', () => {
      useMessagesStore.getState().markRead('a');
      useMessagesStore.getState().markRead('b');
      useMessagesStore.getState().markUnread('a');
      expect(useMessagesStore.getState().read).toEqual({ b: true });
    });

    it('markUnread on an unknown id is a no-op', () => {
      useMessagesStore.getState().markRead('a');
      useMessagesStore.getState().markUnread('does-not-exist');
      expect(useMessagesStore.getState().read).toEqual({ a: true });
    });

    it('markAllRead sets every id at once', () => {
      useMessagesStore.getState().markAllRead(['a', 'b', 'c']);
      expect(useMessagesStore.getState().read).toEqual({ a: true, b: true, c: true });
    });

    it('markAllRead on an empty array does nothing', () => {
      useMessagesStore.getState().markAllRead([]);
      expect(useMessagesStore.getState().read).toEqual({});
    });
  });

  describe('dismissed', () => {
    it('dismiss sets a single id', () => {
      useMessagesStore.getState().dismiss('m1');
      expect(useMessagesStore.getState().dismissed).toEqual({ m1: true });
    });

    it('dismissMany sets every id', () => {
      useMessagesStore.getState().dismissMany(['m1', 'm2']);
      expect(useMessagesStore.getState().dismissed).toEqual({ m1: true, m2: true });
    });

    it('pruneDismissed keeps only ids that are still active', () => {
      useMessagesStore.getState().dismissMany(['gone', 'still-here']);
      useMessagesStore.getState().pruneDismissed(['still-here', 'never-dismissed']);
      expect(useMessagesStore.getState().dismissed).toEqual({ 'still-here': true });
    });

    it('pruneDismissed clears everything when activeIds is empty', () => {
      useMessagesStore.getState().dismissMany(['a', 'b']);
      useMessagesStore.getState().pruneDismissed([]);
      expect(useMessagesStore.getState().dismissed).toEqual({});
    });
  });

  describe('snoozed', () => {
    it('snooze sets the until-timestamp', () => {
      useMessagesStore.getState().snooze('m1', 12345);
      expect(useMessagesStore.getState().snoozed).toEqual({ m1: 12345 });
    });

    it('snoozeMany sets the same until for many ids', () => {
      useMessagesStore.getState().snoozeMany(['a', 'b'], 999);
      expect(useMessagesStore.getState().snoozed).toEqual({ a: 999, b: 999 });
    });

    it('snooze can overwrite an existing entry', () => {
      useMessagesStore.getState().snooze('m1', 100);
      useMessagesStore.getState().snooze('m1', 500);
      expect(useMessagesStore.getState().snoozed.m1).toBe(500);
    });

    it('unsnooze removes a single id', () => {
      useMessagesStore.getState().snooze('a', 100);
      useMessagesStore.getState().snooze('b', 200);
      useMessagesStore.getState().unsnooze('a');
      expect(useMessagesStore.getState().snoozed).toEqual({ b: 200 });
    });

    it('unsnooze on an unknown id is a no-op', () => {
      useMessagesStore.getState().snooze('a', 100);
      useMessagesStore.getState().unsnooze('zzz');
      expect(useMessagesStore.getState().snoozed).toEqual({ a: 100 });
    });
  });

  describe('reset', () => {
    it('clears every map', () => {
      const s = useMessagesStore.getState();
      s.markRead('a');
      s.dismiss('b');
      s.snooze('c', 100);
      s.reset();
      const after = useMessagesStore.getState();
      expect(after.read).toEqual({});
      expect(after.dismissed).toEqual({});
      expect(after.snoozed).toEqual({});
    });
  });
});

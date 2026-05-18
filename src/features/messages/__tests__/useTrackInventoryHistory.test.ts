import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTrackInventoryHistory } from '../useTrackInventoryHistory';
import { useInventoryStore } from '@/features/inventory/inventory.store';
import { useMessagesHistoryStore } from '../messages.history.store';

describe('useTrackInventoryHistory', () => {
  beforeEach(() => {
    useMessagesHistoryStore.getState().reset();
    useInventoryStore.setState({
      items: [
        {
          id: '1',
          nameKey: 'item.test',
          quantity: 10,
          categoryKey: 'category.test',
          unitPrice: 1000,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
    });
  });

  it('records initial inventory snapshot on mount', () => {
    const recordSpy = vi.spyOn(useMessagesHistoryStore.getState(), 'record');

    renderHook(() => useTrackInventoryHistory());

    expect(recordSpy).toHaveBeenCalledWith('1', 10);
    recordSpy.mockRestore();
  });

  it('prunes old history on mount', () => {
    const pruneSpy = vi.spyOn(useMessagesHistoryStore.getState(), 'prune');

    renderHook(() => useTrackInventoryHistory());

    expect(pruneSpy).toHaveBeenCalled();
    pruneSpy.mockRestore();
  });

  it('subscribes to inventory changes', () => {
    const subscribeSpy = vi.spyOn(useInventoryStore, 'subscribe');

    renderHook(() => useTrackInventoryHistory());

    expect(subscribeSpy).toHaveBeenCalled();
    subscribeSpy.mockRestore();
  });

  it('unsubscribes on unmount', () => {
    const unsubscribe = vi.fn();
    vi.spyOn(useInventoryStore, 'subscribe').mockReturnValue(unsubscribe);

    const { unmount } = renderHook(() => useTrackInventoryHistory());

    expect(unsubscribe).not.toHaveBeenCalled();
    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });
});

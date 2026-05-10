import { describe, it, expect, beforeEach } from 'vitest';
import {
  useMessagesSettingsStore,
  DEFAULT_THRESHOLDS,
} from '../messages.settings.store';

beforeEach(() => {
  useMessagesSettingsStore.getState().reset();
  localStorage.removeItem('shit-messages-settings');
});

describe('messages.settings.store', () => {
  it('starts with default thresholds', () => {
    expect(useMessagesSettingsStore.getState().thresholds).toEqual(DEFAULT_THRESHOLDS);
  });

  it('starts with every type enabled', () => {
    expect(useMessagesSettingsStore.getState().enabledTypes).toEqual({
      outOfStock: true,
      lowStock: true,
      highValue: true,
      rapidDecrease: true,
    });
  });

  it('setThresholds patches without losing other keys', () => {
    useMessagesSettingsStore.getState().setThresholds({ lowStock: 25 });
    const t = useMessagesSettingsStore.getState().thresholds;
    expect(t.lowStock).toBe(25);
    expect(t.highValue).toBe(DEFAULT_THRESHOLDS.highValue);
    expect(t.rapidDecreasePercent).toBe(DEFAULT_THRESHOLDS.rapidDecreasePercent);
  });

  it('setThresholds can update multiple keys at once', () => {
    useMessagesSettingsStore.getState().setThresholds({
      lowStock: 5,
      highValue: 9_999,
      rapidDecreasePercent: 15,
    });
    expect(useMessagesSettingsStore.getState().thresholds).toEqual({
      lowStock: 5,
      highValue: 9_999,
      rapidDecreasePercent: 15,
    });
  });

  it('setTypeEnabled flips a single flag', () => {
    useMessagesSettingsStore.getState().setTypeEnabled('outOfStock', false);
    const t = useMessagesSettingsStore.getState().enabledTypes;
    expect(t.outOfStock).toBe(false);
    expect(t.lowStock).toBe(true);
    expect(t.highValue).toBe(true);
    expect(t.rapidDecrease).toBe(true);
  });

  it('setTypeEnabled can re-enable after disabling', () => {
    const s = useMessagesSettingsStore.getState();
    s.setTypeEnabled('rapidDecrease', false);
    s.setTypeEnabled('rapidDecrease', true);
    expect(useMessagesSettingsStore.getState().enabledTypes.rapidDecrease).toBe(true);
  });

  it('reset restores both thresholds and enabled types to defaults', () => {
    const s = useMessagesSettingsStore.getState();
    s.setThresholds({ lowStock: 99 });
    s.setTypeEnabled('lowStock', false);
    s.reset();
    const after = useMessagesSettingsStore.getState();
    expect(after.thresholds).toEqual(DEFAULT_THRESHOLDS);
    expect(after.enabledTypes.lowStock).toBe(true);
  });
});

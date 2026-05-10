import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MessageThresholds {
  lowStock: number;
  highValue: number; // cents
  rapidDecreasePercent: number; // 0-100
}

export const DEFAULT_THRESHOLDS: MessageThresholds = {
  lowStock: 10,
  highValue: 1_000_000,
  rapidDecreasePercent: 30,
};

interface SettingsState {
  thresholds: MessageThresholds;
  enabledTypes: {
    outOfStock: boolean;
    lowStock: boolean;
    highValue: boolean;
    rapidDecrease: boolean;
  };
  setThresholds: (t: Partial<MessageThresholds>) => void;
  setTypeEnabled: (type: keyof SettingsState['enabledTypes'], enabled: boolean) => void;
  reset: () => void;
}

const DEFAULT_ENABLED = {
  outOfStock: true,
  lowStock: true,
  highValue: true,
  rapidDecrease: true,
};

export const useMessagesSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      thresholds: DEFAULT_THRESHOLDS,
      enabledTypes: DEFAULT_ENABLED,
      setThresholds: (t) =>
        set((s) => ({ thresholds: { ...s.thresholds, ...t } })),
      setTypeEnabled: (type, enabled) =>
        set((s) => ({ enabledTypes: { ...s.enabledTypes, [type]: enabled } })),
      reset: () => set({ thresholds: DEFAULT_THRESHOLDS, enabledTypes: DEFAULT_ENABLED }),
    }),
    { name: 'shit-messages-settings' }
  )
);

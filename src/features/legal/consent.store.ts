import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ConsentStatus = 'undecided' | 'accepted' | 'rejected';

interface ConsentState {
  status: ConsentStatus;
  decidedAt: number | null;
  accept: () => void;
  reject: () => void;
  reset: () => void;
}

/**
 * The list of localStorage keys this app writes outside of consent itself.
 * Used by the reject path to wipe the user's data and by the Privacy Policy
 * page to enumerate exactly what's stored. Keep this in sync as new persisted
 * stores are introduced — failing to list a key here is a privacy bug.
 */
export const APP_STORAGE_KEYS = [
  'shit-inventory',
  'shit-messages',
  'shit-messages-settings',
  'shit-messages-history',
  'shit-theme-preference',
  'shit-language',
  'i18nextLng',
] as const;

export const CONSENT_STORAGE_KEY = 'shit-cookie-consent';

function clearAppStorage(): void {
  if (typeof window === 'undefined') return;
  for (const key of APP_STORAGE_KEYS) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Storage access may be blocked (private mode, quota, etc.) — ignore.
    }
  }
}

export const useConsentStore = create<ConsentState>()(
  persist(
    (set) => ({
      status: 'undecided',
      decidedAt: null,
      accept: () => set({ status: 'accepted', decidedAt: Date.now() }),
      reject: () => {
        clearAppStorage();
        set({ status: 'rejected', decidedAt: Date.now() });
      },
      reset: () => set({ status: 'undecided', decidedAt: null }),
    }),
    { name: CONSENT_STORAGE_KEY }
  )
);

/**
 * Run once on app boot. If the user previously rejected, clear the data
 * other stores may have re-persisted in the meantime so the rejection is
 * meaningful across reloads.
 */
export function enforceConsentOnBoot(): void {
  const { status } = useConsentStore.getState();
  if (status === 'rejected') {
    clearAppStorage();
  }
}

export const _testing = { clearAppStorage };

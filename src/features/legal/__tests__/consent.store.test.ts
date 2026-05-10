import { describe, it, expect, beforeEach } from 'vitest';
import {
  useConsentStore,
  APP_STORAGE_KEYS,
  CONSENT_STORAGE_KEY,
  enforceConsentOnBoot,
} from '../consent.store';

beforeEach(() => {
  useConsentStore.getState().reset();
  for (const key of APP_STORAGE_KEYS) localStorage.removeItem(key);
  localStorage.removeItem(CONSENT_STORAGE_KEY);
});

describe('consent.store', () => {
  it('starts undecided with no decidedAt', () => {
    expect(useConsentStore.getState().status).toBe('undecided');
    expect(useConsentStore.getState().decidedAt).toBeNull();
  });

  it('accept flips status and stamps decidedAt', () => {
    const before = Date.now();
    useConsentStore.getState().accept();
    const s = useConsentStore.getState();
    expect(s.status).toBe('accepted');
    expect(s.decidedAt).toBeGreaterThanOrEqual(before);
  });

  it('reject flips status, stamps decidedAt, and wipes app storage', () => {
    for (const key of APP_STORAGE_KEYS) localStorage.setItem(key, 'whatever');
    useConsentStore.getState().reject();
    const s = useConsentStore.getState();
    expect(s.status).toBe('rejected');
    expect(s.decidedAt).not.toBeNull();
    for (const key of APP_STORAGE_KEYS) {
      expect(localStorage.getItem(key)).toBeNull();
    }
  });

  it('reject does not delete the consent record itself', () => {
    useConsentStore.getState().reject();
    // The consent value is held by zustand persist, so the key should still exist
    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).not.toBeNull();
  });

  it('reset returns to undecided', () => {
    useConsentStore.getState().accept();
    useConsentStore.getState().reset();
    expect(useConsentStore.getState().status).toBe('undecided');
    expect(useConsentStore.getState().decidedAt).toBeNull();
  });

  it('enforceConsentOnBoot clears app storage when status is rejected', () => {
    useConsentStore.setState({ status: 'rejected', decidedAt: 1 });
    for (const key of APP_STORAGE_KEYS) localStorage.setItem(key, 'leaked');
    enforceConsentOnBoot();
    for (const key of APP_STORAGE_KEYS) {
      expect(localStorage.getItem(key)).toBeNull();
    }
  });

  it('enforceConsentOnBoot is a no-op when accepted', () => {
    useConsentStore.setState({ status: 'accepted', decidedAt: 1 });
    localStorage.setItem('shit-inventory', 'kept');
    enforceConsentOnBoot();
    expect(localStorage.getItem('shit-inventory')).toBe('kept');
  });

  it('enforceConsentOnBoot is a no-op when undecided', () => {
    localStorage.setItem('shit-inventory', 'kept');
    enforceConsentOnBoot();
    expect(localStorage.getItem('shit-inventory')).toBe('kept');
  });
});

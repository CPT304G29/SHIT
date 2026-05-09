import { useSyncExternalStore } from 'react';

function getTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

export function useCurrentTheme() {
  return useSyncExternalStore(subscribe, getTheme, () => 'light');
}

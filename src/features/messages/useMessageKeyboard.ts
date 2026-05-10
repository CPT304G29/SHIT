import { useEffect } from 'react';

interface UseMessageKeyboardArgs {
  count: number;
  cursor: number;
  setCursor: (updater: number | ((prev: number) => number)) => void;
  onToggleRead: (index: number) => void;
  onDismiss: (index: number) => void;
  onSnooze: (index: number) => void;
  onOpen: (index: number) => void;
  onShowHelp: () => void;
  onFocusSearch?: () => void;
  /** Called on any recognised keypress so the consumer can flip a "keyboard active" flag */
  onActivate?: () => void;
  enabled: boolean;
}

const TYPING_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (TYPING_TAGS.has(target.tagName)) return true;
  if (target.isContentEditable) return true;
  return false;
}

const RECOGNISED_KEYS = new Set([
  'j',
  'k',
  'e',
  'x',
  's',
  'Enter',
  '?',
  '/',
  'ArrowDown',
  'ArrowUp',
]);

export function useMessageKeyboard({
  count,
  cursor,
  setCursor,
  onToggleRead,
  onDismiss,
  onSnooze,
  onOpen,
  onShowHelp,
  onFocusSearch,
  onActivate,
  enabled,
}: UseMessageKeyboardArgs) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (!RECOGNISED_KEYS.has(e.key)) return;
      if (count === 0 && !['?', '/'].includes(e.key)) return;

      onActivate?.();

      const clamp = (n: number) => Math.max(0, Math.min(n, count - 1));
      // The component initialises cursor at -1 to indicate "no visible focus".
      // Once any movement key fires, treat -1 as "just started, land on 0".
      const activeIndex = clamp(cursor < 0 ? 0 : cursor);

      switch (e.key) {
        case 'j':
        case 'ArrowDown':
          e.preventDefault();
          setCursor((prev) => clamp((prev < 0 ? -1 : prev) + 1));
          break;
        case 'k':
        case 'ArrowUp':
          e.preventDefault();
          setCursor((prev) => clamp((prev < 0 ? 1 : prev) - 1));
          break;
        case 'e':
          e.preventDefault();
          onToggleRead(activeIndex);
          break;
        case 'x':
          e.preventDefault();
          onDismiss(activeIndex);
          break;
        case 's':
          e.preventDefault();
          onSnooze(activeIndex);
          break;
        case 'Enter':
          e.preventDefault();
          onOpen(activeIndex);
          break;
        case '?':
          e.preventDefault();
          onShowHelp();
          break;
        case '/':
          if (onFocusSearch) {
            e.preventDefault();
            onFocusSearch();
          }
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [
    count,
    cursor,
    setCursor,
    onToggleRead,
    onDismiss,
    onSnooze,
    onOpen,
    onShowHelp,
    onFocusSearch,
    onActivate,
    enabled,
  ]);
}

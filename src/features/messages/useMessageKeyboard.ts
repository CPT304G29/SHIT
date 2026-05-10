import { useEffect } from 'react';

interface UseMessageKeyboardArgs {
  count: number;
  cursor: number;
  setCursor: (next: number) => void;
  onToggleRead: (index: number) => void;
  onDismiss: (index: number) => void;
  onSnooze: (index: number) => void;
  onOpen: (index: number) => void;
  onShowHelp: () => void;
  onFocusSearch?: () => void;
  enabled: boolean;
}

const TYPING_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (TYPING_TAGS.has(target.tagName)) return true;
  if (target.isContentEditable) return true;
  return false;
}

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
  enabled,
}: UseMessageKeyboardArgs) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (count === 0 && !['?', '/'].includes(e.key)) return;

      const safeIndex = Math.max(0, Math.min(cursor, count - 1));

      switch (e.key) {
        case 'j':
        case 'ArrowDown':
          e.preventDefault();
          setCursor(Math.min(safeIndex + 1, count - 1));
          break;
        case 'k':
        case 'ArrowUp':
          e.preventDefault();
          setCursor(Math.max(safeIndex - 1, 0));
          break;
        case 'e':
          e.preventDefault();
          onToggleRead(safeIndex);
          break;
        case 'x':
          e.preventDefault();
          onDismiss(safeIndex);
          break;
        case 's':
          e.preventDefault();
          onSnooze(safeIndex);
          break;
        case 'Enter':
          e.preventDefault();
          onOpen(safeIndex);
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
  }, [count, cursor, setCursor, onToggleRead, onDismiss, onSnooze, onOpen, onShowHelp, onFocusSearch, enabled]);
}

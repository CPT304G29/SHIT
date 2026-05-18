import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMessageKeyboard } from '../useMessageKeyboard';

describe('useMessageKeyboard', () => {
  const defaultProps = {
    count: 5,
    cursor: 0,
    setCursor: vi.fn(),
    onToggleRead: vi.fn(),
    onDismiss: vi.fn(),
    onSnooze: vi.fn(),
    onOpen: vi.fn(),
    onShowHelp: vi.fn(),
    onFocusSearch: vi.fn(),
    onActivate: vi.fn(),
    enabled: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not register listener when enabled is false', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    renderHook(() => useMessageKeyboard({ ...defaultProps, enabled: false }));

    expect(addSpy).not.toHaveBeenCalledWith('keydown', expect.any(Function));
    addSpy.mockRestore();
  });

  it('registers keydown listener when enabled is true', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    renderHook(() => useMessageKeyboard({ ...defaultProps, enabled: true }));

    expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    addSpy.mockRestore();
  });

  it('calls onShowHelp when ? is pressed', () => {
    renderHook(() => useMessageKeyboard({ ...defaultProps }));

    fireEvent('keydown', { key: '?' });
    expect(defaultProps.onShowHelp).toHaveBeenCalled();
  });

  it('calls onFocusSearch when / is pressed', () => {
    renderHook(() => useMessageKeyboard({ ...defaultProps }));

    fireEvent('keydown', { key: '/' });
    expect(defaultProps.onFocusSearch).toHaveBeenCalled();
  });

  it('calls setCursor when j or ArrowDown is pressed', () => {
    renderHook(() => useMessageKeyboard({ ...defaultProps, cursor: 0 }));

    fireEvent('keydown', { key: 'j' });
    expect(defaultProps.setCursor).toHaveBeenCalled();
  });

  it('calls setCursor when k or ArrowUp is pressed', () => {
    renderHook(() => useMessageKeyboard({ ...defaultProps, cursor: 1 }));

    fireEvent('keydown', { key: 'k' });
    expect(defaultProps.setCursor).toHaveBeenCalled();
  });

  it('calls onToggleRead when e is pressed', () => {
    renderHook(() => useMessageKeyboard({ ...defaultProps, cursor: 0 }));

    fireEvent('keydown', { key: 'e' });
    expect(defaultProps.onToggleRead).toHaveBeenCalledWith(0);
  });

  it('calls onDismiss when x is pressed', () => {
    renderHook(() => useMessageKeyboard({ ...defaultProps, cursor: 0 }));

    fireEvent('keydown', { key: 'x' });
    expect(defaultProps.onDismiss).toHaveBeenCalledWith(0);
  });

  it('calls onSnooze when s is pressed', () => {
    renderHook(() => useMessageKeyboard({ ...defaultProps, cursor: 0 }));

    fireEvent('keydown', { key: 's' });
    expect(defaultProps.onSnooze).toHaveBeenCalledWith(0);
  });

  it('calls onOpen when Enter is pressed', () => {
    renderHook(() => useMessageKeyboard({ ...defaultProps, cursor: 0 }));

    fireEvent('keydown', { key: 'Enter' });
    expect(defaultProps.onOpen).toHaveBeenCalledWith(0);
  });

  it('ignores keypresses when typing in input', () => {
    renderHook(() => useMessageKeyboard({ ...defaultProps }));

    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'j', bubbles: true }));
    expect(defaultProps.setCursor).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });

  it('ignores keypresses with modifier keys', () => {
    renderHook(() => useMessageKeyboard({ ...defaultProps }));

    fireEvent('keydown', { key: 'j', ctrlKey: true });
    expect(defaultProps.setCursor).not.toHaveBeenCalled();
  });

  it('ignores unrecognized keys', () => {
    renderHook(() => useMessageKeyboard({ ...defaultProps }));

    fireEvent('keydown', { key: 'a' });
    expect(defaultProps.onActivate).not.toHaveBeenCalled();
  });

  it('allows ? and / even when count is 0', () => {
    renderHook(() => useMessageKeyboard({ ...defaultProps, count: 0 }));

    fireEvent('keydown', { key: '?' });
    expect(defaultProps.onShowHelp).toHaveBeenCalled();

    fireEvent('keydown', { key: '/' });
    expect(defaultProps.onFocusSearch).toHaveBeenCalled();
  });

  it('ignores other keys when count is 0', () => {
    renderHook(() => useMessageKeyboard({ ...defaultProps, count: 0 }));

    fireEvent('keydown', { key: 'j' });
    expect(defaultProps.setCursor).not.toHaveBeenCalled();
  });
});

function fireEvent(type: string, init: KeyboardEventInit) {
  window.dispatchEvent(new KeyboardEvent(type, init));
}

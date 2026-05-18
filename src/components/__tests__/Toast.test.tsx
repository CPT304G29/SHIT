import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastContainer, type ToastItem } from '../Toast';

describe('ToastContainer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const successToast: ToastItem = {
    id: 't1',
    message: 'Saved successfully',
    type: 'success',
  };

  const errorToast: ToastItem = {
    id: 't2',
    message: 'Something went wrong',
    type: 'error',
  };

  it('renders success and error toasts', () => {
    render(<ToastContainer toasts={[successToast, errorToast]} onRemove={vi.fn()} />);

    expect(screen.getByText('Saved successfully')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('auto-removes toast after 3 seconds', () => {
    const onRemove = vi.fn();
    render(<ToastContainer toasts={[successToast]} onRemove={onRemove} />);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(onRemove).toHaveBeenCalledWith('t1');
  });

  it('removes toast when close button is clicked', () => {
    const onRemove = vi.fn();
    render(<ToastContainer toasts={[successToast]} onRemove={onRemove} />);

    fireEvent.click(screen.getByLabelText('Close notification'));

    expect(onRemove).toHaveBeenCalledWith('t1');
  });

  it('runs action handler and removes toast when action is clicked', () => {
    const onAction = vi.fn();
    const onRemove = vi.fn();
    const toast: ToastItem = {
      ...successToast,
      action: { label: 'Undo', onClick: onAction },
    };

    render(<ToastContainer toasts={[toast]} onRemove={onRemove} />);

    fireEvent.click(screen.getByTestId('toast-action'));

    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledWith('t1');
  });

  it('clears auto-remove timer on unmount', () => {
    const onRemove = vi.fn();
    const { unmount } = render(<ToastContainer toasts={[successToast]} onRemove={onRemove} />);

    unmount();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(onRemove).not.toHaveBeenCalled();
  });
});

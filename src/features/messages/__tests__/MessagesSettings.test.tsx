import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MessagesSettings } from '../MessagesSettings';
import { useMessagesSettingsStore } from '../messages.settings.store';

describe('MessagesSettings', () => {
  beforeEach(() => {
    useMessagesSettingsStore.getState().reset();
  });

  it('renders when open is true', () => {
    render(<MessagesSettings open={true} onClose={vi.fn()} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Notification settings')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(<MessagesSettings open={false} onClose={vi.fn()} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('displays low stock threshold input', () => {
    render(<MessagesSettings open={true} onClose={vi.fn()} />);

    const input = screen.getByLabelText('Low-stock threshold (units)');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'number');
  });

  it('displays high value threshold input', () => {
    render(<MessagesSettings open={true} onClose={vi.fn()} />);

    const input = screen.getByLabelText('High-value threshold (currency)');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'number');
  });

  it('displays rapid decrease threshold input', () => {
    render(<MessagesSettings open={true} onClose={vi.fn()} />);

    const input = screen.getByLabelText('Rapid decrease (% drop)');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'number');
  });

  it('displays enabled type checkboxes', () => {
    render(<MessagesSettings open={true} onClose={vi.fn()} />);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(4);
  });

  it('calls onClose when cancel button is clicked', () => {
    const onClose = vi.fn();
    render(<MessagesSettings open={true} onClose={onClose} />);

    fireEvent.click(screen.getByText('Reset to defaults'));
    expect(onClose).toHaveBeenCalled();
  });

  it('saves thresholds on form submit', () => {
    const onClose = vi.fn();
    const setThresholdsSpy = vi.spyOn(useMessagesSettingsStore.getState(), 'setThresholds');

    render(<MessagesSettings open={true} onClose={onClose} />);

    const lowStockInput = screen.getByLabelText('Low-stock threshold (units)');
    fireEvent.change(lowStockInput, { target: { value: '25' } });

    fireEvent.click(screen.getByText('Save'));

    expect(setThresholdsSpy).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
    setThresholdsSpy.mockRestore();
  });

  it('toggles enabled types', () => {
    const setTypeEnabledSpy = vi.spyOn(useMessagesSettingsStore.getState(), 'setTypeEnabled');

    render(<MessagesSettings open={true} onClose={vi.fn()} />);

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    expect(setTypeEnabledSpy).toHaveBeenCalled();
    setTypeEnabledSpy.mockRestore();
  });

  it('resets settings when reset button is clicked', () => {
    const resetSpy = vi.spyOn(useMessagesSettingsStore.getState(), 'reset');
    const onClose = vi.fn();

    render(<MessagesSettings open={true} onClose={onClose} />);

    fireEvent.click(screen.getByText('Reset to defaults'));

    expect(resetSpy).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
    resetSpy.mockRestore();
  });
});

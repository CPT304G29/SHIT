import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { KeyboardHelp } from '../KeyboardHelp';

describe('KeyboardHelp', () => {
  it('renders when open is true', () => {
    render(<KeyboardHelp open={true} onClose={vi.fn()} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Keyboard shortcuts')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(<KeyboardHelp open={false} onClose={vi.fn()} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('displays all keyboard shortcuts', () => {
    render(<KeyboardHelp open={true} onClose={vi.fn()} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(8);
  });

  it('calls onClose when dialog is closed', () => {
    const onClose = vi.fn();
    render(<KeyboardHelp open={true} onClose={onClose} />);

    const dialog = screen.getByRole('dialog');
    fireEvent.keyDown(dialog, { key: 'Escape' });

    expect(onClose).toHaveBeenCalled();
  });
});

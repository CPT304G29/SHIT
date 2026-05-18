import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeleteConfirmation } from '../DeleteConfirmation';
import type { InventoryItem } from '../inventory.types';

const mockItem: InventoryItem = {
  id: '1',
  nameKey: 'item.test',
  quantity: 10,
  categoryKey: 'category.test',
  unitPrice: 1000,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

describe('DeleteConfirmation', () => {
  it('renders when open is true', () => {
    render(
      <DeleteConfirmation
        open={true}
        item={mockItem}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getAllByText('Delete Item')).toHaveLength(2); // Title and button
  });

  it('does not render when open is false', () => {
    render(
      <DeleteConfirmation
        open={false}
        item={mockItem}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    const onClose = vi.fn();
    render(
      <DeleteConfirmation
        open={true}
        item={mockItem}
        onClose={onClose}
        onConfirm={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm and onClose when delete button is clicked', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    render(
      <DeleteConfirmation
        open={true}
        item={mockItem}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    const deleteButtons = screen.getAllByText('Delete Item');
    fireEvent.click(deleteButtons[1]); // Second one is the button
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

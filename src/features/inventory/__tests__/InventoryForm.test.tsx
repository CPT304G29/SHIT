import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InventoryForm } from '../InventoryForm';
import type { InventoryItem } from '../inventory.types';

const mockItem: InventoryItem = {
  id: '1',
  nameKey: 'item.test',
  quantity: 10,
  categoryKey: 'category.test',
  unitPrice: 12900,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

describe('InventoryForm', () => {
  it('renders add form when open without item', () => {
    render(
      <InventoryForm
        open={true}
        item={null}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Add New Item')).toBeInTheDocument();
  });

  it('renders edit form when open with item', () => {
    render(
      <InventoryForm
        open={true}
        item={mockItem}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByText('Edit Item')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(
      <InventoryForm
        open={false}
        item={null}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    const onClose = vi.fn();
    render(
      <InventoryForm
        open={true}
        item={null}
        onClose={onClose}
        onSubmit={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not submit when fields are empty', () => {
    const onSubmit = vi.fn();
    render(
      <InventoryForm
        open={true}
        item={null}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />
    );

    fireEvent.click(screen.getByText('Save'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits form with correct data', () => {
    const onSubmit = vi.fn();
    render(
      <InventoryForm
        open={true}
        item={null}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText('Item Name'), { target: { value: 'Test Item' } });
    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'Test Category' } });
    fireEvent.change(screen.getByLabelText('Unit Price'), { target: { value: '10.50' } });

    fireEvent.click(screen.getByText('Save'));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      nameKey: 'Test Item',
      quantity: 5,
      categoryKey: 'Test Category',
      unitPrice: 1050,
    });
  });

  it('populates form fields when editing existing item', () => {
    render(
      <InventoryForm
        open={true}
        item={mockItem}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    const nameInput = screen.getByLabelText('Item Name');
    const quantityInput = screen.getByLabelText('Quantity');
    const categoryInput = screen.getByLabelText('Category');
    const unitPriceInput = screen.getByLabelText('Unit Price');

    expect(nameInput).toHaveValue('item.test');
    expect(quantityInput).toHaveValue(10);
    expect(categoryInput).toHaveValue('category.test');
    expect(unitPriceInput).toHaveValue(129);
  });

  it('calculates total price correctly', () => {
    render(
      <InventoryForm
        open={true}
        item={null}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText('Unit Price'), { target: { value: '10.00' } });

    const totalInput = screen.getByLabelText('Total Price');
    expect(totalInput).toHaveValue('30');
  });
});

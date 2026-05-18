import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InventoryTable } from '../InventoryTable';
import { useInventoryStore } from '../inventory.store';
import type { InventoryItem } from '../inventory.types';

const mockItems: InventoryItem[] = [
  {
    id: '1',
    nameKey: 'item.blazerFemale',
    quantity: 10,
    categoryKey: 'category.outerwear',
    unitPrice: 12900,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    nameKey: 'item.socks',
    quantity: 5,
    categoryKey: 'category.socks',
    unitPrice: 1510,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

beforeEach(() => {
  useInventoryStore.setState({ items: mockItems });
});

describe('InventoryTable', () => {
  const defaultProps = {
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onAdd: vi.fn(),
    onTriggerEasterEgg: vi.fn(),
  };

  it('renders table with items', () => {
    render(<InventoryTable {...defaultProps} />);
    expect(screen.getByText('Item Name')).toBeInTheDocument();
    expect(screen.getByText('Quantity')).toBeInTheDocument();
  });

  it('displays item data in table rows', () => {
    render(<InventoryTable {...defaultProps} />);
    expect(screen.getByText('Blazer (Female)')).toBeInTheDocument();
  });

  it('calls onAdd when add button is clicked', () => {
    const onAdd = vi.fn();
    render(<InventoryTable {...defaultProps} onAdd={onAdd} />);
    fireEvent.click(screen.getByText('Add New Item'));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn();
    render(<InventoryTable {...defaultProps} onEdit={onEdit} />);
    const editButtons = screen.getAllByLabelText('Edit Item');
    fireEvent.click(editButtons[0]);
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(<InventoryTable {...defaultProps} onDelete={onDelete} />);
    const deleteButtons = screen.getAllByLabelText('Delete Item');
    fireEvent.click(deleteButtons[0]);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('filters items using search', () => {
    render(<InventoryTable {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText('Search inventory...');
    fireEvent.change(searchInput, { target: { value: 'blazer' } });
    expect(screen.getByText('Blazer (Female)')).toBeInTheDocument();
    expect(screen.queryByText('Winnie the Pooh Socks')).not.toBeInTheDocument();
  });

  it('highlights item when highlightItemId is provided', () => {
    Element.prototype.scrollIntoView = vi.fn();
    render(<InventoryTable {...defaultProps} highlightItemId="1" />);
    const row = screen.getByText('Blazer (Female)').closest('tr');
    expect(row).toHaveStyle({ backgroundColor: 'rgba(229, 0, 18, 0.1)' });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MessageDetailDrawer } from '../MessageDetailDrawer';
import { useInventoryStore } from '@/features/inventory/inventory.store';
import { useMessagesStore } from '../messages.store';
import type { Message } from '../messages.types';

const mockMessage: Message = {
  id: 'outOfStock:1',
  type: 'outOfStock',
  severity: 'critical',
  itemId: '1',
  itemNameKey: 'item.hoodie',
  quantity: 0,
  totalValue: 0,
  createdAt: Date.now(),
  read: false,
  dismissed: false,
  snoozedUntil: null,
};

describe('MessageDetailDrawer', () => {
  beforeEach(() => {
    useMessagesStore.getState().reset();
    useInventoryStore.setState({
      items: [
        {
          id: '1',
          nameKey: 'item.hoodie',
          quantity: 0,
          categoryKey: 'category.outerwear',
          unitPrice: 6050,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
    });
  });

  it('renders nothing when message is null', () => {
    render(
      <MessageDetailDrawer message={null} onClose={vi.fn()} onJumpToInventory={vi.fn()} />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders drawer when message is provided', () => {
    render(
      <MessageDetailDrawer message={mockMessage} onClose={vi.fn()} onJumpToInventory={vi.fn()} />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Hoodie')).toBeInTheDocument();
  });

  it('displays item details', () => {
    render(
      <MessageDetailDrawer message={mockMessage} onClose={vi.fn()} onJumpToInventory={vi.fn()} />
    );

    expect(screen.getByText('Outerwear')).toBeInTheDocument();
    expect(screen.getByTestId('detail-quantity')).toHaveTextContent('0');
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <MessageDetailDrawer message={mockMessage} onClose={onClose} onJumpToInventory={vi.fn()} />
    );

    fireEvent.click(screen.getByLabelText('Dismiss'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onJumpToInventory when view in inventory button is clicked', () => {
    const onJumpToInventory = vi.fn();
    render(
      <MessageDetailDrawer message={mockMessage} onClose={vi.fn()} onJumpToInventory={onJumpToInventory} />
    );

    fireEvent.click(screen.getByTestId('jump-to-inventory'));
    expect(onJumpToInventory).toHaveBeenCalledWith('1');
  });

  it('shows quick restock button for outOfStock messages', () => {
    render(
      <MessageDetailDrawer message={mockMessage} onClose={vi.fn()} onJumpToInventory={vi.fn()} />
    );

    expect(screen.getByTestId('quick-restock')).toBeInTheDocument();
  });

  it('does not show quick restock button for highValue messages', () => {
    const highValueMessage: Message = {
      ...mockMessage,
      type: 'highValue',
      severity: 'info',
    };

    render(
      <MessageDetailDrawer message={highValueMessage} onClose={vi.fn()} onJumpToInventory={vi.fn()} />
    );

    expect(screen.queryByTestId('quick-restock')).not.toBeInTheDocument();
  });

  it('handles restock action', () => {
    const onClose = vi.fn();
    const updateItemSpy = vi.spyOn(useInventoryStore.getState(), 'updateItem');
    const markReadSpy = vi.spyOn(useMessagesStore.getState(), 'markRead');

    render(
      <MessageDetailDrawer message={mockMessage} onClose={onClose} onJumpToInventory={vi.fn()} />
    );

    fireEvent.click(screen.getByTestId('quick-restock'));

    expect(updateItemSpy).toHaveBeenCalled();
    expect(markReadSpy).toHaveBeenCalledWith('outOfStock:1');
    expect(onClose).toHaveBeenCalled();

    updateItemSpy.mockRestore();
    markReadSpy.mockRestore();
  });

  it('displays message body with item name', () => {
    render(
      <MessageDetailDrawer message={mockMessage} onClose={vi.fn()} onJumpToInventory={vi.fn()} />
    );

    expect(screen.getByText('Message')).toBeInTheDocument();
  });
});

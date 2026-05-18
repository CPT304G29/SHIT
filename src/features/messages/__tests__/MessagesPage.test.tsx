import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MessagesPage } from '../MessagesPage';
import { useMessagesStore } from '../messages.store';
import { useMessagesSettingsStore } from '../messages.settings.store';
import { useMessagesHistoryStore } from '../messages.history.store';
import { useInventoryStore } from '@/features/inventory/inventory.store';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Pie: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Cell: () => null,
  Tooltip: () => null,
}));

describe('MessagesPage', () => {
  beforeEach(() => {
    useMessagesStore.getState().reset();
    useMessagesSettingsStore.getState().reset();
    useMessagesHistoryStore.getState().reset();
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

  it('renders page title', () => {
    render(<MessagesPage />);
    expect(screen.getByText('Messages')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<MessagesPage />);
    expect(screen.getByTestId('message-search')).toBeInTheDocument();
  });

  it('renders settings button', () => {
    render(<MessagesPage />);
    expect(screen.getByTestId('open-settings')).toBeInTheDocument();
  });

  it('renders help button', () => {
    render(<MessagesPage />);
    expect(screen.getByTestId('open-help')).toBeInTheDocument();
  });

  it('renders message items', () => {
    render(<MessagesPage />);
    expect(screen.getByTestId('message-item')).toBeInTheDocument();
  });

  it('renders empty state when no messages', () => {
    useInventoryStore.setState({
      items: [
        {
          id: '1',
          nameKey: 'item.hoodie',
          quantity: 100,
          categoryKey: 'category.outerwear',
          unitPrice: 6050,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
    });
    render(<MessagesPage />);
    expect(screen.getByText('No messages. Your inventory looks healthy.')).toBeInTheDocument();
  });
});

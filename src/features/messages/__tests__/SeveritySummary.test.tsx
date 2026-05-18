import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SeveritySummary } from '../SeveritySummary';
import type { Message } from '../messages.types';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Pie: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Cell: () => null,
  Tooltip: () => null,
}));

const mockMessages: Message[] = [
  {
    id: '1',
    type: 'outOfStock',
    severity: 'critical',
    itemId: 'item-1',
    itemNameKey: 'item.test1',
    quantity: 0,
    totalValue: 0,
    createdAt: Date.now(),
    read: false,
    dismissed: false,
    snoozedUntil: null,
  },
  {
    id: '2',
    type: 'lowStock',
    severity: 'warning',
    itemId: 'item-2',
    itemNameKey: 'item.test2',
    quantity: 5,
    totalValue: 5000,
    createdAt: Date.now(),
    read: false,
    dismissed: false,
    snoozedUntil: null,
  },
  {
    id: '3',
    type: 'highValue',
    severity: 'info',
    itemId: 'item-3',
    itemNameKey: 'item.test3',
    quantity: 100,
    totalValue: 100000,
    createdAt: Date.now(),
    read: true,
    dismissed: false,
    snoozedUntil: null,
  },
];

describe('SeveritySummary', () => {
  it('renders nothing when messages array is empty', () => {
    const { container } = render(<SeveritySummary messages={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('displays total message count', () => {
    render(<SeveritySummary messages={mockMessages} />);

    expect(screen.getByTestId('summary-total')).toHaveTextContent('3');
  });

  it('displays critical count', () => {
    render(<SeveritySummary messages={mockMessages} />);

    expect(screen.getByTestId('summary-critical')).toHaveTextContent('1');
  });

  it('displays warning count', () => {
    render(<SeveritySummary messages={mockMessages} />);

    expect(screen.getByTestId('summary-warning')).toHaveTextContent('1');
  });

  it('displays info count', () => {
    render(<SeveritySummary messages={mockMessages} />);

    expect(screen.getByTestId('summary-info')).toHaveTextContent('1');
  });

  it('renders region with accessible label', () => {
    render(<SeveritySummary messages={mockMessages} />);

    expect(screen.getByRole('region')).toHaveAccessibleName('Severity overview');
  });

  it('displays severity labels', () => {
    render(<SeveritySummary messages={mockMessages} />);

    expect(screen.getByText('Critical')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('Info')).toBeInTheDocument();
  });
});

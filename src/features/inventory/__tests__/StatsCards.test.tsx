import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatsCards } from '../StatsCards';
import { useInventoryStore } from '../inventory.store';
import type { InventoryItem } from '../inventory.types';

const mockItems: InventoryItem[] = [
  {
    id: '1',
    nameKey: 'item.blazerFemale',
    quantity: 10,
    categoryKey: 'category.outerwear',
    unitPrice: 1000,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    nameKey: 'item.socks',
    quantity: 20,
    categoryKey: 'category.socks',
    unitPrice: 2000,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

beforeEach(() => {
  useInventoryStore.setState({ items: mockItems });
});

describe('StatsCards', () => {
  it('renders overview title', () => {
    render(<StatsCards />);
    expect(screen.getByText('Overview')).toBeInTheDocument();
  });

  it('displays total SKU count', () => {
    render(<StatsCards />);
    expect(screen.getByText('Total SKUs')).toBeInTheDocument();
  });

  it('displays total quantity', () => {
    render(<StatsCards />);
    expect(screen.getByText('Total Quantity')).toBeInTheDocument();
  });

  it('displays total value formatted as currency', () => {
    render(<StatsCards />);
    expect(screen.getByText('Total Value')).toBeInTheDocument();
  });

  it('displays category count', () => {
    render(<StatsCards />);
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });
});

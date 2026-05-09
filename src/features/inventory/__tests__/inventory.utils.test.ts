import { describe, it, expect } from 'vitest';
import {
  calculateTotalPrice,
  formatCurrency,
  createItem,
  updateItem,
  filterItems,
} from '../inventory.utils';
import type { InventoryItem, InventoryFormData } from '../inventory.types';

describe('calculateTotalPrice', () => {
  it('calculates total from quantity and unit price in cents', () => {
    expect(calculateTotalPrice(10, 12900)).toBe(129000);
    expect(calculateTotalPrice(0, 5000)).toBe(0);
    expect(calculateTotalPrice(3, 4599)).toBe(13797);
  });
});

describe('formatCurrency', () => {
  it('formats MYR for English locale', () => {
    expect(formatCurrency(12900, 'en')).toMatch(/RM\s?129\.00/);
  });

  it('formats CNY for Chinese locale', () => {
    expect(formatCurrency(12900, 'zh')).toMatch(/¥129\.00/);
  });

  it('formats JPY for Japanese locale without decimals', () => {
    expect(formatCurrency(12900, 'ja')).toMatch(/￥129/);
  });
});

describe('createItem', () => {
  it('creates an item with generated id and timestamps', () => {
    const data: InventoryFormData = {
      nameKey: 'item.test',
      quantity: 5,
      categoryKey: 'category.test',
      unitPrice: 1000,
    };

    const item = createItem(data);

    expect(item.id).toBeDefined();
    expect(item.nameKey).toBe('item.test');
    expect(item.quantity).toBe(5);
    expect(item.createdAt).toBeDefined();
    expect(item.updatedAt).toBeDefined();
  });

  it('uses provided id when given', () => {
    const data: InventoryFormData = {
      nameKey: 'item.test',
      quantity: 1,
      categoryKey: 'category.test',
      unitPrice: 500,
    };

    const item = createItem(data, 'custom-id');
    expect(item.id).toBe('custom-id');
  });
});

describe('updateItem', () => {
  it('updates fields and sets updatedAt', () => {
    const original: InventoryItem = {
      id: '1',
      nameKey: 'item.old',
      quantity: 10,
      categoryKey: 'category.old',
      unitPrice: 1000,
      createdAt: 1000,
      updatedAt: 1000,
    };

    const data: InventoryFormData = {
      nameKey: 'item.new',
      quantity: 20,
      categoryKey: 'category.new',
      unitPrice: 2000,
    };

    const updated = updateItem(original, data);

    expect(updated.nameKey).toBe('item.new');
    expect(updated.quantity).toBe(20);
    expect(updated.createdAt).toBe(1000);
    expect(updated.updatedAt).toBeGreaterThan(1000);
  });
});

describe('filterItems', () => {
  const items: InventoryItem[] = [
    {
      id: '1',
      nameKey: 'item.blazer',
      quantity: 1,
      categoryKey: 'category.outerwear',
      unitPrice: 100,
      createdAt: 1,
      updatedAt: 1,
    },
    {
      id: '2',
      nameKey: 'item.socks',
      quantity: 2,
      categoryKey: 'category.socks',
      unitPrice: 200,
      createdAt: 2,
      updatedAt: 2,
    },
  ];

  it('filters by name key', () => {
    expect(filterItems(items, 'blazer')).toHaveLength(1);
    expect(filterItems(items, 'BLAZER')).toHaveLength(1);
  });

  it('filters by category key', () => {
    expect(filterItems(items, 'socks')).toHaveLength(1);
  });

  it('returns all items for empty query', () => {
    expect(filterItems(items, '')).toHaveLength(2);
  });
});

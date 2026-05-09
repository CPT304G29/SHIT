import { describe, it, expect } from 'vitest';
import {
  groupByCategory,
  valueByCategory,
  topItemsByQuantity,
  topItemsByValue,
  avgPriceByCategory,
  scatterData,
} from '../chart.utils';
import type { InventoryItem } from '@/features/inventory/inventory.types';

const items: InventoryItem[] = [
  {
    id: '1',
    nameKey: 'item.a',
    quantity: 10,
    categoryKey: 'category.x',
    unitPrice: 100,
    createdAt: 0,
    updatedAt: 0,
  },
  {
    id: '2',
    nameKey: 'item.b',
    quantity: 20,
    categoryKey: 'category.x',
    unitPrice: 200,
    createdAt: 0,
    updatedAt: 0,
  },
  {
    id: '3',
    nameKey: 'item.c',
    quantity: 5,
    categoryKey: 'category.y',
    unitPrice: 50,
    createdAt: 0,
    updatedAt: 0,
  },
];

describe('groupByCategory', () => {
  it('sums quantity per category', () => {
    const result = groupByCategory(items);
    expect(result).toHaveLength(2);
    expect(result.find((d) => d.name === 'category.x')?.value).toBe(30);
    expect(result.find((d) => d.name === 'category.y')?.value).toBe(5);
  });

  it('returns empty array for empty input', () => {
    expect(groupByCategory([])).toEqual([]);
  });
});

describe('valueByCategory', () => {
  it('sums total value per category', () => {
    const result = valueByCategory(items);
    expect(result).toHaveLength(2);
    expect(result.find((d) => d.name === 'category.x')?.value).toBe(10 * 100 + 20 * 200);
    expect(result.find((d) => d.name === 'category.y')?.value).toBe(5 * 50);
  });
});

describe('topItemsByQuantity', () => {
  it('returns items sorted by quantity desc', () => {
    const result = topItemsByQuantity(items, 2);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('item.b');
    expect(result[0].quantity).toBe(20);
    expect(result[1].name).toBe('item.a');
    expect(result[1].quantity).toBe(10);
  });

  it('respects limit', () => {
    expect(topItemsByQuantity(items, 1)).toHaveLength(1);
  });
});

describe('topItemsByValue', () => {
  it('returns items sorted by total value desc', () => {
    const result = topItemsByValue(items, 2);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('item.b');
    expect(result[0].value).toBe(20 * 200);
    expect(result[1].name).toBe('item.a');
    expect(result[1].value).toBe(10 * 100);
  });

  it('respects limit', () => {
    expect(topItemsByValue(items, 1)).toHaveLength(1);
  });
});

describe('avgPriceByCategory', () => {
  it('returns average unit price per category', () => {
    const result = avgPriceByCategory(items);
    expect(result).toHaveLength(2);
    expect(result.find((d) => d.name === 'category.x')?.value).toBe(150);
    expect(result.find((d) => d.name === 'category.y')?.value).toBe(50);
  });

  it('returns empty array for empty input', () => {
    expect(avgPriceByCategory([])).toEqual([]);
  });
});

describe('scatterData', () => {
  it('maps items to scatter points', () => {
    const result = scatterData(items);
    expect(result).toHaveLength(3);
    expect(result[0]).toMatchObject({ x: 1, y: 10, name: 'item.a', category: 'category.x' });
  });
});

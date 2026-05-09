import type { InventoryItem } from '@/features/inventory/inventory.types';

export interface CategoryDatum {
  name: string;
  value: number;
}

export interface ItemDatum {
  name: string;
  quantity: number;
  value: number;
  unitPrice: number;
}

export interface ScatterDatum {
  x: number;
  y: number;
  name: string;
  category: string;
}

export function groupByCategory(items: InventoryItem[]): CategoryDatum[] {
  const map = new Map<string, number>();
  for (const item of items) {
    map.set(item.categoryKey, (map.get(item.categoryKey) ?? 0) + item.quantity);
  }
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

export function valueByCategory(items: InventoryItem[]): CategoryDatum[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const v = item.quantity * item.unitPrice;
    map.set(item.categoryKey, (map.get(item.categoryKey) ?? 0) + v);
  }
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

export function topItemsByQuantity(items: InventoryItem[], limit = 10): ItemDatum[] {
  return items
    .map((item) => ({
      name: item.nameKey,
      quantity: item.quantity,
      value: item.quantity * item.unitPrice,
      unitPrice: item.unitPrice,
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
}

export function topItemsByValue(items: InventoryItem[], limit = 8): ItemDatum[] {
  return items
    .map((item) => ({
      name: item.nameKey,
      quantity: item.quantity,
      value: item.quantity * item.unitPrice,
      unitPrice: item.unitPrice,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export function avgPriceByCategory(items: InventoryItem[]): CategoryDatum[] {
  const sums = new Map<string, number>();
  const counts = new Map<string, number>();
  for (const item of items) {
    sums.set(item.categoryKey, (sums.get(item.categoryKey) ?? 0) + item.unitPrice);
    counts.set(item.categoryKey, (counts.get(item.categoryKey) ?? 0) + 1);
  }
  return Array.from(sums.entries()).map(([name, total]) => ({
    name,
    value: Math.round(total / (counts.get(name) ?? 1)),
  }));
}

export function scatterData(items: InventoryItem[]): ScatterDatum[] {
  return items.map((item) => ({
    x: item.unitPrice / 100,
    y: item.quantity,
    name: item.nameKey,
    category: item.categoryKey,
  }));
}

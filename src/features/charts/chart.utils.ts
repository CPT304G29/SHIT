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

export function scatterData(items: InventoryItem[]): ScatterDatum[] {
  return items.map((item) => ({
    x: item.unitPrice / 100,
    y: item.quantity,
    name: item.nameKey,
    category: item.categoryKey,
  }));
}

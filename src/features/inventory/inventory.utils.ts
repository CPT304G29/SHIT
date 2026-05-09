import type { InventoryItem, InventoryFormData } from './inventory.types';

export function calculateTotalPrice(quantity: number, unitPrice: number): number {
  return quantity * unitPrice;
}

export function formatCurrency(amount: number, locale: string): string {
  const currencyMap: Record<string, string> = {
    en: 'MYR',
    zh: 'CNY',
    ja: 'JPY',
  };
  const currency = currencyMap[locale] ?? 'MYR';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'JPY' ? 0 : 2,
  }).format(amount / 100);
}

export function createItem(data: InventoryFormData, id?: string): InventoryItem {
  const now = Date.now();
  return {
    id: id ?? crypto.randomUUID(),
    ...data,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateItem(item: InventoryItem, data: InventoryFormData): InventoryItem {
  return {
    ...item,
    ...data,
    updatedAt: Date.now(),
  };
}

export function filterItems(items: InventoryItem[], query: string): InventoryItem[] {
  const lower = query.toLowerCase();
  return items.filter(
    (item) =>
      item.nameKey.toLowerCase().includes(lower) || item.categoryKey.toLowerCase().includes(lower)
  );
}

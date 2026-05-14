import type { InventoryItem } from '@/features/inventory/inventory.types';

export type RevenuePeriod = 'day' | 'month' | 'quarter';

export interface RevenueSummaryRow {
  periodType: RevenuePeriod;
  period: string;
  revenueCents: number;
  quantity: number;
  itemCount: number;
  firstUpdatedAt: number;
  lastUpdatedAt: number;
}

export interface RevenueCategoryRow {
  category: string;
  categoryKey: string;
  revenueCents: number;
  quantity: number;
  itemCount: number;
  averageUnitPriceCents: number;
  revenueShare: number;
}

export interface RevenueSourceRow {
  itemId: string;
  itemName: string;
  itemNameKey: string;
  category: string;
  categoryKey: string;
  quantity: number;
  unitPrice: number;
  unitPriceCents: number;
  revenue: number;
  revenueCents: number;
  dayPeriod: string;
  monthPeriod: string;
  quarterPeriod: string;
  createdAt: string;
  updatedAt: string;
}

export interface RevenueExportData {
  day: RevenueSummaryRow[];
  month: RevenueSummaryRow[];
  quarter: RevenueSummaryRow[];
  categories: RevenueCategoryRow[];
  sourceItems: RevenueSourceRow[];
}

export interface InventoryDetailRow {
  itemId: string;
  itemName: string;
  itemNameKey: string;
  category: string;
  categoryKey: string;
  quantity: number;
  unitPrice: number;
  unitPriceCents: number;
  totalValue: number;
  totalValueCents: number;
  stockStatus: 'outOfStock' | 'lowStock' | 'inStock';
  createdAt: string;
  updatedAt: string;
}

export interface CalendarSummaryExportRow {
  date: string;
  inboundQty: number;
  outboundQty: number;
  netQty: number;
  transactionCount: number;
  totalValue: number;
  totalValueCents: number;
  averageDealPrice: number;
  averageDealPriceCents: number;
}

export interface CalendarDetailExportRow {
  eventId: string;
  date: string;
  timestamp: string;
  direction: 'in' | 'out';
  itemId: string;
  itemName: string;
  itemNameKey: string;
  category: string;
  categoryKey: string;
  quantity: number;
  unitPrice: number;
  unitPriceCents: number;
  totalValue: number;
  totalValueCents: number;
}

export interface ImportedRevenueRow {
  date: string;
  periodType: RevenuePeriod;
  revenueCents: number;
  source?: string;
  note?: string;
}

export interface RevenueImportError {
  rowNumber: number;
  message: string;
}

export interface RevenueImportResult {
  rows: ImportedRevenueRow[];
  errors: RevenueImportError[];
}

export type InventoryLabelResolver = (item: InventoryItem) => {
  itemName: string;
  category: string;
};

import type { InventoryItem } from '@/features/inventory/inventory.types';
import { buildDailySummaries, buildInventoryHistory } from '@/features/calendar/calendar.utils';
import type {
  CalendarDetailExportRow,
  CalendarSummaryExportRow,
  InventoryDetailRow,
  InventoryLabelResolver,
  RevenueCategoryRow,
  RevenueExportData,
  RevenuePeriod,
  RevenueSourceRow,
  RevenueSummaryRow,
} from './files.types';

const PERIODS: RevenuePeriod[] = ['day', 'month', 'quarter'];

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function getRevenuePeriodKey(timestamp: number, period: RevenuePeriod): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  if (period === 'day') return `${year}-${pad(month)}-${pad(date.getDate())}`;
  if (period === 'month') return `${year}-${pad(month)}`;

  return `${year}-Q${Math.floor((month - 1) / 3) + 1}`;
}

export function buildRevenueSummary(
  items: InventoryItem[],
  periodType: RevenuePeriod
): RevenueSummaryRow[] {
  const grouped = new Map<string, RevenueSummaryRow>();

  for (const item of items) {
    const period = getRevenuePeriodKey(item.updatedAt, periodType);
    const revenueCents = item.quantity * item.unitPrice;
    const current = grouped.get(period);

    if (current) {
      current.revenueCents += revenueCents;
      current.quantity += item.quantity;
      current.itemCount += 1;
      current.firstUpdatedAt = Math.min(current.firstUpdatedAt, item.updatedAt);
      current.lastUpdatedAt = Math.max(current.lastUpdatedAt, item.updatedAt);
    } else {
      grouped.set(period, {
        periodType,
        period,
        revenueCents,
        quantity: item.quantity,
        itemCount: 1,
        firstUpdatedAt: item.updatedAt,
        lastUpdatedAt: item.updatedAt,
      });
    }
  }

  return [...grouped.values()].sort((a, b) => a.period.localeCompare(b.period));
}

export function buildRevenueSourceRows(
  items: InventoryItem[],
  resolveLabel: InventoryLabelResolver
): RevenueSourceRow[] {
  return items
    .map((item) => {
      const label = resolveLabel(item);

      return {
        itemId: item.id,
        itemName: label.itemName,
        itemNameKey: item.nameKey,
        category: label.category,
        categoryKey: item.categoryKey,
        quantity: item.quantity,
        unitPrice: item.unitPrice / 100,
        unitPriceCents: item.unitPrice,
        revenue: (item.quantity * item.unitPrice) / 100,
        revenueCents: item.quantity * item.unitPrice,
        dayPeriod: getRevenuePeriodKey(item.updatedAt, 'day'),
        monthPeriod: getRevenuePeriodKey(item.updatedAt, 'month'),
        quarterPeriod: getRevenuePeriodKey(item.updatedAt, 'quarter'),
        createdAt: new Date(item.createdAt).toISOString(),
        updatedAt: new Date(item.updatedAt).toISOString(),
      };
    })
    .sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
}

function getStockStatus(quantity: number): InventoryDetailRow['stockStatus'] {
  if (quantity <= 0) return 'outOfStock';
  if (quantity <= 10) return 'lowStock';
  return 'inStock';
}

export function buildInventoryDetailRows(
  items: InventoryItem[],
  resolveLabel: InventoryLabelResolver
): InventoryDetailRow[] {
  return items
    .map((item) => {
      const label = resolveLabel(item);
      const totalValueCents = item.quantity * item.unitPrice;

      return {
        itemId: item.id,
        itemName: label.itemName,
        itemNameKey: item.nameKey,
        category: label.category,
        categoryKey: item.categoryKey,
        quantity: item.quantity,
        unitPrice: item.unitPrice / 100,
        unitPriceCents: item.unitPrice,
        totalValue: totalValueCents / 100,
        totalValueCents,
        stockStatus: getStockStatus(item.quantity),
        createdAt: new Date(item.createdAt).toISOString(),
        updatedAt: new Date(item.updatedAt).toISOString(),
      };
    })
    .sort((a, b) => a.category.localeCompare(b.category) || a.itemName.localeCompare(b.itemName));
}

export function buildCalendarSummaryRows(
  items: InventoryItem[],
  now = Date.now()
): CalendarSummaryExportRow[] {
  return buildDailySummaries(buildInventoryHistory(items, now)).map((summary) => ({
    date: summary.dateKey,
    inboundQty: summary.inboundQty,
    outboundQty: summary.outboundQty,
    netQty: summary.netQty,
    transactionCount: summary.dealCount,
    totalValue: summary.totalValue / 100,
    totalValueCents: summary.totalValue,
    averageDealPrice: summary.avgDealPrice / 100,
    averageDealPriceCents: summary.avgDealPrice,
  }));
}

export function buildCalendarDetailRows(
  items: InventoryItem[],
  resolveLabel: InventoryLabelResolver,
  now = Date.now()
): CalendarDetailExportRow[] {
  return buildInventoryHistory(items, now).map((event) => {
    const item = items.find((candidate) => candidate.id === event.itemId);
    const label = item
      ? resolveLabel(item)
      : { itemName: event.nameKey, category: event.categoryKey };

    return {
      eventId: event.id,
      date: event.dateKey,
      timestamp: new Date(event.timestamp).toISOString(),
      direction: event.direction,
      itemId: event.itemId,
      itemName: label.itemName,
      itemNameKey: event.nameKey,
      category: label.category,
      categoryKey: event.categoryKey,
      quantity: event.quantity,
      unitPrice: event.unitPrice / 100,
      unitPriceCents: event.unitPrice,
      totalValue: event.totalValue / 100,
      totalValueCents: event.totalValue,
    };
  });
}

export function buildRevenueCategoryRows(
  items: InventoryItem[],
  resolveLabel: InventoryLabelResolver
): RevenueCategoryRow[] {
  const totalRevenueCents = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const grouped = new Map<string, Omit<RevenueCategoryRow, 'revenueShare'>>();

  for (const item of items) {
    const label = resolveLabel(item);
    const revenueCents = item.quantity * item.unitPrice;
    const current = grouped.get(item.categoryKey);

    if (current) {
      current.revenueCents += revenueCents;
      current.quantity += item.quantity;
      current.itemCount += 1;
      current.averageUnitPriceCents =
        current.quantity > 0 ? Math.round(current.revenueCents / current.quantity) : 0;
    } else {
      grouped.set(item.categoryKey, {
        category: label.category,
        categoryKey: item.categoryKey,
        revenueCents,
        quantity: item.quantity,
        itemCount: 1,
        averageUnitPriceCents: item.quantity > 0 ? Math.round(revenueCents / item.quantity) : 0,
      });
    }
  }

  return [...grouped.values()]
    .map((row) => ({
      ...row,
      revenueShare: totalRevenueCents > 0 ? row.revenueCents / totalRevenueCents : 0,
    }))
    .sort((a, b) => b.revenueCents - a.revenueCents);
}

export function buildRevenueExportData(
  items: InventoryItem[],
  resolveLabel: InventoryLabelResolver
): RevenueExportData {
  return {
    day: buildRevenueSummary(items, 'day'),
    month: buildRevenueSummary(items, 'month'),
    quarter: buildRevenueSummary(items, 'quarter'),
    categories: buildRevenueCategoryRows(items, resolveLabel),
    sourceItems: buildRevenueSourceRows(items, resolveLabel),
  };
}

export function toWorksheetRows(rows: RevenueSummaryRow[]) {
  return rows.map((row) => ({
    Period: row.period,
    'Period Type': row.periodType,
    Revenue: row.revenueCents / 100,
    'Revenue (cents)': row.revenueCents,
    Quantity: row.quantity,
    'Item Count': row.itemCount,
    'Average Revenue per Item': row.itemCount > 0 ? row.revenueCents / row.itemCount / 100 : 0,
    'Average Unit Price': row.quantity > 0 ? row.revenueCents / row.quantity / 100 : 0,
    'First Updated': new Date(row.firstUpdatedAt).toISOString(),
    'Last Updated': new Date(row.lastUpdatedAt).toISOString(),
  }));
}

export function toCategoryWorksheetRows(rows: RevenueCategoryRow[]) {
  return rows.map((row) => ({
    Category: row.category,
    'Category Key': row.categoryKey,
    Revenue: row.revenueCents / 100,
    'Revenue (cents)': row.revenueCents,
    'Revenue Share': row.revenueShare,
    Quantity: row.quantity,
    'Item Count': row.itemCount,
    'Average Unit Price': row.averageUnitPriceCents / 100,
    'Average Unit Price (cents)': row.averageUnitPriceCents,
  }));
}

export function toSourceWorksheetRows(rows: RevenueSourceRow[]) {
  return rows.map((row) => ({
    'Item ID': row.itemId,
    'Item Name': row.itemName,
    'Item Name Key': row.itemNameKey,
    Category: row.category,
    'Category Key': row.categoryKey,
    Quantity: row.quantity,
    'Unit Price': row.unitPrice,
    'Unit Price (cents)': row.unitPriceCents,
    Revenue: row.revenue,
    'Revenue (cents)': row.revenueCents,
    'Daily Period': row.dayPeriod,
    'Monthly Period': row.monthPeriod,
    'Quarterly Period': row.quarterPeriod,
    'Created At': row.createdAt,
    'Updated At': row.updatedAt,
  }));
}

export function toInventoryDetailWorksheetRows(rows: InventoryDetailRow[]) {
  return rows.map((row) => ({
    'Item ID': row.itemId,
    'Item Name': row.itemName,
    'Item Name Key': row.itemNameKey,
    Category: row.category,
    'Category Key': row.categoryKey,
    Quantity: row.quantity,
    'Unit Price': row.unitPrice,
    'Unit Price (cents)': row.unitPriceCents,
    'Total Value': row.totalValue,
    'Total Value (cents)': row.totalValueCents,
    'Stock Status': row.stockStatus,
    'Created At': row.createdAt,
    'Updated At': row.updatedAt,
  }));
}

export function toCalendarSummaryWorksheetRows(rows: CalendarSummaryExportRow[]) {
  return rows.map((row) => ({
    Date: row.date,
    'Inbound Quantity': row.inboundQty,
    'Outbound Quantity': row.outboundQty,
    'Net Quantity': row.netQty,
    'Transaction Count': row.transactionCount,
    'Total Value': row.totalValue,
    'Total Value (cents)': row.totalValueCents,
    'Average Deal Price': row.averageDealPrice,
    'Average Deal Price (cents)': row.averageDealPriceCents,
  }));
}

export function toCalendarDetailWorksheetRows(rows: CalendarDetailExportRow[]) {
  return rows.map((row) => ({
    'Event ID': row.eventId,
    Date: row.date,
    Timestamp: row.timestamp,
    Direction: row.direction,
    'Item ID': row.itemId,
    'Item Name': row.itemName,
    'Item Name Key': row.itemNameKey,
    Category: row.category,
    'Category Key': row.categoryKey,
    Quantity: row.quantity,
    'Unit Price': row.unitPrice,
    'Unit Price (cents)': row.unitPriceCents,
    'Total Value': row.totalValue,
    'Total Value (cents)': row.totalValueCents,
  }));
}

export function buildRevenueOverviewRows(items: InventoryItem[], generatedAt = Date.now()) {
  const totalRevenueCents = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const timestamps = items.flatMap((item) => [item.createdAt, item.updatedAt]);
  const minTimestamp = timestamps.length > 0 ? Math.min(...timestamps) : null;
  const maxTimestamp = timestamps.length > 0 ? Math.max(...timestamps) : null;

  return [
    { Metric: 'Generated At', Value: new Date(generatedAt).toISOString() },
    { Metric: 'Calculation', Value: 'Revenue = quantity * unitPrice' },
    { Metric: 'Grouping Date', Value: 'InventoryItem.updatedAt' },
    { Metric: 'Source Item Count', Value: items.length },
    { Metric: 'Total Quantity', Value: totalQuantity },
    { Metric: 'Total Revenue', Value: totalRevenueCents / 100 },
    { Metric: 'Total Revenue (cents)', Value: totalRevenueCents },
    {
      Metric: 'Average Unit Price',
      Value: totalQuantity > 0 ? totalRevenueCents / totalQuantity / 100 : 0,
    },
    {
      Metric: 'Earliest Source Timestamp',
      Value: minTimestamp === null ? '' : new Date(minTimestamp).toISOString(),
    },
    {
      Metric: 'Latest Source Timestamp',
      Value: maxTimestamp === null ? '' : new Date(maxTimestamp).toISOString(),
    },
  ];
}

export function buildRevenueDictionaryRows() {
  return [
    { Field: 'Revenue', Meaning: 'Human-readable money amount, converted from cents.' },
    { Field: 'Revenue (cents)', Meaning: 'Raw integer amount used by the app.' },
    { Field: 'Quantity', Meaning: 'Current inventory quantity used for the export.' },
    { Field: 'Period Type', Meaning: 'day, month or quarter.' },
    { Field: 'Daily Period', Meaning: 'YYYY-MM-DD derived from InventoryItem.updatedAt.' },
    { Field: 'Monthly Period', Meaning: 'YYYY-MM derived from InventoryItem.updatedAt.' },
    { Field: 'Quarterly Period', Meaning: 'YYYY-QN derived from InventoryItem.updatedAt.' },
    { Field: 'Item Name Key', Meaning: 'i18n key stored in inventory data.' },
    { Field: 'Category Key', Meaning: 'i18n key stored in inventory data.' },
    { Field: 'Stock Status', Meaning: 'Derived from current inventory quantity.' },
    { Field: 'Calendar Summary', Meaning: 'Daily movement summary generated by the Calendar feature.' },
    { Field: 'Calendar Details', Meaning: 'Synthetic inventory movement events used by the Calendar feature.' },
  ];
}

export function getRevenueTotals(items: InventoryItem[]) {
  return PERIODS.reduce(
    (acc, period) => ({
      ...acc,
      [period]: buildRevenueSummary(items, period).reduce((sum, row) => sum + row.revenueCents, 0),
    }),
    {} as Record<RevenuePeriod, number>
  );
}

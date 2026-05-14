import { describe, expect, it } from 'vitest';
import type { InventoryItem } from '@/features/inventory/inventory.types';
import {
  buildCalendarDetailRows,
  buildCalendarSummaryRows,
  buildInventoryDetailRows,
  buildRevenueDictionaryRows,
  buildRevenueExportData,
  buildRevenueOverviewRows,
  buildRevenueSummary,
  getRevenuePeriodKey,
  toCategoryWorksheetRows,
  toCalendarDetailWorksheetRows,
  toCalendarSummaryWorksheetRows,
  toInventoryDetailWorksheetRows,
  toSourceWorksheetRows,
  toWorksheetRows,
} from '../revenueExport';

const items: InventoryItem[] = [
  {
    id: '1',
    nameKey: 'item.a',
    categoryKey: 'category.outerwear',
    quantity: 2,
    unitPrice: 1000,
    createdAt: new Date('2026-01-01T00:00:00Z').getTime(),
    updatedAt: new Date('2026-01-15T08:00:00Z').getTime(),
  },
  {
    id: '2',
    nameKey: 'item.b',
    categoryKey: 'category.pants',
    quantity: 3,
    unitPrice: 2000,
    createdAt: new Date('2026-01-01T00:00:00Z').getTime(),
    updatedAt: new Date('2026-01-20T08:00:00Z').getTime(),
  },
  {
    id: '3',
    nameKey: 'item.c',
    categoryKey: 'category.shoes',
    quantity: 1,
    unitPrice: 5000,
    createdAt: new Date('2026-04-01T00:00:00Z').getTime(),
    updatedAt: new Date('2026-04-02T08:00:00Z').getTime(),
  },
];

describe('getRevenuePeriodKey', () => {
  it('formats day, month and quarter keys from updatedAt timestamps', () => {
    const timestamp = new Date('2026-05-14T12:30:00Z').getTime();

    expect(getRevenuePeriodKey(timestamp, 'day')).toBe('2026-05-14');
    expect(getRevenuePeriodKey(timestamp, 'month')).toBe('2026-05');
    expect(getRevenuePeriodKey(timestamp, 'quarter')).toBe('2026-Q2');
  });
});

describe('buildRevenueSummary', () => {
  it('groups revenue by month', () => {
    const result = buildRevenueSummary(items, 'month');

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      periodType: 'month',
      period: '2026-01',
      revenueCents: 8000,
      quantity: 5,
      itemCount: 2,
    });
    expect(result[1]).toMatchObject({
      period: '2026-04',
      revenueCents: 5000,
    });
  });

  it('maps summaries to worksheet-friendly rows', () => {
    const [row] = toWorksheetRows(buildRevenueSummary(items.slice(0, 1), 'day'));

    expect(row).toMatchObject({
      Period: '2026-01-15',
      'Period Type': 'day',
      Revenue: 20,
      'Revenue (cents)': 2000,
      Quantity: 2,
      'Item Count': 1,
      'Average Revenue per Item': 20,
      'Average Unit Price': 10,
    });
  });
});

describe('buildRevenueExportData', () => {
  it('builds all summary sheets and source rows', () => {
    const result = buildRevenueExportData(items, (item) => ({
      itemName: item.nameKey,
      category: item.categoryKey,
    }));

    expect(result.day).toHaveLength(3);
    expect(result.month).toHaveLength(2);
    expect(result.quarter).toHaveLength(2);
    expect(result.categories).toHaveLength(3);
    expect(result.categories[0]).toMatchObject({
      category: 'category.pants',
      categoryKey: 'category.pants',
      revenueCents: 6000,
      quantity: 3,
      averageUnitPriceCents: 2000,
    });
    expect(result.sourceItems[0]).toMatchObject({
      itemId: '1',
      itemName: 'item.a',
      itemNameKey: 'item.a',
      category: 'category.outerwear',
      categoryKey: 'category.outerwear',
      unitPrice: 10,
      unitPriceCents: 1000,
      revenue: 20,
      revenueCents: 2000,
      dayPeriod: '2026-01-15',
      monthPeriod: '2026-01',
      quarterPeriod: '2026-Q1',
    });
  });
});

describe('detailed workbook rows', () => {
  it('builds overview rows with calculation details', () => {
    const result = buildRevenueOverviewRows(items, new Date('2026-05-14T00:00:00Z').getTime());

    expect(result).toContainEqual({ Metric: 'Generated At', Value: '2026-05-14T00:00:00.000Z' });
    expect(result).toContainEqual({ Metric: 'Grouping Date', Value: 'InventoryItem.updatedAt' });
    expect(result).toContainEqual({ Metric: 'Source Item Count', Value: 3 });
    expect(result).toContainEqual({ Metric: 'Total Revenue (cents)', Value: 13000 });
  });

  it('maps category and source rows for Excel output', () => {
    const data = buildRevenueExportData(items, (item) => ({
      itemName: item.nameKey,
      category: item.categoryKey,
    }));
    const [category] = toCategoryWorksheetRows(data.categories);
    const [source] = toSourceWorksheetRows(data.sourceItems);

    expect(category).toMatchObject({
      Category: 'category.pants',
      'Category Key': 'category.pants',
      Revenue: 60,
      'Revenue (cents)': 6000,
      Quantity: 3,
    });
    expect(source).toMatchObject({
      'Item ID': '1',
      'Item Name': 'item.a',
      'Item Name Key': 'item.a',
      'Daily Period': '2026-01-15',
      'Created At': '2026-01-01T00:00:00.000Z',
      'Updated At': '2026-01-15T08:00:00.000Z',
    });
  });

  it('documents exported fields', () => {
    expect(buildRevenueDictionaryRows()).toEqual(
      expect.arrayContaining([
        { Field: 'Revenue (cents)', Meaning: 'Raw integer amount used by the app.' },
        { Field: 'Quarterly Period', Meaning: 'YYYY-QN derived from InventoryItem.updatedAt.' },
        { Field: 'Calendar Summary', Meaning: 'Daily movement summary generated by the Calendar feature.' },
      ])
    );
  });
});

describe('inventory and calendar export sectors', () => {
  it('builds inventory detail rows', () => {
    const rows = buildInventoryDetailRows(items, (item) => ({
      itemName: item.nameKey,
      category: item.categoryKey,
    }));
    const worksheetRows = toInventoryDetailWorksheetRows(rows);

    expect(rows).toHaveLength(3);
    expect(worksheetRows[0]).toMatchObject({
      'Item ID': '1',
      'Item Name': 'item.a',
      Quantity: 2,
      'Total Value': 20,
      'Stock Status': 'lowStock',
    });
  });

  it('builds calendar summary and detail rows from the same calendar event logic', () => {
    const now = new Date('2026-05-14T00:00:00Z').getTime();
    const summaryRows = buildCalendarSummaryRows(items, now);
    const detailRows = buildCalendarDetailRows(
      items,
      (item) => ({
        itemName: item.nameKey,
        category: item.categoryKey,
      }),
      now
    );

    expect(summaryRows.length).toBeGreaterThan(0);
    expect(detailRows.length).toBeGreaterThan(0);
    expect(toCalendarSummaryWorksheetRows(summaryRows)[0]).toHaveProperty('Transaction Count');
    expect(toCalendarDetailWorksheetRows(detailRows)[0]).toMatchObject({
      'Item ID': expect.any(String),
      Direction: expect.stringMatching(/in|out/),
      'Total Value (cents)': expect.any(Number),
    });
  });
});

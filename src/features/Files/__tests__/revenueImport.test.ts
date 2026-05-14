import { describe, expect, it } from 'vitest';
import { parseRevenueRows, summarizeImportedRevenue } from '../revenueImport';

describe('parseRevenueRows', () => {
  it('parses valid rows and defaults missing period type to day', () => {
    const result = parseRevenueRows([
      { date: '2026-05-14', periodType: 'month', revenue: '123.45', source: 'manual' },
      { Date: '2026-05-15', Revenue: 50 },
      { date: '2026-Q2', periodType: 'quarter', revenue: 300 },
    ]);

    expect(result.errors).toEqual([]);
    expect(result.rows).toEqual([
      {
        date: '2026-05-14',
        periodType: 'month',
        revenueCents: 12345,
        source: 'manual',
        note: undefined,
      },
      {
        date: '2026-05-15',
        periodType: 'day',
        revenueCents: 5000,
        source: undefined,
        note: undefined,
      },
      {
        date: '2026-Q2',
        periodType: 'quarter',
        revenueCents: 30000,
        source: undefined,
        note: undefined,
      },
    ]);
  });

  it('reports invalid rows without importing them', () => {
    const result = parseRevenueRows([
      { date: '', periodType: 'day', revenue: 10 },
      { date: '2026-05-14', periodType: 'year', revenue: 10 },
      { date: '2026-05-14', periodType: 'day', revenue: 'not a number' },
    ]);

    expect(result.rows).toEqual([]);
    expect(result.errors).toEqual([
      { rowNumber: 2, message: 'Missing or invalid date.' },
      { rowNumber: 3, message: 'Invalid period type.' },
      { rowNumber: 4, message: 'Missing or invalid revenue.' },
    ]);
  });
});

describe('summarizeImportedRevenue', () => {
  it('aggregates imported rows by period type and date', () => {
    const parsed = parseRevenueRows([
      { date: '2026-05', periodType: 'month', revenue: 100 },
      { date: '2026-05', periodType: 'month', revenue: 50 },
      { date: '2026-05-14', periodType: 'day', revenue: 25 },
      { date: '2026-Q2', periodType: 'quarter', revenue: 300 },
    ]);

    const result = summarizeImportedRevenue(parsed.rows);

    expect(result).toHaveLength(3);
    expect(result.find((row) => row.periodType === 'month')).toMatchObject({
      period: '2026-05',
      revenueCents: 15000,
      itemCount: 2,
    });
    expect(result.find((row) => row.periodType === 'quarter')).toMatchObject({
      period: '2026-Q2',
      revenueCents: 30000,
      itemCount: 1,
    });
  });
});

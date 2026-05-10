import { describe, expect, it } from 'vitest';
import type { CalendarDaySummary, InventoryChangeEvent } from '../calendar.types';
import {
  buildDailySummaries,
  getDefaultDateKey,
  getLast30DaysSeries,
  getTodayDateKey,
} from '../calendar.utils';

const events: InventoryChangeEvent[] = [
  {
    id: '1',
    itemId: 'item-1',
    nameKey: 'item.alpha',
    categoryKey: 'category.outerwear',
    dateKey: '2026-05-08',
    timestamp: new Date(2026, 4, 8, 9, 0).getTime(),
    direction: 'in',
    quantity: 10,
    unitPrice: 1000,
    totalValue: 10000,
  },
  {
    id: '2',
    itemId: 'item-1',
    nameKey: 'item.alpha',
    categoryKey: 'category.outerwear',
    dateKey: '2026-05-08',
    timestamp: new Date(2026, 4, 8, 11, 0).getTime(),
    direction: 'out',
    quantity: 4,
    unitPrice: 1200,
    totalValue: 4800,
  },
  {
    id: '3',
    itemId: 'item-2',
    nameKey: 'item.beta',
    categoryKey: 'category.shirt',
    dateKey: '2026-04-30',
    timestamp: new Date(2026, 3, 30, 14, 30).getTime(),
    direction: 'in',
    quantity: 6,
    unitPrice: 800,
    totalValue: 4800,
  },
];

describe('buildDailySummaries', () => {
  it('aggregates inbound, outbound, net quantity and average deal price per day', () => {
    const summaries = buildDailySummaries(events);

    expect(summaries).toHaveLength(2);
    expect(summaries[0].dateKey).toBe('2026-04-30');
    expect(summaries[1]).toMatchObject({
      dateKey: '2026-05-08',
      inboundQty: 10,
      outboundQty: 4,
      netQty: 6,
      totalValue: 14800,
      dealCount: 2,
      avgDealPrice: 1057,
    });
  });
});

describe('getDefaultDateKey', () => {
  const summaries: CalendarDaySummary[] = buildDailySummaries(events);

  it('prefers the latest day within the active month', () => {
    expect(getDefaultDateKey(summaries, new Date(2026, 4, 1))).toBe('2026-05-08');
  });

  it('falls back to the latest available day when the month has no activity', () => {
    expect(getDefaultDateKey(summaries, new Date(2026, 2, 1))).toBe('2026-05-08');
  });
});

describe('getTodayDateKey', () => {
  it('normalizes the current timestamp to a yyyy-mm-dd key', () => {
    const now = new Date(2026, 4, 10, 22, 45, 33).getTime();
    expect(getTodayDateKey(now)).toBe('2026-05-10');
  });
});

describe('getLast30DaysSeries', () => {
  it('fills missing days with zero values and keeps known days intact', () => {
    const summaries = buildDailySummaries(events);
    const series = getLast30DaysSeries(summaries, '2026-05-08', 'en');

    expect(series).toHaveLength(30);
    expect(series[0].dateKey).toBe('2026-04-09');
    expect(series[series.length - 1]).toMatchObject({
      dateKey: '2026-05-08',
      inboundQty: 10,
      outboundQty: 4,
      netQty: 6,
    });
    expect(series.find((day) => day.dateKey === '2026-05-01')).toMatchObject({
      inboundQty: 0,
      outboundQty: 0,
      netQty: 0,
    });
  });
});

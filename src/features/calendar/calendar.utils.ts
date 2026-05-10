import type { InventoryItem } from '@/features/inventory/inventory.types';
import type { CalendarDaySummary, InventoryChangeDirection, InventoryChangeEvent } from './calendar.types';

const EVENT_DAY_OFFSETS = [58, 47, 36, 25, 16, 8, 2];

function startOfDay(timestamp: number) {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function seedFromString(value: string) {
  let seed = 0;
  for (let index = 0; index < value.length; index += 1) {
    seed = (seed * 31 + value.charCodeAt(index)) >>> 0;
  }
  return seed;
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatMonthKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  return `${year}-${month}`;
}

export function getMonthLabel(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
  }).format(date);
}

export function getWeekdayLabels(locale: string) {
  const base = new Date(2026, 0, 4);
  return Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(addDays(base, index))
  );
}

export function getCalendarDays(monthDate: Date) {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const gridStart = addDays(firstDay, -firstDay.getDay());
  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
}

function getEventDirection(seed: number, index: number): InventoryChangeDirection {
  return (seed + index * 3) % 5 < 2 ? 'out' : 'in';
}

function getEventQuantity(item: InventoryItem, seed: number, index: number) {
  const ratio = 0.04 + (((seed >> (index % 8)) & 7) + index) * 0.01;
  return clamp(Math.round(item.quantity * ratio), 1, Math.max(item.quantity * 2, 1200));
}

function getEventPrice(unitPrice: number, seed: number, index: number) {
  const drift = 0.82 + (((seed + index * 13) % 28) - 8) / 100;
  return Math.max(100, Math.round(unitPrice * drift));
}

export function buildInventoryHistory(items: InventoryItem[], now = Date.now()) {
  const today = startOfDay(now);
  const events: InventoryChangeEvent[] = [];

  for (const item of items) {
    const seed = seedFromString(`${item.id}-${item.nameKey}-${item.categoryKey}`);
    const eventCount = 4 + (seed % 4);
    const offsets = EVENT_DAY_OFFSETS.slice(EVENT_DAY_OFFSETS.length - eventCount);

    offsets.forEach((baseOffset, index) => {
      const dayOffset = Math.max(0, baseOffset + ((seed + index) % 3) - 1);
      const date = addDays(today, -dayOffset);
      const hour = 9 + ((seed + index * 5) % 9);
      const minute = ((seed >> (index % 6)) % 4) * 15 + ((seed + index) % 2) * 5;
      const timestamp = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hour,
        minute,
        0,
        0
      ).getTime();
      const quantity = getEventQuantity(item, seed, index);
      const unitPrice = getEventPrice(item.unitPrice, seed, index);

      events.push({
        id: `${item.id}-${index}-${dayOffset}`,
        itemId: item.id,
        nameKey: item.nameKey,
        categoryKey: item.categoryKey,
        dateKey: formatDateKey(date),
        timestamp,
        direction: getEventDirection(seed, index),
        quantity,
        unitPrice,
        totalValue: quantity * unitPrice,
      });
    });
  }

  return events.sort((left, right) => left.timestamp - right.timestamp);
}

export function buildDailySummaries(events: InventoryChangeEvent[]) {
  const map = new Map<string, InventoryChangeEvent[]>();

  for (const event of events) {
    const bucket = map.get(event.dateKey) ?? [];
    bucket.push(event);
    map.set(event.dateKey, bucket);
  }

  return Array.from(map.entries())
    .map(([dateKey, dayEvents]): CalendarDaySummary => {
      const inboundQty = dayEvents
        .filter((event) => event.direction === 'in')
        .reduce((sum, event) => sum + event.quantity, 0);
      const outboundQty = dayEvents
        .filter((event) => event.direction === 'out')
        .reduce((sum, event) => sum + event.quantity, 0);
      const totalValue = dayEvents.reduce((sum, event) => sum + event.totalValue, 0);
      const totalQuantity = dayEvents.reduce((sum, event) => sum + event.quantity, 0);

      return {
        dateKey,
        date: parseDateKey(dateKey),
        events: [...dayEvents].sort((left, right) => left.timestamp - right.timestamp),
        inboundQty,
        outboundQty,
        netQty: inboundQty - outboundQty,
        totalValue,
        dealCount: dayEvents.length,
        avgDealPrice: totalQuantity > 0 ? Math.round(totalValue / totalQuantity) : 0,
      };
    })
    .sort((left, right) => left.date.getTime() - right.date.getTime());
}

export function getDefaultDateKey(summaries: CalendarDaySummary[], monthDate: Date) {
  const monthKey = formatMonthKey(monthDate);
  const inMonth = summaries.filter((summary) => summary.dateKey.startsWith(monthKey));
  const candidates = inMonth.length > 0 ? inMonth : summaries;
  return candidates[candidates.length - 1]?.dateKey ?? formatDateKey(startOfDay(Date.now()));
}

export function formatCompactNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    notation: Math.abs(value) >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: Math.abs(value) >= 1000 ? 1 : 0,
  }).format(value);
}

export function formatSignedNumber(value: number, locale: string) {
  return `${value > 0 ? '+' : value < 0 ? '-' : ''}${new Intl.NumberFormat(locale).format(
    Math.abs(value)
  )}`;
}

export function formatShortTime(timestamp: number, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp);
}

export function getLast30DaysSeries(summaries: CalendarDaySummary[], endDateKey: string, locale: string) {
  const endDate = parseDateKey(endDateKey);
  const summaryMap = new Map(summaries.map((summary) => [summary.dateKey, summary]));

  return Array.from({ length: 30 }, (_, index) => {
    const date = addDays(endDate, index - 29);
    const dateKey = formatDateKey(date);
    const summary = summaryMap.get(dateKey);

    return {
      dateKey,
      label: new Intl.DateTimeFormat(locale, { month: 'numeric', day: 'numeric' }).format(date),
      inboundQty: summary?.inboundQty ?? 0,
      outboundQty: summary?.outboundQty ?? 0,
      netQty: summary?.netQty ?? 0,
    };
  });
}

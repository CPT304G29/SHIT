import type { TFunction } from 'i18next';
import type { CalendarDaySummary } from './calendar.types';

export interface CalendarSelectedDayCharts {
  flowData: Array<{ name: string; value: number; fill: string }>;
  categoryData: Array<{ name: string; value: number }>;
  priceTrend: Array<{ time: string; avgPrice: number; price: number }>;
  itemChangeData: Array<{ name: string; value: number }>;
}

export interface CalendarSelectedDayInfo {
  dateLabel: string;
  dateMeta: string;
}

export function buildSelectedDayCharts(
  selectedDay: CalendarDaySummary | undefined,
  t: TFunction,
  locale: string
): CalendarSelectedDayCharts {
  if (!selectedDay) {
    return {
      flowData: [
        { name: t('calendar.inbound'), value: 0, fill: '#1E8E3E' },
        { name: t('calendar.outbound'), value: 0, fill: '#E50012' },
      ],
      categoryData: [],
      priceTrend: [],
      itemChangeData: [],
    };
  }

  const flowData = [
    { name: t('calendar.inbound'), value: selectedDay.inboundQty, fill: '#1E8E3E' },
    { name: t('calendar.outbound'), value: selectedDay.outboundQty, fill: '#E50012' },
  ];

  const categoryMap = new Map<string, number>();
  const itemNetMap = new Map<string, number>();
  let runningValue = 0;

  const priceTrend = selectedDay.events.map((event, index) => {
    runningValue += event.unitPrice;
    const signedQuantity = event.direction === 'in' ? event.quantity : -event.quantity;
    itemNetMap.set(event.nameKey, (itemNetMap.get(event.nameKey) ?? 0) + signedQuantity);
    categoryMap.set(
      event.categoryKey,
      (categoryMap.get(event.categoryKey) ?? 0) + Math.abs(event.quantity)
    );

    return {
      time: new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' }).format(
        event.timestamp
      ),
      avgPrice: Math.round(runningValue / (index + 1)),
      price: event.unitPrice,
    };
  });

  const categoryData = Array.from(categoryMap.entries())
    .map(([categoryKey, value]) => ({
      name: t(categoryKey),
      value,
    }))
    .sort((left, right) => right.value - left.value);

  const itemChangeData = Array.from(itemNetMap.entries())
    .map(([nameKey, value]) => ({
      name: t(nameKey),
      value,
    }))
    .sort((left, right) => Math.abs(right.value) - Math.abs(left.value))
    .slice(0, 6);

  return {
    flowData,
    categoryData,
    priceTrend,
    itemChangeData,
  };
}

export function getSelectedDaySummary(date: Date, locale: string): CalendarSelectedDayInfo {
  return {
    dateLabel: new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }).format(date),
    dateMeta: new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date),
  };
}

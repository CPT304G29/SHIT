import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useInventoryStore } from '@/features/inventory/inventory.store';
import { formatCurrency } from '@/features/inventory/inventory.utils';
import { ChartCard } from '@/features/charts/ChartCard';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import type { CalendarDaySummary, InventoryChangeEvent } from './calendar.types';
import {
  buildDailySummaries,
  buildInventoryHistory,
  formatCompactNumber,
  formatMonthKey,
  formatShortTime,
  formatSignedNumber,
  getCalendarDays,
  getDefaultDateKey,
  getLast30DaysSeries,
  getMonthLabel,
  getTodayDateKey,
  getWeekdayLabels,
  parseDateKey,
} from './calendar.utils';
import {
  badge,
  badgeInbound,
  badgeOutbound,
  calendarCard,
  calendarHeader,
  chartNarrow,
  chartWide,
  chartsGrid,
  dayButton,
  dayButtonActive,
  dayButtonDisabled,
  dayButtonMuted,
  dayButtonSelected,
  dayMeta,
  dayNet,
  dayNumber,
  detailTable,
  detailsColumn,
  emptyCard,
  hero,
  heroPanel,
  heroStats,
  heroSubtitle,
  heroTitle,
  iconButton,
  layout,
  monthActions,
  monthGrid,
  monthHint,
  monthTitle,
  negative,
  neutral,
  page,
  panelEyebrow,
  positive,
  selectedDate,
  selectedMeta,
  selectedMetric,
  selectedMetricLabel,
  selectedMetricValue,
  statCard,
  statLabel,
  statMeta,
  statValue,
  summaryPanel,
  tableCard,
  tableCell,
  tableCellBlank,
  tableCellMuted,
  tableCellStrong,
  tableFooter,
  tableFooterHint,
  tableHeadCell,
  tableHeader,
  pageButton,
  pageIndicator,
  pagination,
  tableSubtitle,
  tableTitle,
  tableWrap,
  weekdayCell,
  weekdayRow,
} from './CalendarPage.css';

const PIE_COLORS = ['#E50012', '#FF6B7A', '#FF9AA3', '#FFB8BE', '#FFD1D5', '#FFE8EA'];
const DETAIL_PAGE_SIZE = 10;

function getSignedToneClass(value: number) {
  if (value > 0) return positive;
  if (value < 0) return negative;
  return neutral;
}

function GlassTooltip({
  active,
  payload,
  label,
  isDark,
  formatter,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string;
  isDark?: boolean;
  formatter?: (value: number, name?: string) => string;
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        background: isDark ? 'rgba(18,18,18,0.9)' : 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
        borderRadius: 12,
        padding: '10px 14px',
        boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(0,0,0,0.08)',
        fontSize: 12,
        color: isDark ? '#F5F5F5' : '#1A1A1A',
      }}
    >
      {label && (
        <div style={{ marginBottom: 6, color: isDark ? '#888888' : '#666666', fontSize: 11 }}>
          {label}
        </div>
      )}
      {payload.map((entry) => (
        <div
          key={`${entry.name}-${entry.value}`}
          style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              backgroundColor: entry.color ?? '#E50012',
              flexShrink: 0,
            }}
          />
          <span style={{ color: isDark ? '#BBBBBB' : '#666666' }}>{entry.name}</span>
          <strong style={{ marginLeft: 'auto' }}>
            {formatter && typeof entry.value === 'number'
              ? formatter(entry.value, entry.name)
              : entry.value}
          </strong>
        </div>
      ))}
    </div>
  );
}

function buildSelectedDayCharts(
  selectedDay: CalendarDaySummary | undefined,
  t: (key: string) => string,
  locale: string
) {
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

function getSelectedDaySummary(date: Date, locale: string) {
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

export function CalendarPage() {
  const { t, i18n } = useTranslation();
  const items = useInventoryStore((state) => state.items);
  const theme = useCurrentTheme();
  const isDark = theme === 'dark';
  const calendarCardRef = useRef<HTMLDivElement | null>(null);
  const detailHeaderRef = useRef<HTMLDivElement | null>(null);
  const detailTableHeadRef = useRef<HTMLTableSectionElement | null>(null);
  const detailFooterRef = useRef<HTMLDivElement | null>(null);

  const [monthDate, setMonthDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const events = useMemo(() => buildInventoryHistory(items), [items]);
  const summaries = useMemo(() => buildDailySummaries(events), [events]);
  const summaryMap = useMemo(
    () => new Map(summaries.map((summary) => [summary.dateKey, summary])),
    [summaries]
  );
  const todayDateKey = useMemo(() => getTodayDateKey(), []);

  const [selectedDateKey, setSelectedDateKey] = useState(() => getDefaultDateKey(summaries, monthDate));
  const [detailPage, setDetailPage] = useState(1);
  const [detailRowHeight, setDetailRowHeight] = useState<number | null>(null);

  useEffect(() => {
    if (selectedDateKey > todayDateKey) {
      setSelectedDateKey(getDefaultDateKey(summaries, monthDate));
      return;
    }

    if (!summaryMap.has(selectedDateKey)) {
      const selectedMonthKey = selectedDateKey.slice(0, 7);
      if (selectedMonthKey === formatMonthKey(monthDate)) {
        return;
      }
      setSelectedDateKey(getDefaultDateKey(summaries, monthDate));
    }
  }, [monthDate, selectedDateKey, summaries, summaryMap, todayDateKey]);

  useEffect(() => {
    setDetailPage(1);
  }, [selectedDateKey]);

  const selectedDay = summaryMap.get(selectedDateKey);
  const selectedDateValue = useMemo(() => parseDateKey(selectedDateKey), [selectedDateKey]);
  const selectedDayInfo = useMemo(
    () => getSelectedDaySummary(selectedDateValue, i18n.language),
    [i18n.language, selectedDateValue]
  );
  const chartData = useMemo(
    () => buildSelectedDayCharts(selectedDay, t, i18n.language),
    [i18n.language, selectedDay, t]
  );

  const monthKey = formatMonthKey(monthDate);
  const monthSummaries = summaries.filter((summary) => summary.dateKey.startsWith(monthKey));
  const monthInbound = monthSummaries.reduce((sum, summary) => sum + summary.inboundQty, 0);
  const monthOutbound = monthSummaries.reduce((sum, summary) => sum + summary.outboundQty, 0);
  const monthNet = monthInbound - monthOutbound;
  const monthDeals = monthSummaries.reduce((sum, summary) => sum + summary.dealCount, 0);
  const last30Days = useMemo(
    () => getLast30DaysSeries(summaries, selectedDateKey, i18n.language),
    [i18n.language, selectedDateKey, summaries]
  );
  const weekdayLabels = useMemo(() => getWeekdayLabels(i18n.language), [i18n.language]);
  const calendarDays = useMemo(() => getCalendarDays(monthDate), [monthDate]);
  const detailEvents = selectedDay?.events ?? [];
  const detailTotalPages = Math.max(1, Math.ceil(detailEvents.length / DETAIL_PAGE_SIZE));
  const detailPageSafe = Math.min(detailPage, detailTotalPages);
  const currentDetailEvents = detailEvents.slice(
    (detailPageSafe - 1) * DETAIL_PAGE_SIZE,
    detailPageSafe * DETAIL_PAGE_SIZE
  );
  const detailPlaceholderRows = Math.max(0, DETAIL_PAGE_SIZE - currentDetailEvents.length);

  useEffect(() => {
    const measure = () => {
      const calendarHeight = calendarCardRef.current?.getBoundingClientRect().height ?? 0;
      const detailHeaderHeight = detailHeaderRef.current?.getBoundingClientRect().height ?? 0;
      const detailHeadHeight = detailTableHeadRef.current?.getBoundingClientRect().height ?? 0;
      const detailFooterHeight = detailFooterRef.current?.getBoundingClientRect().height ?? 0;

      if (!calendarHeight || !detailHeadHeight) {
        return;
      }

      const availableHeight =
        calendarHeight - detailHeaderHeight - detailHeadHeight - detailFooterHeight - 2;
      const nextRowHeight = Math.max(44, Math.floor(availableHeight / DETAIL_PAGE_SIZE));
      setDetailRowHeight(nextRowHeight);
    };

    measure();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(() => {
      measure();
    });

    if (calendarCardRef.current) observer.observe(calendarCardRef.current);
    if (detailHeaderRef.current) observer.observe(detailHeaderRef.current);
    if (detailTableHeadRef.current) observer.observe(detailTableHeadRef.current);
    if (detailFooterRef.current) observer.observe(detailFooterRef.current);

    return () => observer.disconnect();
  }, [detailEvents.length, detailPageSafe, i18n.language, monthDate]);

  if (items.length === 0) {
    return <div className={emptyCard}>{t('table.emptyState')}</div>;
  }

  return (
    <div className={page}>
      <section className={hero}>
        <div className={heroPanel}>
          <span className={panelEyebrow}>{t('nav.calendar')}</span>
          <div className={heroTitle}>{t('calendar.title')}</div>
          <p className={heroSubtitle}>{t('calendar.subtitle')}</p>
          <div className={heroStats}>
            <div className={statCard}>
              <span className={statLabel}>{t('calendar.monthNet')}</span>
              <span className={`${statValue} ${getSignedToneClass(monthNet)}`}>
                {formatSignedNumber(monthNet, i18n.language)}
              </span>
              <span className={statMeta}>{t('calendar.currentMonth')}</span>
            </div>
            <div className={statCard}>
              <span className={statLabel}>{t('calendar.monthFlow')}</span>
              <span className={statValue}>
                {new Intl.NumberFormat(i18n.language).format(monthInbound + monthOutbound)}
              </span>
              <span className={statMeta}>
                {t('calendar.inbound')}: {new Intl.NumberFormat(i18n.language).format(monthInbound)} /{' '}
                {t('calendar.outbound')}: {new Intl.NumberFormat(i18n.language).format(monthOutbound)}
              </span>
            </div>
            <div className={statCard}>
              <span className={statLabel}>{t('calendar.monthDeals')}</span>
              <span className={statValue}>{new Intl.NumberFormat(i18n.language).format(monthDeals)}</span>
              <span className={statMeta}>{t('calendar.syntheticHint')}</span>
            </div>
          </div>
        </div>

        <aside className={summaryPanel}>
          <span className={panelEyebrow}>{t('calendar.selectedDay')}</span>
          <div className={selectedDate}>{selectedDayInfo.dateLabel}</div>
          <div style={{ color: isDark ? '#888888' : '#666666', fontSize: 13 }}>
            {selectedDayInfo.dateMeta}
          </div>
          <div className={selectedMeta}>
            <div className={selectedMetric}>
              <span className={selectedMetricLabel}>{t('calendar.netChange')}</span>
              <span className={`${selectedMetricValue} ${getSignedToneClass(selectedDay?.netQty ?? 0)}`}>
                {formatSignedNumber(selectedDay?.netQty ?? 0, i18n.language)}
              </span>
            </div>
            <div className={selectedMetric}>
              <span className={selectedMetricLabel}>{t('calendar.transactions')}</span>
              <span className={selectedMetricValue}>
                {new Intl.NumberFormat(i18n.language).format(selectedDay?.dealCount ?? 0)}
              </span>
            </div>
            <div className={selectedMetric}>
              <span className={selectedMetricLabel}>{t('calendar.avgDealPrice')}</span>
              <span className={selectedMetricValue}>
                {formatCurrency(selectedDay?.avgDealPrice ?? 0, i18n.language)}
              </span>
            </div>
            <div className={selectedMetric}>
              <span className={selectedMetricLabel}>{t('calendar.totalValue')}</span>
              <span className={selectedMetricValue}>
                {formatCurrency(selectedDay?.totalValue ?? 0, i18n.language)}
              </span>
            </div>
          </div>
        </aside>
      </section>

      <section className={layout}>
        <div className={calendarCard} ref={calendarCardRef}>
          <div className={calendarHeader}>
            <div>
              <div className={monthTitle} data-testid="calendar-month-title">
                {getMonthLabel(monthDate, i18n.language)}
              </div>
              <div className={monthHint}>{t('calendar.monthHint')}</div>
            </div>
            <div className={monthActions}>
              <button
                type="button"
                className={iconButton}
                aria-label={t('calendar.previousMonth')}
                onClick={() =>
                  setMonthDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
                }
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className={iconButton}
                aria-label={t('calendar.nextMonth')}
                onClick={() =>
                  setMonthDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
                }
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className={weekdayRow}>
            {weekdayLabels.map((label) => (
              <div key={label} className={weekdayCell}>
                {label}
              </div>
            ))}
          </div>

          <div className={monthGrid} data-testid="calendar-grid">
            {calendarDays.map((date) => {
              const dateKey = `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`;
              const summary = summaryMap.get(dateKey);
              const isCurrentMonth = date.getMonth() === monthDate.getMonth();
              const isSelected = dateKey === selectedDateKey;
              const isFuture = dateKey > todayDateKey;
              const netQty = summary?.netQty ?? 0;

              return (
                <button
                  key={dateKey}
                  type="button"
                  disabled={isFuture}
                  data-testid={`calendar-day-${dateKey}`}
                  data-date-key={dateKey}
                  data-in-month={isCurrentMonth ? 'true' : 'false'}
                  className={[
                    dayButton,
                    !isCurrentMonth ? dayButtonMuted : '',
                    isFuture ? dayButtonDisabled : '',
                    summary ? dayButtonActive : '',
                    isSelected ? dayButtonSelected : '',
                  ].join(' ')}
                  onClick={() => {
                    if (isFuture) return;
                    if (!isCurrentMonth) {
                      setMonthDate(new Date(date.getFullYear(), date.getMonth(), 1));
                    }
                    setSelectedDateKey(dateKey);
                  }}
                >
                  <span className={dayNumber}>{date.getDate()}</span>
                  <span className={`${dayNet} ${getSignedToneClass(netQty)}`}>
                    {summary ? formatSignedNumber(netQty, i18n.language) : '0'}
                  </span>
                  <span className={dayMeta}>
                    <span>
                      {t('calendar.inboundShort')} {formatCompactNumber(summary?.inboundQty ?? 0, i18n.language)}
                    </span>
                    <span>
                      {t('calendar.outboundShort')}{' '}
                      {formatCompactNumber(summary?.outboundQty ?? 0, i18n.language)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={detailsColumn}>
          <div className={tableCard}>
            <div className={tableHeader} ref={detailHeaderRef}>
              <div className={tableTitle}>{t('calendar.detailTitle')}</div>
              <div className={tableSubtitle}>{t('calendar.detailSubtitle')}</div>
            </div>

            <div className={tableWrap}>
              <table className={detailTable}>
                <thead ref={detailTableHeadRef}>
                  <tr>
                    <th className={tableHeadCell}>{t('calendar.time')}</th>
                    <th className={tableHeadCell}>{t('table.itemName')}</th>
                    <th className={tableHeadCell}>{t('table.category')}</th>
                    <th className={tableHeadCell}>{t('calendar.direction')}</th>
                    <th className={tableHeadCell}>{t('table.quantity')}</th>
                    <th className={tableHeadCell}>{t('table.unitPrice')}</th>
                    <th className={tableHeadCell}>{t('calendar.amount')}</th>
                  </tr>
                </thead>
                <tbody data-testid="calendar-detail-body">
                  {currentDetailEvents.map((event: InventoryChangeEvent) => (
                    <tr
                      key={event.id}
                      data-testid="calendar-detail-row"
                      style={detailRowHeight ? { height: `${detailRowHeight}px` } : undefined}
                    >
                      <td className={`${tableCell} ${tableCellMuted}`}>
                        {formatShortTime(event.timestamp, i18n.language)}
                      </td>
                      <td className={`${tableCell} ${tableCellStrong}`}>{t(event.nameKey)}</td>
                      <td className={tableCell}>{t(event.categoryKey)}</td>
                      <td className={tableCell}>
                        <span
                          className={[
                            badge,
                            event.direction === 'in' ? badgeInbound : badgeOutbound,
                          ].join(' ')}
                        >
                          {event.direction === 'in' ? t('calendar.inbound') : t('calendar.outbound')}
                        </span>
                      </td>
                      <td
                        className={`${tableCell} ${getSignedToneClass(
                          event.direction === 'in' ? event.quantity : -event.quantity
                        )}`}
                      >
                        {event.direction === 'in'
                          ? formatSignedNumber(event.quantity, i18n.language)
                          : formatSignedNumber(-event.quantity, i18n.language)}
                      </td>
                      <td className={tableCell}>{formatCurrency(event.unitPrice, i18n.language)}</td>
                      <td className={`${tableCell} ${tableCellStrong}`}>
                        {formatCurrency(event.totalValue, i18n.language)}
                      </td>
                    </tr>
                  ))}
                  {Array.from({ length: detailPlaceholderRows }, (_, index) => (
                    <tr
                      key={`blank-${detailPageSafe}-${index}`}
                      data-testid="calendar-detail-row-blank"
                      style={detailRowHeight ? { height: `${detailRowHeight}px` } : undefined}
                    >
                      <td className={`${tableCell} ${tableCellBlank}`}>-</td>
                      <td className={`${tableCell} ${tableCellBlank}`}>-</td>
                      <td className={`${tableCell} ${tableCellBlank}`}>-</td>
                      <td className={`${tableCell} ${tableCellBlank}`}>-</td>
                      <td className={`${tableCell} ${tableCellBlank}`}>-</td>
                      <td className={`${tableCell} ${tableCellBlank}`}>-</td>
                      <td className={`${tableCell} ${tableCellBlank}`}>-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={tableFooter} ref={detailFooterRef}>
              <div className={tableFooterHint} data-testid="calendar-empty-state">
                {detailEvents.length === 0
                  ? t('calendar.noActivity')
                  : t('calendar.pageSummary', {
                      start: (detailPageSafe - 1) * DETAIL_PAGE_SIZE + 1,
                      end: Math.min(detailPageSafe * DETAIL_PAGE_SIZE, detailEvents.length),
                      total: detailEvents.length,
                    })}
              </div>
              <div className={pagination}>
                <button
                  type="button"
                  className={pageButton}
                  disabled={detailPageSafe <= 1}
                  onClick={() => setDetailPage((pageNumber) => Math.max(1, pageNumber - 1))}
                >
                  {t('calendar.previousPage')}
                </button>
                <div className={pageIndicator} data-testid="calendar-page-indicator">
                  {t('calendar.pageIndicator', {
                    current: detailPageSafe,
                    total: detailTotalPages,
                  })}
                </div>
                <button
                  type="button"
                  className={pageButton}
                  disabled={detailPageSafe >= detailTotalPages}
                  onClick={() =>
                    setDetailPage((pageNumber) => Math.min(detailTotalPages, pageNumber + 1))
                  }
                >
                  {t('calendar.nextPage')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={chartsGrid}>
          <div className={chartNarrow}>
            <ChartCard title={t('calendar.flowChart')}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.flowData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid
                    vertical={false}
                    stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: isDark ? '#888888' : '#666666' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: isDark ? '#888888' : '#666666' }}
                  />
                  <Tooltip
                    cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}
                    content={
                      <GlassTooltip
                        isDark={isDark}
                        formatter={(value) => new Intl.NumberFormat(i18n.language).format(value)}
                      />
                    }
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {chartData.flowData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className={chartWide}>
            <ChartCard title={t('calendar.avgPriceTrend')}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.priceTrend} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                  <CartesianGrid
                    vertical={false}
                    stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: isDark ? '#888888' : '#666666' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    width={72}
                    tick={{ fontSize: 11, fill: isDark ? '#888888' : '#666666' }}
                    tickFormatter={(value: number) => formatCurrency(value, i18n.language)}
                  />
                  <Tooltip
                    content={
                      <GlassTooltip
                        isDark={isDark}
                        formatter={(value) => formatCurrency(value, i18n.language)}
                      />
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="avgPrice"
                    name={t('calendar.avgDealPrice')}
                    stroke="#E50012"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#E50012', strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    name={t('table.unitPrice')}
                    stroke="#FF9AA3"
                    strokeWidth={2}
                    strokeDasharray="6 6"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className={chartNarrow}>
            <ChartCard title={t('calendar.categoryMix')}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="58%"
                    outerRadius="82%"
                    stroke="none"
                    cornerRadius={5}
                  >
                    {chartData.categoryData.map((entry, index) => (
                      <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={
                      <GlassTooltip
                        isDark={isDark}
                        formatter={(value) => new Intl.NumberFormat(i18n.language).format(value)}
                      />
                    }
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className={chartWide}>
            <ChartCard title={t('calendar.itemChangeChart')}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData.itemChangeData}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 24, bottom: 0 }}
                >
                  <CartesianGrid
                    horizontal={false}
                    stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: isDark ? '#888888' : '#666666' }}
                    tickFormatter={(value: number) => formatSignedNumber(value, i18n.language)}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    width={140}
                    tick={{ fontSize: 11, fill: isDark ? '#888888' : '#666666' }}
                  />
                  <Tooltip
                    cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}
                    content={
                      <GlassTooltip
                        isDark={isDark}
                        formatter={(value) => formatSignedNumber(value, i18n.language)}
                      />
                    }
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {chartData.itemChangeData.map((entry) => (
                      <Cell key={entry.name} fill={entry.value >= 0 ? '#1E8E3E' : '#E50012'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className={chartWide}>
            <ChartCard title={t('calendar.monthTrend')}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last30Days} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                  <CartesianGrid
                    vertical={false}
                    stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: isDark ? '#888888' : '#666666' }}
                    minTickGap={18}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: isDark ? '#888888' : '#666666' }}
                  />
                  <Tooltip
                    content={
                      <GlassTooltip
                        isDark={isDark}
                        formatter={(value) => new Intl.NumberFormat(i18n.language).format(value)}
                      />
                    }
                  />
                  <Legend />
                  <Bar dataKey="inboundQty" name={t('calendar.inbound')} fill="#1E8E3E" radius={[6, 6, 0, 0]} />
                  <Bar
                    dataKey="outboundQty"
                    name={t('calendar.outbound')}
                    fill="#E50012"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </section>
    </div>
  );
}

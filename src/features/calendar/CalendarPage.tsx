import { useEffect, useMemo, useState } from 'react';
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
  getWeekdayLabels,
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
  tableCellMuted,
  tableCellStrong,
  tableHeadCell,
  tableHeader,
  tableSubtitle,
  tableTitle,
  tableWrap,
  weekdayCell,
  weekdayRow,
} from './CalendarPage.css';

const PIE_COLORS = ['#E50012', '#FF6B7A', '#FF9AA3', '#FFB8BE', '#FFD1D5', '#FFE8EA'];

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

function buildSelectedDayCharts(selectedDay: CalendarDaySummary, t: (key: string) => string, locale: string) {
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

function getSelectedDaySummary(day: CalendarDaySummary | undefined, locale: string) {
  if (!day) {
    return null;
  }

  return {
    dateLabel: new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }).format(day.date),
    dateMeta: new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(day.date),
  };
}

export function CalendarPage() {
  const { t, i18n } = useTranslation();
  const items = useInventoryStore((state) => state.items);
  const theme = useCurrentTheme();
  const isDark = theme === 'dark';

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

  const [selectedDateKey, setSelectedDateKey] = useState(() => getDefaultDateKey(summaries, monthDate));

  useEffect(() => {
    if (!summaryMap.has(selectedDateKey)) {
      setSelectedDateKey(getDefaultDateKey(summaries, monthDate));
    }
  }, [monthDate, selectedDateKey, summaries, summaryMap]);

  const selectedDay = summaryMap.get(selectedDateKey);
  const selectedDayInfo = getSelectedDaySummary(selectedDay, i18n.language);
  const chartData = useMemo(
    () => (selectedDay ? buildSelectedDayCharts(selectedDay, t, i18n.language) : null),
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
          <div className={selectedDate}>{selectedDayInfo?.dateLabel ?? t('calendar.noActivity')}</div>
          <div style={{ color: isDark ? '#888888' : '#666666', fontSize: 13 }}>
            {selectedDayInfo?.dateMeta ?? t('calendar.selectDateHint')}
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
        <div className={calendarCard}>
          <div className={calendarHeader}>
            <div>
              <div className={monthTitle}>{getMonthLabel(monthDate, i18n.language)}</div>
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

          <div className={monthGrid}>
            {calendarDays.map((date) => {
              const dateKey = `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`;
              const summary = summaryMap.get(dateKey);
              const isCurrentMonth = date.getMonth() === monthDate.getMonth();
              const isSelected = dateKey === selectedDateKey;
              const netQty = summary?.netQty ?? 0;

              return (
                <button
                  key={dateKey}
                  type="button"
                  className={[
                    dayButton,
                    !isCurrentMonth ? dayButtonMuted : '',
                    summary ? dayButtonActive : '',
                    isSelected ? dayButtonSelected : '',
                  ].join(' ')}
                  onClick={() => setSelectedDateKey(dateKey)}
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
            <div className={tableHeader}>
              <div className={tableTitle}>{t('calendar.detailTitle')}</div>
              <div className={tableSubtitle}>{t('calendar.detailSubtitle')}</div>
            </div>

            {!selectedDay || selectedDay.events.length === 0 ? (
              <div className={emptyCard}>{t('calendar.noActivity')}</div>
            ) : (
              <div className={tableWrap}>
                <table className={detailTable}>
                  <thead>
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
                  <tbody>
                    {selectedDay.events.map((event: InventoryChangeEvent) => (
                      <tr key={event.id}>
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
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedDay && chartData && (
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
      )}
    </div>
  );
}

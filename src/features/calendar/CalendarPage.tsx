import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInventoryStore } from '@/features/inventory/inventory.store';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import { useCalendarImportStore } from './calendar.import.store';
import { CalendarCharts } from './CalendarCharts';
import { CalendarDetailTable } from './CalendarDetailTable';
import { CalendarHero } from './CalendarHero';
import { CalendarMonthGrid } from './CalendarMonthGrid';
import { DETAIL_PAGE_SIZE } from './calendar.constants';
import { buildSelectedDayCharts, getSelectedDaySummary } from './calendar.page.utils';
import {
  buildDailySummaries,
  buildInventoryHistory,
  formatMonthKey,
  getCalendarDays,
  getDefaultDateKey,
  getLast30DaysSeries,
  getTodayDateKey,
  getWeekdayLabels,
  parseDateKey,
} from './calendar.utils';
import { detailsColumn, emptyCard, layout, page } from './CalendarPage.css';

export function CalendarPage() {
  const { t, i18n } = useTranslation();
  const items = useInventoryStore((state) => state.items);
  const importedEvents = useCalendarImportStore((state) => state.events);
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
  const [detailPage, setDetailPage] = useState(1);
  const [detailRowHeight, setDetailRowHeight] = useState<number | null>(null);

  const events = useMemo(
    () => [...buildInventoryHistory(items), ...importedEvents].sort((left, right) => left.timestamp - right.timestamp),
    [importedEvents, items]
  );
  const summaries = useMemo(() => buildDailySummaries(events), [events]);
  const summaryMap = useMemo(
    () => new Map(summaries.map((summary) => [summary.dateKey, summary])),
    [summaries]
  );
  const todayDateKey = useMemo(() => getTodayDateKey(), []);

  const [selectedDateKey, setSelectedDateKey] = useState(() => getDefaultDateKey(summaries, monthDate));

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
  const weekdayLabels = useMemo(() => getWeekdayLabels(i18n.language), [i18n.language]);
  const calendarDays = useMemo(() => getCalendarDays(monthDate), [monthDate]);
  const last30Days = useMemo(
    () => getLast30DaysSeries(summaries, selectedDateKey, i18n.language),
    [i18n.language, selectedDateKey, summaries]
  );

  const monthKey = formatMonthKey(monthDate);
  const monthSummaries = summaries.filter((summary) => summary.dateKey.startsWith(monthKey));
  const monthInbound = monthSummaries.reduce((sum, summary) => sum + summary.inboundQty, 0);
  const monthOutbound = monthSummaries.reduce((sum, summary) => sum + summary.outboundQty, 0);
  const monthNet = monthInbound - monthOutbound;
  const monthDeals = monthSummaries.reduce((sum, summary) => sum + summary.dealCount, 0);

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

  const handleSelectDate = (date: Date, dateKey: string, isCurrentMonth: boolean) => {
    if (dateKey > todayDateKey) {
      return;
    }

    if (!isCurrentMonth) {
      setMonthDate(new Date(date.getFullYear(), date.getMonth(), 1));
    }

    setSelectedDateKey(dateKey);
  };

  return (
    <div className={page}>
      <CalendarHero
        t={t}
        locale={i18n.language}
        isDark={isDark}
        selectedDay={selectedDay}
        selectedDayInfo={selectedDayInfo}
        monthInbound={monthInbound}
        monthOutbound={monthOutbound}
        monthNet={monthNet}
        monthDeals={monthDeals}
      />

      <section className={layout}>
        <CalendarMonthGrid
          monthDate={monthDate}
          selectedDateKey={selectedDateKey}
          todayDateKey={todayDateKey}
          calendarDays={calendarDays}
          weekdayLabels={weekdayLabels}
          summaryMap={summaryMap}
          locale={i18n.language}
          t={t}
          calendarCardRef={calendarCardRef}
          onPreviousMonth={() =>
            setMonthDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
          }
          onNextMonth={() =>
            setMonthDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
          }
          onSelectDate={handleSelectDate}
        />

        <div className={detailsColumn}>
          <CalendarDetailTable
            t={t}
            locale={i18n.language}
            detailEvents={detailEvents}
            currentDetailEvents={currentDetailEvents}
            detailPlaceholderRows={detailPlaceholderRows}
            detailRowHeight={detailRowHeight}
            detailPageSafe={detailPageSafe}
            detailTotalPages={detailTotalPages}
            detailHeaderRef={detailHeaderRef}
            detailTableHeadRef={detailTableHeadRef}
            detailFooterRef={detailFooterRef}
            onPreviousPage={() => setDetailPage((pageNumber) => Math.max(1, pageNumber - 1))}
            onNextPage={() =>
              setDetailPage((pageNumber) => Math.min(detailTotalPages, pageNumber + 1))
            }
          />
        </div>
      </section>

      <CalendarCharts
        t={t}
        locale={i18n.language}
        isDark={isDark}
        chartData={chartData}
        last30Days={last30Days}
      />
    </div>
  );
}

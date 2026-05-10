import type { RefObject } from 'react';
import type { TFunction } from 'i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CalendarDaySummary } from './calendar.types';
import { getSignedToneClass } from './calendar.style.utils';
import {
  calendarCard,
  calendarHeader,
  dayButton,
  dayButtonActive,
  dayButtonDisabled,
  dayButtonMuted,
  dayButtonSelected,
  dayMeta,
  dayNet,
  dayNumber,
  iconButton,
  monthActions,
  monthGrid,
  monthHint,
  monthTitle,
  weekdayCell,
  weekdayRow,
} from './CalendarPage.css';
import { formatCompactNumber, formatSignedNumber, getMonthLabel } from './calendar.utils';

interface CalendarMonthGridProps {
  monthDate: Date;
  selectedDateKey: string;
  todayDateKey: string;
  calendarDays: Date[];
  weekdayLabels: string[];
  summaryMap: Map<string, CalendarDaySummary>;
  locale: string;
  t: TFunction;
  calendarCardRef: RefObject<HTMLDivElement | null>;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (date: Date, dateKey: string, isCurrentMonth: boolean) => void;
}

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`;
}

export function CalendarMonthGrid({
  monthDate,
  selectedDateKey,
  todayDateKey,
  calendarDays,
  weekdayLabels,
  summaryMap,
  locale,
  t,
  calendarCardRef,
  onPreviousMonth,
  onNextMonth,
  onSelectDate,
}: CalendarMonthGridProps) {
  return (
    <div className={calendarCard} ref={calendarCardRef}>
      <div className={calendarHeader}>
        <div>
          <div className={monthTitle} data-testid="calendar-month-title">
            {getMonthLabel(monthDate, locale)}
          </div>
          <div className={monthHint}>{t('calendar.monthHint')}</div>
        </div>
        <div className={monthActions}>
          <button
            type="button"
            className={iconButton}
            aria-label={t('calendar.previousMonth')}
            onClick={onPreviousMonth}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className={iconButton}
            aria-label={t('calendar.nextMonth')}
            onClick={onNextMonth}
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
          const dateKey = getDateKey(date);
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
              onClick={() => onSelectDate(date, dateKey, isCurrentMonth)}
            >
              <span className={dayNumber}>{date.getDate()}</span>
              <span className={`${dayNet} ${getSignedToneClass(netQty)}`}>
                {summary ? formatSignedNumber(netQty, locale) : '0'}
              </span>
              <span className={dayMeta}>
                <span>
                  {t('calendar.inboundShort')} {formatCompactNumber(summary?.inboundQty ?? 0, locale)}
                </span>
                <span>
                  {t('calendar.outboundShort')}{' '}
                  {formatCompactNumber(summary?.outboundQty ?? 0, locale)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

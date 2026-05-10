import type { RefObject } from 'react';
import type { TFunction } from 'i18next';
import { formatCurrency } from '@/features/inventory/inventory.utils';
import { DETAIL_PAGE_SIZE } from './calendar.constants';
import type { InventoryChangeEvent } from './calendar.types';
import { getSignedToneClass } from './calendar.style.utils';
import {
  badge,
  badgeInbound,
  badgeOutbound,
  detailTable,
  tableCellContent,
  pageButton,
  pageIndicator,
  pagination,
  tableCard,
  tableCell,
  tableCellBlank,
  tableCellMuted,
  tableCellStrong,
  tableFooter,
  tableFooterHint,
  tableHeadCell,
  tableHeader,
  tableRow,
  tableSubtitle,
  tableTitle,
  tableWrap,
} from './CalendarPage.css';
import { formatShortTime, formatSignedNumber } from './calendar.utils';

interface CalendarDetailTableProps {
  t: TFunction;
  locale: string;
  detailEvents: InventoryChangeEvent[];
  currentDetailEvents: InventoryChangeEvent[];
  detailPlaceholderRows: number;
  detailRowHeight: number | null;
  detailPageSafe: number;
  detailTotalPages: number;
  detailHeaderRef: RefObject<HTMLDivElement | null>;
  detailTableHeadRef: RefObject<HTMLTableSectionElement | null>;
  detailFooterRef: RefObject<HTMLDivElement | null>;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export function CalendarDetailTable({
  t,
  locale,
  detailEvents,
  currentDetailEvents,
  detailPlaceholderRows,
  detailRowHeight,
  detailPageSafe,
  detailTotalPages,
  detailHeaderRef,
  detailTableHeadRef,
  detailFooterRef,
  onPreviousPage,
  onNextPage,
}: CalendarDetailTableProps) {
  const rowStyle = detailRowHeight ? { height: `${detailRowHeight}px` } : undefined;

  return (
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
            {currentDetailEvents.map((event) => (
              <tr key={event.id} data-testid="calendar-detail-row" className={tableRow} style={rowStyle}>
                <td className={`${tableCell} ${tableCellMuted}`}>
                  <span className={tableCellContent}>{formatShortTime(event.timestamp, locale)}</span>
                </td>
                <td className={`${tableCell} ${tableCellStrong}`}>
                  <span className={tableCellContent} title={t(event.nameKey)}>
                    {t(event.nameKey)}
                  </span>
                </td>
                <td className={tableCell}>
                  <span className={tableCellContent} title={t(event.categoryKey)}>
                    {t(event.categoryKey)}
                  </span>
                </td>
                <td className={tableCell}>
                  <span
                    className={[badge, event.direction === 'in' ? badgeInbound : badgeOutbound].join(
                      ' '
                    )}
                  >
                    {event.direction === 'in' ? t('calendar.inbound') : t('calendar.outbound')}
                  </span>
                </td>
                <td
                  className={`${tableCell} ${getSignedToneClass(
                    event.direction === 'in' ? event.quantity : -event.quantity
                  )}`}
                >
                  <span className={tableCellContent}>
                    {event.direction === 'in'
                      ? formatSignedNumber(event.quantity, locale)
                      : formatSignedNumber(-event.quantity, locale)}
                  </span>
                </td>
                <td className={tableCell}>
                  <span className={tableCellContent}>
                    {formatCurrency(event.unitPrice, locale)}
                  </span>
                </td>
                <td className={`${tableCell} ${tableCellStrong}`}>
                  <span className={tableCellContent}>
                    {formatCurrency(event.totalValue, locale)}
                  </span>
                </td>
              </tr>
            ))}
            {Array.from({ length: detailPlaceholderRows }, (_, index) => (
              <tr
                key={`blank-${detailPageSafe}-${index}`}
                data-testid="calendar-detail-row-blank"
                style={rowStyle}
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
            onClick={onPreviousPage}
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
            onClick={onNextPage}
          >
            {t('calendar.nextPage')}
          </button>
        </div>
      </div>
    </div>
  );
}

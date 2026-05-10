import type { TFunction } from 'i18next';
import { formatCurrency } from '@/features/inventory/inventory.utils';
import type { CalendarDaySummary } from './calendar.types';
import type { CalendarSelectedDayInfo } from './calendar.page.utils';
import { getSignedToneClass } from './calendar.style.utils';
import {
  hero,
  heroPanel,
  heroStats,
  heroSubtitle,
  heroTitle,
  panelEyebrow,
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
} from './CalendarPage.css';
import { formatSignedNumber } from './calendar.utils';

interface CalendarHeroProps {
  t: TFunction;
  locale: string;
  isDark: boolean;
  selectedDay: CalendarDaySummary | undefined;
  selectedDayInfo: CalendarSelectedDayInfo;
  monthInbound: number;
  monthOutbound: number;
  monthNet: number;
  monthDeals: number;
}

export function CalendarHero({
  t,
  locale,
  isDark,
  selectedDay,
  selectedDayInfo,
  monthInbound,
  monthOutbound,
  monthNet,
  monthDeals,
}: CalendarHeroProps) {
  return (
    <section className={hero}>
      <div className={heroPanel}>
        <span className={panelEyebrow}>{t('nav.calendar')}</span>
        <div className={heroTitle}>{t('calendar.title')}</div>
        <p className={heroSubtitle}>{t('calendar.subtitle')}</p>
        <div className={heroStats}>
          <div className={statCard}>
            <span className={statLabel}>{t('calendar.monthNet')}</span>
            <span className={`${statValue} ${getSignedToneClass(monthNet)}`}>
              {formatSignedNumber(monthNet, locale)}
            </span>
            <span className={statMeta}>{t('calendar.currentMonth')}</span>
          </div>
          <div className={statCard}>
            <span className={statLabel}>{t('calendar.monthFlow')}</span>
            <span className={statValue}>
              {new Intl.NumberFormat(locale).format(monthInbound + monthOutbound)}
            </span>
            <span className={statMeta}>
              {t('calendar.inbound')}: {new Intl.NumberFormat(locale).format(monthInbound)} /{' '}
              {t('calendar.outbound')}: {new Intl.NumberFormat(locale).format(monthOutbound)}
            </span>
          </div>
          <div className={statCard}>
            <span className={statLabel}>{t('calendar.monthDeals')}</span>
            <span className={statValue}>{new Intl.NumberFormat(locale).format(monthDeals)}</span>
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
              {formatSignedNumber(selectedDay?.netQty ?? 0, locale)}
            </span>
          </div>
          <div className={selectedMetric}>
            <span className={selectedMetricLabel}>{t('calendar.transactions')}</span>
            <span className={selectedMetricValue}>
              {new Intl.NumberFormat(locale).format(selectedDay?.dealCount ?? 0)}
            </span>
          </div>
          <div className={selectedMetric}>
            <span className={selectedMetricLabel}>{t('calendar.avgDealPrice')}</span>
            <span className={selectedMetricValue}>
              {formatCurrency(selectedDay?.avgDealPrice ?? 0, locale)}
            </span>
          </div>
          <div className={selectedMetric}>
            <span className={selectedMetricLabel}>{t('calendar.totalValue')}</span>
            <span className={selectedMetricValue}>
              {formatCurrency(selectedDay?.totalValue ?? 0, locale)}
            </span>
          </div>
        </div>
      </aside>
    </section>
  );
}

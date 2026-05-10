import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { Message, MessageSeverity } from './messages.types';
import {
  summary,
  summaryChart,
  summaryLegend,
  summaryRow,
  summaryDot,
  summaryLabel,
  summaryCount,
  summaryTotal,
  summaryTotalLabel,
} from './MessagesPage.css';

const SEVERITY_COLORS: Record<MessageSeverity, string> = {
  critical: '#E50012',
  warning: '#E5A700',
  info: '#1E8E3E',
};

const ORDER: MessageSeverity[] = ['critical', 'warning', 'info'];

interface SeveritySummaryProps {
  messages: Message[];
}

export function SeveritySummary({ messages }: SeveritySummaryProps) {
  const { t } = useTranslation();

  const counts = useMemo(() => {
    const c: Record<MessageSeverity, number> = { critical: 0, warning: 0, info: 0 };
    for (const m of messages) c[m.severity]++;
    return c;
  }, [messages]);

  const total = counts.critical + counts.warning + counts.info;

  const data = ORDER.map((s) => ({
    severity: s,
    name: t(`messages.severity.${s}`),
    value: counts[s],
    color: SEVERITY_COLORS[s],
  })).filter((d) => d.value > 0);

  if (total === 0) return null;

  return (
    <div className={summary} role="region" aria-label={t('messages.summary.title')}>
      <div className={summaryChart}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.length > 0 ? data : [{ name: 'empty', value: 1, color: '#eee' }]}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={36}
              outerRadius={56}
              paddingAngle={data.length > 1 ? 2 : 0}
              isAnimationActive={false}
            >
              {data.map((d) => (
                <Cell key={d.severity} fill={d.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#1A1A1A',
                color: '#FFF',
                border: 'none',
                borderRadius: 8,
                padding: '6px 10px',
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className={summaryTotal} aria-hidden="true">
          <span data-testid="summary-total">{total}</span>
          <span className={summaryTotalLabel}>{t('messages.summary.total')}</span>
        </div>
      </div>
      <ul className={summaryLegend}>
        {ORDER.map((sev) => (
          <li key={sev} className={summaryRow}>
            <span
              className={summaryDot}
              style={{ backgroundColor: SEVERITY_COLORS[sev] }}
              aria-hidden="true"
            />
            <span className={summaryLabel}>{t(`messages.severity.${sev}`)}</span>
            <span className={summaryCount} data-testid={`summary-${sev}`}>
              {counts[sev]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

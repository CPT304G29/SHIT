import type { TFunction } from 'i18next';
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
import { ChartCard } from '@/features/charts/ChartCard';
import { formatCurrency } from '@/features/inventory/inventory.utils';
import { CalendarChartTooltip } from './CalendarChartTooltip';
import { PIE_COLORS } from './calendar.constants';
import type { CalendarSelectedDayCharts } from './calendar.page.utils';
import { chartNarrow, chartWide, chartsGrid } from './CalendarPage.css';
import { formatSignedNumber } from './calendar.utils';

interface CalendarChartsProps {
  t: TFunction;
  locale: string;
  isDark: boolean;
  chartData: CalendarSelectedDayCharts;
  last30Days: Array<{
    dateKey: string;
    label: string;
    inboundQty: number;
    outboundQty: number;
    netQty: number;
  }>;
}

export function CalendarCharts({
  t,
  locale,
  isDark,
  chartData,
  last30Days,
}: CalendarChartsProps) {
  const numberFormatter = (value: number) => new Intl.NumberFormat(locale).format(value);

  return (
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
                  <CalendarChartTooltip isDark={isDark} formatter={(value) => numberFormatter(value)} />
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
                tickFormatter={(value: number) => formatCurrency(value, locale)}
              />
              <Tooltip
                content={
                  <CalendarChartTooltip
                    isDark={isDark}
                    formatter={(value) => formatCurrency(value, locale)}
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
                  <CalendarChartTooltip isDark={isDark} formatter={(value) => numberFormatter(value)} />
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
                tickFormatter={(value: number) => formatSignedNumber(value, locale)}
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
                  <CalendarChartTooltip
                    isDark={isDark}
                    formatter={(value) => formatSignedNumber(value, locale)}
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
                  <CalendarChartTooltip isDark={isDark} formatter={(value) => numberFormatter(value)} />
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
  );
}

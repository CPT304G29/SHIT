import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import type { CategoryDatum } from './chart.utils';

const COLORS = ['#E50012', '#FF6B7A', '#FF9AA3', '#FFB8BE', '#FFD1D5', '#FFE8EA'];

interface AvgPriceByCategoryProps {
  data: CategoryDatum[];
  formatValue: (value: number) => string;
  isDark?: boolean;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          borderRadius: 10,
          padding: '10px 14px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          fontSize: 12,
          fontWeight: 500,
          color: '#1A1A1A',
        }}
      >
        <div style={{ marginBottom: 4, color: '#888', fontSize: 11 }}>{label}</div>
        <div>{payload[0].value}</div>
      </div>
    );
  }
  return null;
}

export function AvgPriceByCategory({ data, formatValue, isDark }: AvgPriceByCategoryProps) {
  const tickColor = isDark ? '#888888' : '#888888';
  const gridColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <defs>
          {data.map((_, i) => (
            <linearGradient key={`avgGrad-${i}`} id={`avgGrad-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.9} />
              <stop offset="100%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.3} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} stroke={gridColor} strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: tickColor, fontWeight: 500 }}
          dy={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: tickColor }}
          tickFormatter={(v: number) => formatValue(v)}
          width={80}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', radius: 6 }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={`url(#avgGrad-${index})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

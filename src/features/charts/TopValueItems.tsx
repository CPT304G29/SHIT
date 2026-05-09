import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { ItemDatum } from './chart.utils';

interface TopValueItemsProps {
  data: ItemDatum[];
  formatValue: (value: number) => string;
  isDark?: boolean;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ItemDatum }>;
}) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
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
        <div style={{ marginBottom: 4, color: '#888', fontSize: 11 }}>{item.name}</div>
        <div>{item.value}</div>
      </div>
    );
  }
  return null;
}

export function TopValueItems({ data, formatValue, isDark }: TopValueItemsProps) {
  const tickColor = isDark ? '#888888' : '#666666';
  const gridColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 4, bottom: 4 }}>
        <defs>
          <linearGradient id="topValueGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E50012" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#FF6B7A" stopOpacity={0.5} />
          </linearGradient>
        </defs>
        <CartesianGrid horizontal stroke={gridColor} strokeDasharray="3 3" />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: tickColor }}
          tickFormatter={(v: number) => formatValue(v)}
        />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: tickColor, fontWeight: 500 }}
          width={120}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}
        />
        <Bar dataKey="value" fill="url(#topValueGrad)" radius={[0, 6, 6, 0]} barSize={14} />
      </BarChart>
    </ResponsiveContainer>
  );
}

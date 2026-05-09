import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import type { ScatterDatum } from './chart.utils';

interface PriceScatterProps {
  data: ScatterDatum[];
  isDark?: boolean;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ScatterDatum }>;
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
        <div>Price: {item.x}</div>
        <div>Qty: {item.y}</div>
      </div>
    );
  }
  return null;
}

export function PriceScatter({ data, isDark }: PriceScatterProps) {
  const tickColor = isDark ? '#888888' : '#888888';
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 8, right: 8, left: -12, bottom: 8 }}>
        <XAxis
          type="number"
          dataKey="x"
          name="Unit Price"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: tickColor }}
        />
        <YAxis
          type="number"
          dataKey="y"
          name="Quantity"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: tickColor }}
        />
        <ZAxis type="number" dataKey="z" range={[60, 400]} />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ strokeDasharray: '3 3', stroke: isDark ? '#444' : '#ddd' }}
        />
        <Scatter data={data} fill="#E50012" fillOpacity={0.6} stroke="#E50012" strokeWidth={1.5} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

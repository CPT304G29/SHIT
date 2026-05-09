import { type ReactElement } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from 'recharts';
import type { CategoryDatum } from './chart.utils';

const COLORS = ['#E50012', '#FF6B7A', '#FF9AA3', '#FFB8BE', '#FFD1D5', '#FFE8EA'];

interface ActiveShapeProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: { name: string; value: number };
  percent: number;
  value: number;
  textColor?: string;
  mutedColor?: string;
}

function renderActiveShape(props: ActiveShapeProps) {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
    textColor = '#1A1A1A',
    mutedColor = '#666666',
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 8) * cos;
  const sy = cy + (outerRadius + 8) * sin;
  const mx = cx + (outerRadius + 14) * cos;
  const my = cy + (outerRadius + 14) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 16;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 4}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={4}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
        strokeWidth={1.5}
      />
      <circle cx={ex} cy={ey} r={3} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 6 : -6)}
        y={ey}
        textAnchor={textAnchor}
        fill={textColor}
        fontSize={12}
        fontWeight={500}
      >
        {payload.name}
      </text>
      <text
        x={ex + (cos >= 0 ? 6 : -6)}
        y={ey}
        dy={16}
        textAnchor={textAnchor}
        fill={mutedColor}
        fontSize={11}
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
      <text
        x={cx}
        y={cy - 6}
        dy={0}
        textAnchor="middle"
        fill={mutedColor}
        fontSize={12}
        fontWeight={500}
      >
        Total
      </text>
      <text
        x={cx}
        y={cy + 14}
        dy={0}
        textAnchor="middle"
        fill={textColor}
        fontSize={20}
        fontWeight={600}
      >
        {value}
      </text>
    </g>
  );
}

interface CategoryDonutProps {
  data: CategoryDatum[];
  isDark?: boolean;
}

export function CategoryDonut({ data, isDark }: CategoryDonutProps) {
  const textColor = isDark ? '#F5F5F7' : '#1A1A1A';
  const mutedColor = isDark ? '#888888' : '#666666';
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeShape={(props: unknown) =>
              renderActiveShape({
                ...(props as ActiveShapeProps),
                textColor,
                mutedColor,
              }) as ReactElement
            }
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="85%"
            dataKey="value"
            cornerRadius={4}
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 500, color: mutedColor, marginBottom: 2 }}>
          Total
        </div>
        <div style={{ fontSize: 20, fontWeight: 600, color: textColor }}>
          {new Intl.NumberFormat().format(total)}
        </div>
      </div>
    </div>
  );
}

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ComponentType, ReactElement, ReactNode } from 'react';
import type { InventoryItem } from '@/features/inventory/inventory.types';
import { AvgPriceByCategory } from '../AvgPriceByCategory';
import { CategoryDonut } from '../CategoryDonut';
import { ChartCard } from '../ChartCard';
import { ChartsPage } from '../ChartsPage';
import { PriceScatter } from '../PriceScatter';
import { StockBarChart } from '../StockBarChart';
import { TopValueItems } from '../TopValueItems';
import { ValueBarChart } from '../ValueBarChart';
import { saveChartAsSvg } from '../chartExport';

const mockState = vi.hoisted(() => ({
  items: [] as InventoryItem[],
  theme: 'light' as 'light' | 'dark',
}));

vi.mock('../chartExport', () => ({
  saveChartAsSvg: vi.fn(() => true),
}));

vi.mock('@/features/inventory/inventory.store', () => ({
  useInventoryStore: (selector: (state: { items: InventoryItem[] }) => unknown) =>
    selector({ items: mockState.items }),
}));

vi.mock('@/hooks/useCurrentTheme', () => ({
  useCurrentTheme: () => mockState.theme,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

vi.mock('recharts', () => {
  const renderChildren = ({ children }: { children?: ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  );
  const chart =
    (name: string) =>
    ({ children, data }: { children?: ReactNode; data?: unknown }) => (
      <svg data-testid={name} data-chart-data={data ? JSON.stringify(data) : undefined}>
        {children}
      </svg>
    );
  const Group = ({ children }: { children?: ReactNode }) => <g>{children}</g>;

  const Axis = ({
    dataKey,
    name,
    tickFormatter,
  }: {
    dataKey?: string;
    name?: string;
    tickFormatter?: (value: number) => string;
  }) => (
    <g data-testid="axis" data-axis={dataKey ?? name}>
      {tickFormatter ? tickFormatter(12345) : null}
    </g>
  );

  const Tooltip = ({ content }: { content?: ReactElement }) => {
    if (!content || typeof content !== 'object' || !('type' in content)) return null;

    const TooltipContent = content.type as ComponentType<Record<string, unknown>>;
    const tooltipProps = content.props as Record<string, unknown>;
    const payload = [
      {
        value: 12345,
        payload: {
          name: 'Tooltip item',
          quantity: 7,
          value: 9900,
          unitPrice: 200,
          x: 12.5,
          y: 4,
          category: 'Tooltip category',
        },
      },
    ];

    return (
      <foreignObject data-testid="tooltip">
        <TooltipContent {...tooltipProps} active payload={payload} label="Tooltip label" />
        <TooltipContent {...tooltipProps} active={false} payload={payload} label="Tooltip label" />
        <TooltipContent {...tooltipProps} active payload={undefined} label="Tooltip label" />
        <TooltipContent {...tooltipProps} active payload={[]} label="Tooltip label" />
      </foreignObject>
    );
  };

  const Pie = ({
    activeShape,
    children,
    data,
  }: {
    activeShape?: (props: unknown) => ReactNode;
    children?: ReactNode;
    data?: Array<{ name: string; value: number }>;
  }) => {
    const shapeProps = {
      cx: 100,
      cy: 100,
      innerRadius: 40,
      outerRadius: 70,
      startAngle: 0,
      endAngle: 90,
      fill: '#E50012',
      payload: data?.[0] ?? { name: 'Fallback category', value: 1 },
      percent: 0.25,
      value: 1,
    };

    return (
      <g data-testid="pie">
        {activeShape?.({ ...shapeProps, midAngle: 45 })}
        {activeShape?.({ ...shapeProps, midAngle: 135 })}
        {children}
      </g>
    );
  };

  return {
    ResponsiveContainer: renderChildren,
    BarChart: chart('bar-chart'),
    ScatterChart: chart('scatter-chart'),
    PieChart: chart('pie-chart'),
    Bar: Group,
    Scatter: chart('scatter'),
    Pie,
    Sector: ({ fill }: { fill?: string }) => <path data-testid="sector" data-fill={fill} />,
    CartesianGrid: ({ stroke }: { stroke?: string }) => (
      <g data-testid="grid" data-stroke={stroke} />
    ),
    Cell: ({ fill }: { fill?: string }) => <g data-testid="cell" data-fill={fill} />,
    Tooltip,
    XAxis: Axis,
    YAxis: Axis,
    ZAxis: Axis,
  };
});

const categoryData = [
  { name: 'Outerwear', value: 12 },
  { name: 'Shirts', value: 8 },
  { name: 'Pants', value: 5 },
];

const itemData = [
  { name: 'Jacket', quantity: 7, value: 14000, unitPrice: 2000 },
  { name: 'Shirt', quantity: 3, value: 4500, unitPrice: 1500 },
];

const scatterData = [
  { name: 'Jacket', category: 'Outerwear', x: 20, y: 7 },
  { name: 'Shirt', category: 'Shirts', x: 15, y: 3 },
];

const inventoryItems: InventoryItem[] = [
  {
    id: '1',
    nameKey: 'item.jacket',
    categoryKey: 'category.outerwear',
    quantity: 7,
    unitPrice: 2000,
    createdAt: 0,
    updatedAt: 0,
  },
  {
    id: '2',
    nameKey: 'item.shirt',
    categoryKey: 'category.shirts',
    quantity: 3,
    unitPrice: 1500,
    createdAt: 0,
    updatedAt: 0,
  },
];

const formatValue = (value: number) => `formatted-${value}`;

describe('chart components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState.items = [];
    mockState.theme = 'light';
  });

  it('renders ChartCard content and exports the chart area when requested', () => {
    render(
      <ChartCard title="Inventory value" exportName="inventory-value">
        <svg aria-label="chart svg" />
      </ChartCard>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Save Inventory value' }));

    expect(screen.getByText('Inventory value')).toBeInTheDocument();
    expect(screen.getByLabelText('chart svg')).toBeInTheDocument();
    expect(saveChartAsSvg).toHaveBeenCalledWith(expect.any(HTMLDivElement), 'inventory-value');
  });

  it('omits ChartCard export controls when no export name is provided', () => {
    render(<ChartCard title="Read only chart">Body</ChartCard>);

    expect(screen.getByText('Read only chart')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
  });

  it('renders the category donut totals, active labels and dark palette branch', () => {
    const { rerender } = render(<CategoryDonut data={categoryData} />);

    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getAllByText('Outerwear')).toHaveLength(2);
    expect(screen.getAllByTestId('cell')).toHaveLength(categoryData.length);

    rerender(<CategoryDonut data={categoryData} isDark />);
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('renders value and average price bar charts with formatted axis values and tooltips', () => {
    const { rerender } = render(
      <ValueBarChart data={categoryData} formatValue={formatValue} isDark={false} />
    );

    expect(screen.getByTestId('bar-chart')).toHaveAttribute('data-chart-data');
    expect(screen.getByText('formatted-12345')).toBeInTheDocument();
    expect(screen.getByText('Tooltip label')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();

    rerender(<AvgPriceByCategory data={categoryData} formatValue={formatValue} isDark />);
    expect(screen.getByText('formatted-12345')).toBeInTheDocument();
    expect(screen.getByText('Tooltip label')).toBeInTheDocument();
  });

  it('renders vertical stock and top-value charts with tooltip item details', () => {
    const { rerender } = render(<StockBarChart data={itemData} isDark={false} />);

    expect(screen.getByTestId('bar-chart')).toHaveAttribute('data-chart-data');
    expect(screen.getByText('Tooltip item')).toBeInTheDocument();
    expect(screen.getByText('Qty: 7')).toBeInTheDocument();

    rerender(<TopValueItems data={itemData} formatValue={formatValue} isDark />);
    expect(screen.getByText('formatted-12345')).toBeInTheDocument();
    expect(screen.getByText('9900')).toBeInTheDocument();
  });

  it('renders the price scatter plot with price and quantity tooltip details', () => {
    const { rerender } = render(<PriceScatter data={scatterData} />);

    expect(screen.getByTestId('scatter-chart')).toBeInTheDocument();
    expect(screen.getByText('Price: 12.5')).toBeInTheDocument();
    expect(screen.getByText('Qty: 4')).toBeInTheDocument();

    rerender(<PriceScatter data={scatterData} isDark />);
    expect(screen.getByTestId('scatter')).toHaveAttribute('data-chart-data');
  });

  it('renders the empty ChartsPage state when there are no inventory items', () => {
    render(<ChartsPage />);

    expect(screen.getByText('table.emptyState')).toBeInTheDocument();
    expect(screen.queryByText('chart.categoryQty')).not.toBeInTheDocument();
  });

  it('renders every ChartsPage card with translated inventory data', () => {
    mockState.items = inventoryItems;
    mockState.theme = 'dark';

    render(<ChartsPage />);

    expect(screen.getByText('chart.categoryQty')).toBeInTheDocument();
    expect(screen.getByText('chart.categoryValue')).toBeInTheDocument();
    expect(screen.getByText('chart.stockLevels')).toBeInTheDocument();
    expect(screen.getByText('chart.priceScatter')).toBeInTheDocument();
    expect(screen.getByText('chart.topValue')).toBeInTheDocument();
    expect(screen.getByText('chart.avgPrice')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^Save chart\./ })).toHaveLength(6);
  });
});

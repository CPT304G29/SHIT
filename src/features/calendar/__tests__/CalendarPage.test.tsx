import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CalendarDaySummary } from '../calendar.types';
import { CalendarPage } from '../CalendarPage';

vi.mock('@/hooks/useCurrentTheme', () => ({
  useCurrentTheme: () => 'light',
}));

vi.mock('@/features/inventory/inventory.store', () => ({
  useInventoryStore: (selector: (state: { items: Array<{ id: string }> }) => unknown) =>
    selector({
      items: [{ id: 'seed-item' }],
    }),
}));

vi.mock('@/features/charts/ChartCard', () => ({
  ChartCard: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section>
      <h3>{title}</h3>
      <div>{children}</div>
    </section>
  ),
}));

vi.mock('recharts', () => {
  const passthrough = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
  return {
    ResponsiveContainer: passthrough,
    BarChart: passthrough,
    LineChart: passthrough,
    PieChart: passthrough,
    CartesianGrid: () => null,
    Cell: () => null,
    Legend: () => <div>legend</div>,
    Tooltip: () => null,
    XAxis: () => null,
    YAxis: () => null,
    Bar: passthrough,
    Line: () => null,
    Pie: passthrough,
  };
});

const mayEvents = Array.from({ length: 12 }, (_, index) => ({
  id: `may-${index + 1}`,
  itemId: `item-${index + 1}`,
  nameKey: index === 0 ? 'item.hoodie' : 'item.longSleeveShirt',
  categoryKey: index === 0 ? 'category.outerwear' : 'category.shirt',
  dateKey: '2026-05-08',
  timestamp: new Date(2026, 4, 8, 9 + index, 0).getTime(),
  direction: index % 2 === 0 ? 'out' : 'in',
  quantity: index === 0 ? 3 : 1 + (index % 3),
  unitPrice: index === 0 ? 6050 : 7900,
  totalValue: (index === 0 ? 3 : 1 + (index % 3)) * (index === 0 ? 6050 : 7900),
})) as CalendarDaySummary['events'];

const summaries: CalendarDaySummary[] = [
  {
    dateKey: '2026-04-30',
    date: new Date(2026, 3, 30),
    events: [
      {
        id: 'apr-1',
        itemId: 'item-1',
        nameKey: 'item.blazerFemale',
        categoryKey: 'category.outerwear',
        dateKey: '2026-04-30',
        timestamp: new Date(2026, 3, 30, 10, 15).getTime(),
        direction: 'in',
        quantity: 7,
        unitPrice: 12900,
        totalValue: 90300,
      },
    ],
    inboundQty: 7,
    outboundQty: 0,
    netQty: 7,
    totalValue: 90300,
    dealCount: 1,
    avgDealPrice: 12900,
  },
  {
    dateKey: '2026-05-08',
    date: new Date(2026, 4, 8),
    events: mayEvents,
    inboundQty: mayEvents
      .filter((event) => event.direction === 'in')
      .reduce((sum, event) => sum + event.quantity, 0),
    outboundQty: mayEvents
      .filter((event) => event.direction === 'out')
      .reduce((sum, event) => sum + event.quantity, 0),
    netQty:
      mayEvents
        .filter((event) => event.direction === 'in')
        .reduce((sum, event) => sum + event.quantity, 0) -
      mayEvents
        .filter((event) => event.direction === 'out')
        .reduce((sum, event) => sum + event.quantity, 0),
    totalValue: mayEvents.reduce((sum, event) => sum + event.totalValue, 0),
    dealCount: mayEvents.length,
    avgDealPrice: Math.round(
      mayEvents.reduce((sum, event) => sum + event.totalValue, 0) /
        mayEvents.reduce((sum, event) => sum + event.quantity, 0)
    ),
  },
];

vi.mock('../calendar.utils', async () => {
  const actual = await vi.importActual<typeof import('../calendar.utils')>('../calendar.utils');
  return {
    ...actual,
    buildInventoryHistory: () => [],
    buildDailySummaries: () => summaries,
    getCalendarDays: (monthDate: Date) => {
      if (monthDate.getMonth() === 4) {
        return [
          new Date(2026, 3, 30),
          new Date(2026, 4, 8),
          new Date(2026, 4, 10),
          new Date(2026, 4, 12),
        ];
      }

      return [
        new Date(2026, 3, 29),
        new Date(2026, 3, 30),
        new Date(2026, 4, 1),
        new Date(2026, 4, 2),
      ];
    },
    getDefaultDateKey: () => '2026-05-08',
    getTodayDateKey: () => '2026-05-10',
    getLast30DaysSeries: () => [],
    getMonthLabel: (date: Date) => (date.getMonth() === 4 ? 'May 2026' : 'April 2026'),
    getWeekdayLabels: () => ['Sun', 'Mon', 'Tue', 'Wed'],
  };
});

describe('CalendarPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('disables future dates', () => {
    render(<CalendarPage />);

    const futureButton = screen.getByRole('button', { name: /12 0 IN 0 OUT 0/i });
    expect(futureButton).toBeDisabled();
  });

  it('switches to the matching month when selecting a previous in-range date from another month', () => {
    render(<CalendarPage />);

    const aprilButton = screen.getByRole('button', { name: /30 \+7 IN 7 OUT 0/i });
    fireEvent.click(aprilButton);

    expect(screen.getByText('April 2026')).toBeInTheDocument();
    expect(screen.getByText('Blazer (Female)')).toBeInTheDocument();
  });

  it('shows empty details for a past date with zero activity', () => {
    render(<CalendarPage />);

    const quietDayButton = screen.getByRole('button', { name: /10 0 IN 0 OUT 0/i });
    fireEvent.click(quietDayButton);

    expect(screen.getByText('No inventory activity recorded for this date.')).toBeInTheDocument();
    expect(screen.getAllByText('Net change').length).toBeGreaterThan(0);
    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
  });

  it('pages detail rows in groups of 10 and pads the last page with blanks', () => {
    render(<CalendarPage />);

    expect(screen.getByTestId('calendar-page-indicator')).toHaveTextContent('Page 1 / 2');
    expect(screen.getAllByTestId('calendar-detail-row')).toHaveLength(10);
    expect(screen.queryAllByTestId('calendar-detail-row-blank')).toHaveLength(0);

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByTestId('calendar-page-indicator')).toHaveTextContent('Page 2 / 2');
    expect(screen.getAllByTestId('calendar-detail-row')).toHaveLength(2);
    expect(screen.getAllByTestId('calendar-detail-row-blank')).toHaveLength(8);
  });
});

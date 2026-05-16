import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ChartCard } from '../ChartCard';
import { saveChartAsSvg } from '../chartExport';

vi.mock('../chartExport', () => ({
  saveChartAsSvg: vi.fn(),
}));

describe('ChartCard', () => {
  it('renders chart content without an export button by default', () => {
    render(
      <ChartCard title="Stock Levels">
        <svg aria-label="chart" />
      </ChartCard>
    );

    expect(screen.getByText('Stock Levels')).toBeInTheDocument();
    expect(screen.getByLabelText('chart')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save Stock Levels' })).not.toBeInTheDocument();
  });

  it('saves the chart svg when exportName is provided', () => {
    render(
      <ChartCard title="Stock Levels" exportName="stock-levels">
        <svg aria-label="chart" />
      </ChartCard>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Save Stock Levels' }));

    expect(saveChartAsSvg).toHaveBeenCalledWith(expect.any(HTMLDivElement), 'stock-levels');
  });
});

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useInventoryStore } from '@/features/inventory/inventory.store';
import { formatCurrency } from '@/features/inventory/inventory.utils';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import { ChartCard } from './ChartCard';
import { CategoryDonut } from './CategoryDonut';
import { ValueBarChart } from './ValueBarChart';
import { StockBarChart } from './StockBarChart';
import { PriceScatter } from './PriceScatter';
import { TopValueItems } from './TopValueItems';
import { AvgPriceByCategory } from './AvgPriceByCategory';
import {
  groupByCategory,
  valueByCategory,
  topItemsByQuantity,
  topItemsByValue,
  avgPriceByCategory,
  scatterData,
} from './chart.utils';
import { page, grid, wide, narrow, medium } from './ChartsPage.css';

export function ChartsPage() {
  const { t, i18n } = useTranslation();
  const items = useInventoryStore((s) => s.items);
  const theme = useCurrentTheme();
  const isDark = theme === 'dark';

  const categoryQty = useMemo(
    () => groupByCategory(items).map((d) => ({ ...d, name: t(d.name) })),
    [items, t]
  );
  const categoryValue = useMemo(
    () => valueByCategory(items).map((d) => ({ ...d, name: t(d.name) })),
    [items, t]
  );
  const topItems = useMemo(
    () => topItemsByQuantity(items, 10).map((d) => ({ ...d, name: t(d.name) })),
    [items, t]
  );
  const topValues = useMemo(
    () => topItemsByValue(items, 8).map((d) => ({ ...d, name: t(d.name) })),
    [items, t]
  );
  const avgPrices = useMemo(
    () => avgPriceByCategory(items).map((d) => ({ ...d, name: t(d.name) })),
    [items, t]
  );
  const scatter = useMemo(
    () =>
      scatterData(items).map((d) => ({
        ...d,
        name: t(d.name),
        category: t(d.category),
      })),
    [items, t]
  );

  const formatValue = (v: number) => formatCurrency(v, i18n.language);

  if (items.length === 0) {
    return (
      <div className={page}>
        <div
          style={{
            color: '#888',
            fontSize: 14,
            padding: '80px 0',
            textAlign: 'center',
          }}
        >
          {t('table.emptyState')}
        </div>
      </div>
    );
  }

  return (
    <div className={page}>
      <div className={grid}>
        <div className={narrow}>
          <ChartCard title={t('chart.categoryQty')} exportName="category-quantity">
            <CategoryDonut data={categoryQty} isDark={isDark} />
          </ChartCard>
        </div>
        <div className={wide}>
          <ChartCard title={t('chart.categoryValue')} exportName="category-value">
            <ValueBarChart data={categoryValue} formatValue={formatValue} isDark={isDark} />
          </ChartCard>
        </div>
        <div className={medium}>
          <ChartCard title={t('chart.stockLevels')} exportName="stock-levels">
            <StockBarChart data={topItems} isDark={isDark} />
          </ChartCard>
        </div>
        <div className={medium}>
          <ChartCard title={t('chart.priceScatter')} exportName="price-scatter">
            <PriceScatter data={scatter} isDark={isDark} />
          </ChartCard>
        </div>
        <div className={narrow}>
          <ChartCard title={t('chart.topValue')} exportName="top-value-items">
            <TopValueItems data={topValues} formatValue={formatValue} isDark={isDark} />
          </ChartCard>
        </div>
        <div className={wide}>
          <ChartCard title={t('chart.avgPrice')} exportName="average-price-by-category">
            <AvgPriceByCategory data={avgPrices} formatValue={formatValue} isDark={isDark} />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

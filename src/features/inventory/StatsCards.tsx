import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useInventoryStore } from './inventory.store';
import { formatCurrency } from './inventory.utils';
import { section, sectionTitle, statsRow, statItem, statValue, statLabel } from './StatsCards.css';

export function StatsCards() {
  const { t, i18n } = useTranslation();
  const items = useInventoryStore((s) => s.items);

  const stats = useMemo(() => {
    const totalSku = items.length;
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const categorySet = new Set(items.map((item) => item.categoryKey));
    return {
      totalSku,
      totalQty,
      totalValue,
      categoryCount: categorySet.size,
    };
  }, [items]);

  const statsList = [
    { label: t('stats.totalSku'), value: new Intl.NumberFormat(i18n.language).format(stats.totalSku) },
    { label: t('stats.totalQty'), value: new Intl.NumberFormat(i18n.language).format(stats.totalQty) },
    { label: t('stats.totalValue'), value: formatCurrency(stats.totalValue, i18n.language) },
    { label: t('stats.categories'), value: String(stats.categoryCount) },
  ];

  return (
    <div className={section}>
      <div className={sectionTitle}>{t('stats.overview')}</div>
      <div className={statsRow}>
        {statsList.map(({ label, value }) => (
          <div key={label} className={statItem}>
            <div className={statValue}>{value}</div>
            <div className={statLabel}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

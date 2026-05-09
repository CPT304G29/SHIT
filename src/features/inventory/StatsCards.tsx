import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Boxes, Wallet, Tags } from 'lucide-react';
import { useInventoryStore } from './inventory.store';
import { formatCurrency } from './inventory.utils';
import { cardsGrid, card, cardIcon, cardValue, cardLabel } from './StatsCards.css';

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

  const cards = [
    {
      icon: Package,
      label: t('stats.totalSku'),
      value: new Intl.NumberFormat(i18n.language).format(stats.totalSku),
      color: '#E50012',
    },
    {
      icon: Boxes,
      label: t('stats.totalQty'),
      value: new Intl.NumberFormat(i18n.language).format(stats.totalQty),
      color: '#1E8E3E',
    },
    {
      icon: Wallet,
      label: t('stats.totalValue'),
      value: formatCurrency(stats.totalValue, i18n.language),
      color: '#0066CC',
    },
    {
      icon: Tags,
      label: t('stats.categories'),
      value: String(stats.categoryCount),
      color: '#7C3AED',
    },
  ];

  return (
    <div className={cardsGrid}>
      {cards.map(({ icon: Icon, label, value, color }) => (
        <div key={label} className={card}>
          <div className={cardIcon} style={{ backgroundColor: `${color}12`, color }}>
            <Icon size={20} strokeWidth={2} />
          </div>
          <div className={cardValue}>{value}</div>
          <div className={cardLabel}>{label}</div>
        </div>
      ))}
    </div>
  );
}

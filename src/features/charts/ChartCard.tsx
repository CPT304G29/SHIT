import type { ReactNode } from 'react';
import { card, cardTitle, cardContent } from './ChartCard.css';

interface ChartCardProps {
  title: string;
  children: ReactNode;
}

export function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className={card}>
      <div className={cardTitle}>{title}</div>
      <div className={cardContent}>{children}</div>
    </div>
  );
}

import { useRef, type ReactNode } from 'react';
import { Download } from 'lucide-react';
import { saveChartAsSvg } from './chartExport';
import { card, cardTitle, cardContent, cardHeader, saveButton } from './ChartCard.css';

interface ChartCardProps {
  title: string;
  children: ReactNode;
  exportName?: string;
}

export function ChartCard({ title, children, exportName }: ChartCardProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className={card}>
      <div className={cardHeader}>
        <div className={cardTitle}>{title}</div>
        {exportName && (
          <button
            type="button"
            className={saveButton}
            aria-label={`Save ${title}`}
            title={`Save ${title}`}
            onClick={() => {
              if (contentRef.current) saveChartAsSvg(contentRef.current, exportName);
            }}
          >
            <Download size={14} aria-hidden="true" />
          </button>
        )}
      </div>
      <div ref={contentRef} className={cardContent}>
        {children}
      </div>
    </div>
  );
}

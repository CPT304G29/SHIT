import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInventoryStore } from '@/features/inventory/inventory.store';
import { formatCurrency } from '@/features/inventory/inventory.utils';
import type { ImportedRevenueRow, RevenueImportResult, RevenuePeriod, RevenueSummaryRow } from './files.types';
import {
  buildCalendarDetailRows,
  buildCalendarSummaryRows,
  buildInventoryDetailRows,
  buildRevenueDictionaryRows,
  buildRevenueExportData,
  buildRevenueOverviewRows,
  getRevenueTotals,
  toCalendarDetailWorksheetRows,
  toCalendarSummaryWorksheetRows,
  toCategoryWorksheetRows,
  toInventoryDetailWorksheetRows,
  toSourceWorksheetRows,
  toWorksheetRows,
} from './revenueExport';
import { parseRevenueRows, summarizeImportedRevenue } from './revenueImport';
import { buildRevenueImportInstructionRows, buildRevenueImportTemplateRows } from './revenueTemplate';
import {
  actions,
  button,
  card,
  cardText,
  cardTitle,
  errorList,
  fileInput,
  grid,
  header,
  hint,
  page,
  secondaryButton,
  detailSector,
  sectorList,
  sectorTitle,
  stat,
  statLabel,
  stats,
  statValue,
  subtitle,
  table,
  tableWrap,
  td,
  th,
  title,
} from './FilesPage.css';

type SpreadsheetRow = Record<string, unknown>;

function formatDateTime(timestamp: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
}

function getTotalsFromImportedSummary(rows: RevenueSummaryRow[]) {
  return rows.reduce(
    (acc, row) => ({
      ...acc,
      [row.periodType]: acc[row.periodType] + row.revenueCents,
    }),
    { day: 0, month: 0, quarter: 0 } as Record<RevenuePeriod, number>
  );
}

function toImportedRevenueWorksheetRows(rows: ImportedRevenueRow[]) {
  return rows.map((row) => ({
    Date: row.date,
    'Period Type': row.periodType,
    Revenue: row.revenueCents / 100,
    'Revenue (cents)': row.revenueCents,
    Source: row.source ?? '',
    Note: row.note ?? '',
  }));
}

export function FilesPage() {
  const { t, i18n } = useTranslation();
  const items = useInventoryStore((s) => s.items);
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  const [importResult, setImportResult] = useState<RevenueImportResult | null>(null);
  const [appliedImport, setAppliedImport] = useState<RevenueImportResult | null>(null);

  const appliedSummary = useMemo(
    () => (appliedImport ? summarizeImportedRevenue(appliedImport.rows) : null),
    [appliedImport]
  );
  const totals = useMemo(
    () => (appliedSummary ? getTotalsFromImportedSummary(appliedSummary) : getRevenueTotals(items)),
    [appliedSummary, items]
  );
  const importedSummary = useMemo(
    () => (importResult ? summarizeImportedRevenue(importResult.rows) : []),
    [importResult]
  );

  const handleExport = async () => {
    setExporting(true);
    try {
      const XLSX = await import('xlsx');
      const data = buildRevenueExportData(items, (item) => ({
        itemName: t(item.nameKey),
        category: t(item.categoryKey),
      }));
      const resolveLabel = (item: (typeof items)[number]) => ({
        itemName: t(item.nameKey),
        category: t(item.categoryKey),
      });
      const generatedAt = Date.now();
      const revenueSheets = {
        day: appliedSummary?.filter((row) => row.periodType === 'day') ?? data.day,
        month: appliedSummary?.filter((row) => row.periodType === 'month') ?? data.month,
        quarter: appliedSummary?.filter((row) => row.periodType === 'quarter') ?? data.quarter,
      };

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(buildRevenueOverviewRows(items, generatedAt)),
        'Overview'
      );
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(toWorksheetRows(revenueSheets.day)),
        'Daily Revenue'
      );
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(toWorksheetRows(revenueSheets.month)),
        'Monthly Revenue'
      );
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(toWorksheetRows(revenueSheets.quarter)),
        'Quarterly Revenue'
      );
      if (appliedImport) {
        XLSX.utils.book_append_sheet(
          workbook,
          XLSX.utils.json_to_sheet(toImportedRevenueWorksheetRows(appliedImport.rows)),
          'Imported Revenue'
        );
      }
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(toCategoryWorksheetRows(data.categories)),
        'Category Breakdown'
      );
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(toSourceWorksheetRows(data.sourceItems)),
        'Source Items'
      );
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(toInventoryDetailWorksheetRows(buildInventoryDetailRows(items, resolveLabel))),
        'Inventory Details'
      );
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(
          toCalendarSummaryWorksheetRows(buildCalendarSummaryRows(items, generatedAt))
        ),
        'Calendar Summary'
      );
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(
          toCalendarDetailWorksheetRows(buildCalendarDetailRows(items, resolveLabel, generatedAt))
        ),
        'Calendar Details'
      );
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(buildRevenueDictionaryRows()),
        'Data Dictionary'
      );

      const date = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(workbook, `shit-revenue-${date}.xlsx`, { compression: true });
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (file: File) => {
    setImporting(true);
    try {
      const XLSX = await import('xlsx');
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<SpreadsheetRow>(firstSheet, { defval: '' });
      setImportResult(parseRevenueRows(rows));
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    setDownloadingTemplate(true);
    try {
      const XLSX = await import('xlsx');
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(buildRevenueImportTemplateRows()),
        'Revenue Import'
      );
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(buildRevenueImportInstructionRows()),
        'Instructions'
      );

      XLSX.writeFile(workbook, 'shit-revenue-import-template.xlsx', { compression: true });
    } finally {
      setDownloadingTemplate(false);
    }
  };

  return (
    <div className={page}>
      <div className={header}>
        <h1 className={title}>{t('files.title')}</h1>
        <p className={subtitle}>{t('files.subtitle')}</p>
      </div>

      <div className={grid}>
        <section className={card} aria-labelledby="files-export-title">
          <div>
            <h2 id="files-export-title" className={cardTitle}>
              {t('files.export.title')}
            </h2>
            <p className={cardText}>{t('files.export.description')}</p>
          </div>

          <div className={stats}>
            <div className={stat}>
              <span className={statLabel}>{t('files.period.day')}</span>
              <strong className={statValue}>{formatCurrency(totals.day, i18n.language)}</strong>
            </div>
            <div className={stat}>
              <span className={statLabel}>{t('files.period.month')}</span>
              <strong className={statValue}>{formatCurrency(totals.month, i18n.language)}</strong>
            </div>
            <div className={stat}>
              <span className={statLabel}>{t('files.period.quarter')}</span>
              <strong className={statValue}>{formatCurrency(totals.quarter, i18n.language)}</strong>
            </div>
          </div>
          <span className={hint}>
            {appliedImport
              ? t('files.import.appliedSource', { rows: appliedImport.rows.length })
              : t('files.import.inventorySource')}
          </span>

          <div className={detailSector}>
            <h3 className={sectorTitle}>{t('files.export.detailsTitle')}</h3>
            <ul className={sectorList}>
              <li>{t('files.export.detailsRevenue')}</li>
              <li>{t('files.export.detailsInventory')}</li>
              <li>{t('files.export.detailsCalendar')}</li>
            </ul>
          </div>

          <div className={actions}>
            <button
              type="button"
              className={button}
              onClick={handleExport}
              disabled={exporting || (items.length === 0 && !appliedImport)}
              data-testid="export-revenue"
            >
              {exporting ? t('files.export.working') : t('files.export.button')}
            </button>
            <button
              type="button"
              className={secondaryButton}
              onClick={() => setAppliedImport(null)}
              disabled={!appliedImport || exporting}
              data-testid="reset-applied-revenue"
            >
              {t('files.import.resetApplied')}
            </button>
          </div>
          <span className={hint}>{t('files.export.hint')}</span>
        </section>

        <section className={card} aria-labelledby="files-import-title">
          <div>
            <h2 id="files-import-title" className={cardTitle}>
              {t('files.import.title')}
            </h2>
            <p className={cardText}>{t('files.import.description')}</p>
          </div>

          <input
            ref={importInputRef}
            className={fileInput}
            type="file"
            accept=".xlsx,.xls"
            aria-label={t('files.import.button')}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleImport(file);
              event.currentTarget.value = '';
            }}
            data-testid="import-revenue"
          />

          <div className={actions}>
            <button
              type="button"
              className={secondaryButton}
              onClick={handleDownloadTemplate}
              disabled={downloadingTemplate}
              data-testid="download-import-template"
            >
              {downloadingTemplate ? t('files.import.templateWorking') : t('files.import.template')}
            </button>
            <button
              type="button"
              className={button}
              onClick={() => importInputRef.current?.click()}
              disabled={importing}
            >
              {importing ? t('files.import.working') : t('files.import.button')}
            </button>
            <button
              type="button"
              className={secondaryButton}
              onClick={() => setImportResult(null)}
              disabled={!importResult || importing}
            >
              {t('files.import.clear')}
            </button>
          </div>

          <span className={hint}>
            {importing ? t('files.import.working') : t('files.import.hint')}
          </span>
        </section>
      </div>

      {importResult && (
        <section className={card} aria-labelledby="files-import-preview-title">
          <div>
            <h2 id="files-import-preview-title" className={cardTitle}>
              {t('files.import.previewTitle')}
            </h2>
            <p className={cardText}>
              {t('files.import.previewSummary', {
                rows: importResult.rows.length,
                errors: importResult.errors.length,
              })}
            </p>
          </div>

          {importResult.errors.length > 0 && (
            <ul className={errorList}>
              {importResult.errors.slice(0, 5).map((error) => (
                <li key={`${error.rowNumber}-${error.message}`}>
                  {t('files.import.errorRow', {
                    row: error.rowNumber,
                    message: error.message,
                  })}
                </li>
              ))}
            </ul>
          )}

          {importedSummary.length > 0 && (
            <>
              <div className={actions}>
                <button
                  type="button"
                  className={button}
                  onClick={() => {
                    setAppliedImport(importResult);
                  }}
                  disabled={importResult.rows.length === 0}
                  data-testid="confirm-import-revenue"
                >
                  {t('files.import.confirm')}
                </button>
              </div>
              <span className={hint}>{t('files.import.confirmHint')}</span>
            </>
          )}

          {importedSummary.length > 0 && (
            <div className={tableWrap}>
              <table className={table}>
                <thead>
                  <tr>
                    <th className={th}>{t('files.table.period')}</th>
                    <th className={th}>{t('files.table.periodType')}</th>
                    <th className={th}>{t('files.table.revenue')}</th>
                    <th className={th}>{t('files.table.rows')}</th>
                    <th className={th}>{t('files.table.lastUpdated')}</th>
                  </tr>
                </thead>
                <tbody>
                  {importedSummary.map((row) => (
                    <tr key={`${row.periodType}-${row.period}`}>
                      <td className={td}>{row.period}</td>
                      <td className={td}>{t(`files.period.${row.periodType}`)}</td>
                      <td className={td}>{formatCurrency(row.revenueCents, i18n.language)}</td>
                      <td className={td}>{row.itemCount}</td>
                      <td className={td}>{formatDateTime(row.lastUpdatedAt, i18n.language)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      <section className={card} aria-labelledby="files-charts-title">
        <div>
          <h2 id="files-charts-title" className={cardTitle}>
            {t('files.charts.title')}
          </h2>
          <p className={cardText}>{t('files.charts.description')}</p>
        </div>
      </section>
    </div>
  );
}

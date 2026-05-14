import type {
  ImportedRevenueRow,
  RevenueImportError,
  RevenueImportResult,
  RevenuePeriod,
  RevenueSummaryRow,
} from './files.types';

const VALID_PERIODS = new Set<RevenuePeriod>(['day', 'month', 'quarter']);

type SpreadsheetRow = Record<string, unknown>;

function readCell(row: SpreadsheetRow, keys: string[]): unknown {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== '') return row[key];
  }
  return undefined;
}

function parseDateValue(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (/^\d{4}-Q[1-4]$/i.test(trimmed)) return trimmed.toUpperCase();
    if (/^\d{4}-\d{2}$/.test(trimmed)) return trimmed;
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) return trimmed;
  }

  return null;
}

function parseRevenue(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) return value;
  if (typeof value !== 'string') return null;

  const normalized = value.replace(/[^0-9.-]/g, '');
  if (!normalized) return null;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function parsePeriod(value: unknown): RevenuePeriod | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  return VALID_PERIODS.has(normalized as RevenuePeriod) ? (normalized as RevenuePeriod) : null;
}

export function parseRevenueRows(rows: SpreadsheetRow[]): RevenueImportResult {
  const imported: ImportedRevenueRow[] = [];
  const errors: RevenueImportError[] = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const date = parseDateValue(readCell(row, ['date', 'Date', 'DATE', 'Period', 'period']));
    const rawPeriodType = readCell(row, ['periodType', 'Period Type', 'period_type', 'Type', 'type']);
    const periodType = rawPeriodType === undefined ? 'day' : parsePeriod(rawPeriodType);
    const revenue = parseRevenue(readCell(row, ['revenue', 'Revenue', 'REVENUE', 'Amount', 'amount']));

    if (!date) {
      errors.push({ rowNumber, message: 'Missing or invalid date.' });
      return;
    }

    if (!periodType) {
      errors.push({ rowNumber, message: 'Invalid period type.' });
      return;
    }

    if (revenue === null) {
      errors.push({ rowNumber, message: 'Missing or invalid revenue.' });
      return;
    }

    const source = readCell(row, ['source', 'Source']);
    const note = readCell(row, ['note', 'Note']);

    imported.push({
      date,
      periodType,
      revenueCents: Math.round(revenue * 100),
      source: typeof source === 'string' ? source : undefined,
      note: typeof note === 'string' ? note : undefined,
    });
  });

  return { rows: imported, errors };
}

export function summarizeImportedRevenue(rows: ImportedRevenueRow[]): RevenueSummaryRow[] {
  const grouped = new Map<string, RevenueSummaryRow>();

  for (const row of rows) {
    const key = `${row.periodType}:${row.date}`;
    const timestamp = row.date.includes('-Q')
      ? new Date(`${row.date.slice(0, 4)}-${(Number(row.date.slice(6)) - 1) * 3 + 1}-01`).getTime()
      : new Date(row.date).getTime();
    const current = grouped.get(key);

    if (current) {
      current.revenueCents += row.revenueCents;
      current.itemCount += 1;
      current.firstUpdatedAt = Math.min(current.firstUpdatedAt, timestamp);
      current.lastUpdatedAt = Math.max(current.lastUpdatedAt, timestamp);
    } else {
      grouped.set(key, {
        periodType: row.periodType,
        period: row.date,
        revenueCents: row.revenueCents,
        quantity: 0,
        itemCount: 1,
        firstUpdatedAt: timestamp,
        lastUpdatedAt: timestamp,
      });
    }
  }

  return [...grouped.values()].sort((a, b) =>
    `${a.periodType}:${a.period}`.localeCompare(`${b.periodType}:${b.period}`)
  );
}

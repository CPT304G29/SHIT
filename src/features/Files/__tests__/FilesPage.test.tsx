import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FilesPage } from '../FilesPage';

type MockInventoryItem = {
  id: string;
  nameKey: string;
  categoryKey: string;
  quantity: number;
  unitPrice: number;
  createdAt: number;
  updatedAt: number;
};

type MockWorkbook = {
  sheets: Array<{
    name: string;
    rows: unknown;
  }>;
};

const mockFiles = vi.hoisted(() => ({
  importRows: [] as Record<string, unknown>[],
  items: [] as MockInventoryItem[],
  read: vi.fn(),
  sheetToJson: vi.fn(),
  bookNew: vi.fn(),
  bookAppendSheet: vi.fn(),
  jsonToSheet: vi.fn(),
  writeFile: vi.fn(),
}));

vi.mock('@/features/inventory/inventory.store', () => ({
  useInventoryStore: (selector: (state: { items: MockInventoryItem[] }) => unknown) =>
    selector({
      items: mockFiles.items,
    }),
}));

vi.mock('xlsx', () => {
  const module = {
    read: mockFiles.read,
    utils: {
      book_new: mockFiles.bookNew,
      book_append_sheet: mockFiles.bookAppendSheet,
      json_to_sheet: mockFiles.jsonToSheet,
      sheet_to_json: mockFiles.sheetToJson,
    },
    writeFile: mockFiles.writeFile,
  };

  return {
    ...module,
    default: module,
  };
});

const inventoryItems: MockInventoryItem[] = [
  {
    id: '1',
    nameKey: 'item.blazerFemale',
    categoryKey: 'category.outerwear',
    quantity: 2,
    unitPrice: 1000,
    createdAt: new Date('2026-05-01T00:00:00Z').getTime(),
    updatedAt: new Date('2026-05-14T00:00:00Z').getTime(),
  },
  {
    id: '2',
    nameKey: 'item.denimJeans',
    categoryKey: 'category.pants',
    quantity: 12,
    unitPrice: 2500,
    createdAt: new Date('2026-04-01T00:00:00Z').getTime(),
    updatedAt: new Date('2026-04-10T00:00:00Z').getTime(),
  },
];

function latestWorkbook(): MockWorkbook {
  const result = mockFiles.bookNew.mock.results[mockFiles.bookNew.mock.results.length - 1];
  return result.value as MockWorkbook;
}

async function uploadRevenueRows(rows: Record<string, unknown>[]) {
  mockFiles.importRows = rows;
  const file = new File(['workbook'], 'revenue.xlsx', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  Object.defineProperty(file, 'arrayBuffer', {
    value: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
  });

  await userEvent.upload(screen.getByTestId('import-revenue'), file);
}

describe('FilesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFiles.items = inventoryItems;
    mockFiles.importRows = [];
    mockFiles.read.mockReturnValue({
      SheetNames: ['Revenue'],
      Sheets: {
        Revenue: { '!ref': 'A1:E4' },
      },
    });
    mockFiles.sheetToJson.mockImplementation(() => mockFiles.importRows);
    mockFiles.bookNew.mockImplementation((): MockWorkbook => ({ sheets: [] }));
    mockFiles.bookAppendSheet.mockImplementation(
      (workbook: MockWorkbook, rows: unknown, name: string) => {
        workbook.sheets.push({ name, rows });
      }
    );
    mockFiles.jsonToSheet.mockImplementation((rows: unknown) => rows);
  });

  it('renders export, import and chart guidance sections', () => {
    render(<FilesPage />);

    expect(screen.getByRole('heading', { name: 'Files' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Revenue export' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Revenue import' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Chart exports' })).toBeInTheDocument();
    expect(screen.getByTestId('export-revenue')).toBeEnabled();
    expect(screen.getByTestId('download-import-template')).toBeEnabled();
    expect(screen.getByTestId('import-revenue')).toBeInTheDocument();
  });

  it('downloads the revenue import template workbook', async () => {
    render(<FilesPage />);

    await userEvent.click(screen.getByTestId('download-import-template'));

    await waitFor(() => {
      expect(mockFiles.writeFile).toHaveBeenCalledWith(
        expect.objectContaining({
          sheets: expect.arrayContaining([
            expect.objectContaining({ name: 'Revenue Import' }),
            expect.objectContaining({ name: 'Instructions' }),
          ]),
        }),
        'shit-revenue-import-template.xlsx',
        { compression: true }
      );
    });
    expect(latestWorkbook().sheets).toHaveLength(2);
    expect(mockFiles.jsonToSheet).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ date: '2026-05-14', periodType: 'day' })])
    );
  });

  it('previews imported revenue rows, reports errors and clears the preview', async () => {
    render(<FilesPage />);

    await uploadRevenueRows([
      { date: '2026-05-14', periodType: 'day', revenue: 20, source: 'Store A' },
      { date: '2026-05', periodType: 'month', revenue: '$150.50', note: 'Promo' },
      { date: '', periodType: 'day', revenue: 10 },
    ]);

    expect(await screen.findByRole('heading', { name: 'Import preview' })).toBeInTheDocument();
    expect(screen.getByText('2 valid rows, 1 errors')).toBeInTheDocument();
    expect(screen.getByText('Row 4: Missing or invalid date.')).toBeInTheDocument();
    expect(screen.getByText('2026-05-14')).toBeInTheDocument();
    expect(screen.getByText('2026-05')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-import-revenue')).toBeEnabled();

    await userEvent.click(screen.getByRole('button', { name: 'Clear preview' }));

    expect(screen.queryByRole('heading', { name: 'Import preview' })).not.toBeInTheDocument();
  });

  it('applies imported revenue, exports it, then resets back to inventory revenue', async () => {
    render(<FilesPage />);

    await uploadRevenueRows([
      { date: '2026-05-14', periodType: 'day', revenue: 20, source: 'Store A' },
      { date: '2026-05', periodType: 'month', revenue: 150, note: 'Promo' },
      { date: '2026-Q2', periodType: 'quarter', revenue: 500 },
    ]);
    await userEvent.click(await screen.findByTestId('confirm-import-revenue'));

    expect(
      screen.getByText('Revenue cards are using 3 imported rows temporarily.')
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('export-revenue'));

    await waitFor(() => {
      expect(mockFiles.writeFile).toHaveBeenCalledWith(
        expect.objectContaining({
          sheets: expect.arrayContaining([expect.objectContaining({ name: 'Imported Revenue' })]),
        }),
        expect.stringMatching(/^shit-revenue-\d{4}-\d{2}-\d{2}\.xlsx$/),
        { compression: true }
      );
    });
    expect(latestWorkbook().sheets.map((sheet) => sheet.name)).toEqual([
      'Overview',
      'Daily Revenue',
      'Monthly Revenue',
      'Quarterly Revenue',
      'Imported Revenue',
      'Category Breakdown',
      'Source Items',
      'Inventory Details',
      'Calendar Summary',
      'Calendar Details',
      'Data Dictionary',
    ]);

    await userEvent.click(screen.getByTestId('reset-applied-revenue'));

    expect(
      screen.getByText('Revenue cards currently use inventory-derived data.')
    ).toBeInTheDocument();
  });

  it('exports the inventory-derived workbook without imported revenue', async () => {
    render(<FilesPage />);

    await userEvent.click(screen.getByTestId('export-revenue'));

    await waitFor(() => {
      expect(mockFiles.writeFile).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringMatching(/^shit-revenue-\d{4}-\d{2}-\d{2}\.xlsx$/),
        { compression: true }
      );
    });
    expect(latestWorkbook().sheets.map((sheet) => sheet.name)).toEqual([
      'Overview',
      'Daily Revenue',
      'Monthly Revenue',
      'Quarterly Revenue',
      'Category Breakdown',
      'Source Items',
      'Inventory Details',
      'Calendar Summary',
      'Calendar Details',
      'Data Dictionary',
    ]);
  });

  it('keeps export disabled when there is no inventory or applied import', () => {
    mockFiles.items = [];

    render(<FilesPage />);

    expect(screen.getByTestId('export-revenue')).toBeDisabled();
  });
});

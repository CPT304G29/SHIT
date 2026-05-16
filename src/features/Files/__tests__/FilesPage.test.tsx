import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FilesPage } from '../FilesPage';

const xlsxMock = vi.hoisted(() => ({
  bookNew: vi.fn(() => ({ sheets: [] as string[] })),
  jsonToSheet: vi.fn((rows: unknown[]) => ({ rows })),
  bookAppendSheet: vi.fn((workbook: { sheets: string[] }, _sheet: unknown, name: string) => {
    workbook.sheets.push(name);
  }),
  read: vi.fn(() => ({ SheetNames: ['Revenue Import'], Sheets: { 'Revenue Import': {} } })),
  sheetToJson: vi.fn(() => [] as Array<Record<string, unknown>>),
  writeFile: vi.fn(),
}));

vi.mock('xlsx', () => ({
  utils: {
    book_new: xlsxMock.bookNew,
    json_to_sheet: xlsxMock.jsonToSheet,
    book_append_sheet: xlsxMock.bookAppendSheet,
    sheet_to_json: xlsxMock.sheetToJson,
  },
  read: xlsxMock.read,
  writeFile: xlsxMock.writeFile,
}));

vi.mock('@/features/inventory/inventory.store', () => ({
  useInventoryStore: (selector: (state: { items: unknown[] }) => unknown) =>
    selector({
      items: [
        {
          id: '1',
          nameKey: 'item.blazerFemale',
          categoryKey: 'category.outerwear',
          quantity: 2,
          unitPrice: 1000,
          createdAt: new Date('2026-05-01T00:00:00Z').getTime(),
          updatedAt: new Date('2026-05-14T00:00:00Z').getTime(),
        },
      ],
    }),
}));

describe('FilesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    xlsxMock.bookNew.mockImplementation(() => ({ sheets: [] }));
    xlsxMock.jsonToSheet.mockImplementation((rows: unknown[]) => ({ rows }));
    xlsxMock.sheetToJson.mockReturnValue([]);
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

  it('downloads a fillable revenue import template workbook', async () => {
    render(<FilesPage />);

    fireEvent.click(screen.getByTestId('download-import-template'));

    await waitFor(() => {
      expect(xlsxMock.writeFile).toHaveBeenCalledWith(
        expect.any(Object),
        'shit-revenue-import-template.xlsx',
        { compression: true }
      );
    });
    expect(xlsxMock.bookAppendSheet).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      'Revenue Import'
    );
    expect(xlsxMock.bookAppendSheet).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      'Instructions'
    );
  });

  it('previews imported revenue and applies it temporarily to the page', async () => {
    xlsxMock.sheetToJson.mockReturnValue([
      { date: '2026-05-14', periodType: 'day', revenue: 1250.5, source: 'Store A' },
      { date: '2026-05', periodType: 'month', revenue: 38600 },
      { date: '2026-Q2', periodType: 'quarter', revenue: 108900 },
    ]);
    render(<FilesPage />);

    const file = new File(['mock'], 'revenue.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    Object.defineProperty(file, 'arrayBuffer', {
      value: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
    });
    fireEvent.change(screen.getByTestId('import-revenue'), { target: { files: [file] } });

    expect(await screen.findByRole('heading', { name: 'Import preview' })).toBeInTheDocument();
    expect(screen.getByText('3 valid rows, 0 errors')).toBeInTheDocument();
    expect(screen.getByText('2026-Q2')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('confirm-import-revenue'));

    expect(
      screen.getByText('Revenue cards are using 3 imported rows temporarily.')
    ).toBeInTheDocument();
    expect(screen.getByTestId('reset-applied-revenue')).toBeEnabled();
  });

  it('exports applied imported revenue as a dedicated workbook sheet', async () => {
    xlsxMock.sheetToJson.mockReturnValue([
      { date: '2026-05-14', periodType: 'day', revenue: 1250.5, note: 'Imported' },
    ]);
    render(<FilesPage />);

    const file = new File(['mock'], 'revenue.xlsx');
    Object.defineProperty(file, 'arrayBuffer', {
      value: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
    });
    fireEvent.change(screen.getByTestId('import-revenue'), { target: { files: [file] } });
    fireEvent.click(await screen.findByTestId('confirm-import-revenue'));
    fireEvent.click(screen.getByTestId('export-revenue'));

    await waitFor(() => {
      expect(xlsxMock.writeFile).toHaveBeenCalledWith(
        expect.any(Object),
        expect.stringMatching(/^shit-revenue-\d{4}-\d{2}-\d{2}\.xlsx$/),
        { compression: true }
      );
    });
    expect(xlsxMock.bookAppendSheet).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      'Imported Revenue'
    );
  });
});

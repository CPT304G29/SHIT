import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FilesPage } from '../FilesPage';

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
});

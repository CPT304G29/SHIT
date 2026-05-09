import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type SortingState,
  type ColumnDef,
} from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Search, Pencil, Trash2, Plus, ArrowUpDown } from 'lucide-react';
import { useInventoryStore } from './inventory.store';
import { StatsCards } from './StatsCards';
import { formatCurrency, calculateTotalPrice } from './inventory.utils';
import type { InventoryItem } from './inventory.types';
import {
  container,
  toolbar,
  searchInput,
  addButton,
  tableWrapper,
  table,
  thead,
  th,
  thRight,
  tbody,
  tr,
  td,
  tdRight,
  tdActions,
  actionButton,
  emptyState,
  categoryBadge,
} from './InventoryTable.css';

interface InventoryTableProps {
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  onAdd: () => void;
}

export function InventoryTable({ onEdit, onDelete, onAdd }: InventoryTableProps) {
  const { t, i18n } = useTranslation();
  const items = useInventoryStore((s) => s.items);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo<ColumnDef<InventoryItem>[]>(
    () => [
      {
        accessorKey: 'nameKey',
        header: t('table.itemName'),
        cell: ({ getValue }) => (
          <span style={{ fontWeight: 600 }}>{t(getValue<string>())}</span>
        ),
      },
      {
        accessorKey: 'quantity',
        header: t('table.quantity'),
        cell: ({ getValue }) => (
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>
            {new Intl.NumberFormat(i18n.language).format(getValue<number>())}
          </span>
        ),
        meta: { align: 'right' },
      },
      {
        accessorKey: 'categoryKey',
        header: t('table.category'),
        cell: ({ getValue }) => (
          <span className={categoryBadge}>{t(getValue<string>())}</span>
        ),
      },
      {
        accessorKey: 'unitPrice',
        header: t('table.unitPrice'),
        cell: ({ getValue }) => (
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatCurrency(getValue<number>(), i18n.language)}
          </span>
        ),
        meta: { align: 'right' },
      },
      {
        id: 'totalPrice',
        header: t('table.totalPrice'),
        accessorFn: (row) => calculateTotalPrice(row.quantity, row.unitPrice),
        cell: ({ getValue }) => (
          <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
            {formatCurrency(getValue<number>(), i18n.language)}
          </span>
        ),
        meta: { align: 'right' },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className={tdActions}>
            <button
              type="button"
              className={actionButton}
              aria-label={t('table.editItem')}
              onClick={() => onEdit(row.original)}
            >
              <Pencil size={15} />
            </button>
            <button
              type="button"
              className={actionButton}
              aria-label={t('table.deleteItem')}
              onClick={() => onDelete(row.original)}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ),
      },
    ],
    [t, i18n.language, onEdit, onDelete]
  );

  const tableInstance = useReactTable({
    data: items,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (items.length === 0) {
    return (
      <div className={container}>
        <StatsCards />
        <div className={toolbar}>
          <div />
          <button type="button" className={addButton} onClick={onAdd}>
            <Plus size={16} />
            {t('table.addItem')}
          </button>
        </div>
        <div className={emptyState}>
          <Search size={48} strokeWidth={1.5} />
          <p>{t('table.emptyState')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={container}>
      <StatsCards />

      <div className={toolbar}>
        <div style={{ position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#888888',
              opacity: 0.7,
            }}
          />
          <input
            type="text"
            className={searchInput}
            placeholder={t('table.searchPlaceholder')}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
        <button type="button" className={addButton} onClick={onAdd}>
          <Plus size={16} />
          {t('table.addItem')}
        </button>
      </div>

      <div className={tableWrapper}>
        <table className={table}>
          <thead className={thead}>
            {tableInstance.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const align = (header.column.columnDef.meta as any)?.align;
                  const isSortable = header.column.getCanSort();
                  return (
                    <th
                      key={header.id}
                      className={`${th} ${align === 'right' ? thRight : ''}`}
                      onClick={
                        isSortable
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      style={{
                        cursor: isSortable ? 'pointer' : 'default',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {isSortable && (
                          <ArrowUpDown
                            size={12}
                            style={{
                              opacity: header.column.getIsSorted() ? 1 : 0.4,
                            }}
                          />
                        )}
                      </span>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className={tbody}>
            {tableInstance.getRowModel().rows.map((row) => (
              <tr key={row.id} className={tr}>
                {row.getVisibleCells().map((cell) => {
                  const align = (cell.column.columnDef.meta as any)?.align;
                  return (
                    <td
                      key={cell.id}
                      className={`${td} ${align === 'right' ? tdRight : ''}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

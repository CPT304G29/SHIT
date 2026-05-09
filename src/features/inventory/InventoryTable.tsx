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
import { Search, Pencil, Trash2, Plus } from 'lucide-react';
import { useInventoryStore } from './inventory.store';
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
  tbody,
  tr,
  td,
  tdActions,
  actionButton,
  emptyState,
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
        cell: ({ getValue }) => t(getValue<string>()),
      },
      {
        accessorKey: 'quantity',
        header: t('table.quantity'),
        cell: ({ getValue }) => new Intl.NumberFormat(i18n.language).format(getValue<number>()),
      },
      {
        accessorKey: 'categoryKey',
        header: t('table.category'),
        cell: ({ getValue }) => t(getValue<string>()),
      },
      {
        accessorKey: 'unitPrice',
        header: t('table.unitPrice'),
        cell: ({ getValue }) => formatCurrency(getValue<number>(), i18n.language),
      },
      {
        id: 'totalPrice',
        header: t('table.totalPrice'),
        accessorFn: (row) => calculateTotalPrice(row.quantity, row.unitPrice),
        cell: ({ getValue }) => formatCurrency(getValue<number>(), i18n.language),
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
              <Pencil size={16} />
            </button>
            <button
              type="button"
              className={actionButton}
              aria-label={t('table.deleteItem')}
              onClick={() => onDelete(row.original)}
            >
              <Trash2 size={16} />
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
            style={{ paddingLeft: 36 }}
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
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={th}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc' && ' ↑'}
                    {header.column.getIsSorted() === 'desc' && ' ↓'}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={tbody}>
            {tableInstance.getRowModel().rows.map((row) => (
              <tr key={row.id} className={tr}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={td}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

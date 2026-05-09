import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { lightTheme, darkTheme } from '@/styles/theme.css';
import { Shell } from '@/components/layout/Shell';
import { useThemeTransition } from '@/hooks/useThemeTransition';
import { InventoryTable } from '@/features/inventory/InventoryTable';
import { InventoryForm } from '@/features/inventory/InventoryForm';
import { DeleteConfirmation } from '@/features/inventory/DeleteConfirmation';
import { ToastContainer, type ToastItem } from '@/components/Toast';
import { useInventoryStore } from '@/features/inventory/inventory.store';
import type { InventoryItem, InventoryFormData } from '@/features/inventory/inventory.types';

function App() {
  const { theme, isTransitioning, toggleTheme } = useThemeTransition();
  const { t, i18n } = useTranslation();
  const addItem = useInventoryStore((s) => s.addItem);
  const updateItem = useInventoryStore((s) => s.updateItem);
  const deleteItem = useInventoryStore((s) => s.deleteItem);

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastItem['type'] = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const handleAdd = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: InventoryItem) => {
    setDeletingItem(item);
    setDeleteOpen(true);
  };

  const handleFormSubmit = (data: InventoryFormData) => {
    if (editingItem) {
      updateItem(editingItem.id, data);
      addToast(t('table.itemUpdated'));
    } else {
      addItem(data);
      addToast(t('table.itemAdded'));
    }
  };

  const handleConfirmDelete = () => {
    if (deletingItem) {
      deleteItem(deletingItem.id);
      addToast(t('table.itemDeleted'));
    }
  };

  return (
    <div className={theme === 'light' ? lightTheme : darkTheme}>
      <Shell theme={theme} isTransitioning={isTransitioning} onToggleTheme={toggleTheme}>
        <InventoryTable onEdit={handleEdit} onDelete={handleDelete} onAdd={handleAdd} />
      </Shell>

      <InventoryForm
        open={formOpen}
        item={editingItem}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmation
        open={deleteOpen}
        item={deletingItem}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;

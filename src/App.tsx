import { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Analytics } from '@vercel/analytics/react';
import { lightTheme, darkTheme } from '@/styles/theme.css';
import { Shell } from '@/components/layout/Shell';
import { useThemeTransition } from '@/hooks/useThemeTransition';
import { InventoryTable } from '@/features/inventory/InventoryTable';
import { ChartsPage } from '@/features/charts/ChartsPage';
import { CalendarPage } from '@/features/calendar/CalendarPage';
import { MessagesPage } from '@/features/messages/MessagesPage';
import { FilesPage } from '@/features/Files/FilesPage';
import { PrivacyPolicy } from '@/features/legal/PrivacyPolicy';
import { CookieBanner } from '@/features/legal/CookieBanner';
import { enforceConsentOnBoot } from '@/features/legal/consent.store';
import { InventoryForm } from '@/features/inventory/InventoryForm';
import { DeleteConfirmation } from '@/features/inventory/DeleteConfirmation';
import { ToastContainer, type ToastItem } from '@/components/Toast';
import { useInventoryStore } from '@/features/inventory/inventory.store';
import { useAllDerivedMessages } from '@/features/messages/useMessages';
import { useMessagesStore } from '@/features/messages/messages.store';
import { useTrackInventoryHistory } from '@/features/messages/useTrackInventoryHistory';
import type { InventoryItem, InventoryFormData } from '@/features/inventory/inventory.types';
import { ParticleGalaxy } from '@/components/EasterEgg/ParticleGalaxy';

type Page = 'inventory' | 'charts' | 'calendar' | 'messages' | 'files' | 'privacy';

// Run once at module evaluation so a refused user does not have stale data
// silently re-persisted by the various stores during the first render pass.
enforceConsentOnBoot();

function App() {
  const { theme, isTransitioning, toggleTheme } = useThemeTransition();
  const { t, i18n } = useTranslation();
  const addItem = useInventoryStore((s) => s.addItem);
  const updateItem = useInventoryStore((s) => s.updateItem);
  const deleteItem = useInventoryStore((s) => s.deleteItem);

  const [page, setPage] = useState<Page>('inventory');
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [highlightItemId, setHighlightItemId] = useState<string | null>(null);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const handleJumpToInventory = useCallback((itemId: string) => {
    setHighlightItemId(itemId);
    setPage('inventory');
    window.setTimeout(() => setHighlightItemId(null), 2500);
  }, []);

  const addToast = useCallback(
    (
      message: string,
      type: ToastItem['type'] = 'success',
      action?: ToastItem['action']
    ) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, message, type, action }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useTrackInventoryHistory();
  const allDerived = useAllDerivedMessages();
  const pruneDismissed = useMessagesStore((s) => s.pruneDismissed);
  const seenCriticalIdsRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);

  useEffect(() => {
    // Auto-clear dismissed entries whose underlying condition has resolved.
    // This way, if a SKU recovers and later goes critical again, the message
    // (and its toast) re-fires instead of being permanently muted.
    pruneDismissed(allDerived.map((m) => m.id));

    const currentCritical = allDerived.filter((m) => m.severity === 'critical');
    const currentIds = new Set(currentCritical.map((m) => m.id));

    if (!initializedRef.current) {
      seenCriticalIdsRef.current = currentIds;
      initializedRef.current = true;
      return;
    }

    const newOnes = currentCritical.filter((m) => !seenCriticalIdsRef.current.has(m.id));
    seenCriticalIdsRef.current = currentIds;

    if (newOnes.length > 0) {
      const label = t('messages.toast.newCritical', { count: newOnes.length });
      addToast(label, 'error', {
        label: t('messages.toast.view'),
        onClick: () => setPage('messages'),
      });
    }
  }, [allDerived, pruneDismissed, addToast, t]);

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
      <Shell
        theme={theme}
        isTransitioning={isTransitioning}
        onToggleTheme={toggleTheme}
        activePage={page}
        onNavigate={(p) => setPage(p as Page)}
      >
        {page === 'inventory' && (
          <InventoryTable
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
            highlightItemId={highlightItemId}
            onTriggerEasterEgg={() => setShowEasterEgg(true)}
          />
        )}
        {page === 'charts' && <ChartsPage />}
        {page === 'calendar' && <CalendarPage />}
        {page === 'messages' && <MessagesPage onJumpToInventory={handleJumpToInventory} />}
        {page === 'files' && <FilesPage />}
        {page === 'privacy' && <PrivacyPolicy />}
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
      <CookieBanner onShowPrivacyPolicy={() => setPage('privacy')} />
      {showEasterEgg && <ParticleGalaxy onClose={() => setShowEasterEgg(false)} />}
      <Analytics />
    </div>
  );
}

export default App;

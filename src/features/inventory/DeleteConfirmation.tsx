import * as Dialog from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';
import type { InventoryItem } from './inventory.types';
import { overlay, content, title, actions, btnDanger, btnSecondary } from './InventoryForm.css';

interface DeleteConfirmationProps {
  open: boolean;
  item: InventoryItem | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmation({ open, onClose, onConfirm }: DeleteConfirmationProps) {
  const { t } = useTranslation();

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={overlay} />
        <Dialog.Content className={content} style={{ maxWidth: 360 }}>
          <Dialog.Title className={title}>{t('table.deleteItem')}</Dialog.Title>
          <p style={{ fontSize: 14, color: 'var(--color-text)', marginBottom: 20 }}>
            {t('table.deleteConfirm')}
          </p>
          <div className={actions}>
            <button type="button" className={btnSecondary} onClick={onClose}>
              {t('table.cancel')}
            </button>
            <button
              type="button"
              className={btnDanger}
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {t('table.deleteItem')}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

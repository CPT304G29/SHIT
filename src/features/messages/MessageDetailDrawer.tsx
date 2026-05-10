import * as Dialog from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';
import { Plus, ExternalLink, X } from 'lucide-react';
import { useInventoryStore } from '@/features/inventory/inventory.store';
import { formatCurrency } from '@/features/inventory/inventory.utils';
import type { Message } from './messages.types';
import { useMessagesStore } from './messages.store';
import { useRapidDropPercent } from './useMessages';
import { overlay } from '@/features/inventory/InventoryForm.css';
import {
  drawer,
  drawerHeader,
  drawerTitle,
  drawerClose,
  drawerSection,
  drawerLabel,
  drawerValue,
  drawerActions,
  drawerPrimary,
  drawerSecondary,
  severityBadge,
  severityBadgeVariants,
} from './MessagesPage.css';

interface MessageDetailDrawerProps {
  message: Message | null;
  onClose: () => void;
  onJumpToInventory: (itemId: string) => void;
}

const RESTOCK_AMOUNT = 50;

export function MessageDetailDrawer({
  message,
  onClose,
  onJumpToInventory,
}: MessageDetailDrawerProps) {
  const { t, i18n } = useTranslation();
  const item = useInventoryStore((s) =>
    message ? s.items.find((it) => it.id === message.itemId) ?? null : null
  );
  const updateItem = useInventoryStore((s) => s.updateItem);
  const markRead = useMessagesStore((s) => s.markRead);
  const dropPercent = useRapidDropPercent(message?.itemId ?? '');

  const open = !!message;

  if (!message) {
    return (
      <Dialog.Root open={false}>
        <Dialog.Portal>
          <Dialog.Overlay className={overlay} />
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  const handleRestock = () => {
    if (!item) return;
    updateItem(item.id, {
      nameKey: item.nameKey,
      categoryKey: item.categoryKey,
      unitPrice: item.unitPrice,
      quantity: item.quantity + RESTOCK_AMOUNT,
    });
    markRead(message.id);
    onClose();
  };

  const handleJump = () => {
    onJumpToInventory(message.itemId);
    onClose();
  };

  const itemName = t(message.itemNameKey);
  const body = t(`messages.body.${message.type}`, {
    name: itemName,
    quantity: message.quantity,
    percent: dropPercent,
  });

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={overlay} />
        <Dialog.Content className={drawer} aria-describedby={undefined}>
          <div className={drawerHeader}>
            <div>
              <Dialog.Title className={drawerTitle}>{itemName}</Dialog.Title>
              <span className={`${severityBadge} ${severityBadgeVariants[message.severity]}`}>
                {t(`messages.type.${message.type}`)}
              </span>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className={drawerClose}
                aria-label={t('messages.actions.dismiss')}
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <div className={drawerSection}>
            <div className={drawerLabel}>{t('messages.detail.message')}</div>
            <div className={drawerValue}>{body}</div>
          </div>

          {item && (
            <>
              <div className={drawerSection}>
                <div className={drawerLabel}>{t('table.category')}</div>
                <div className={drawerValue}>{t(item.categoryKey)}</div>
              </div>
              <div className={drawerSection}>
                <div className={drawerLabel}>{t('table.quantity')}</div>
                <div className={drawerValue} data-testid="detail-quantity">
                  {item.quantity}
                </div>
              </div>
              <div className={drawerSection}>
                <div className={drawerLabel}>{t('table.unitPrice')}</div>
                <div className={drawerValue}>{formatCurrency(item.unitPrice, i18n.language)}</div>
              </div>
              <div className={drawerSection}>
                <div className={drawerLabel}>{t('table.totalPrice')}</div>
                <div className={drawerValue}>
                  {formatCurrency(item.unitPrice * item.quantity, i18n.language)}
                </div>
              </div>
            </>
          )}

          <div className={drawerActions}>
            {item && (
              <button
                type="button"
                className={drawerPrimary}
                onClick={handleRestock}
                data-testid="quick-restock"
              >
                <Plus size={14} aria-hidden="true" />
                {t('messages.detail.quickRestock', { count: RESTOCK_AMOUNT })}
              </button>
            )}
            <button
              type="button"
              className={drawerSecondary}
              onClick={handleJump}
              data-testid="jump-to-inventory"
            >
              <ExternalLink size={14} aria-hidden="true" />
              {t('messages.detail.viewInInventory')}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

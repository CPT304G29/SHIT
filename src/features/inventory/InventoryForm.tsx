import { useState, useEffect, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';
import type { InventoryItem, InventoryFormData } from './inventory.types';
import { calculateTotalPrice } from './inventory.utils';
import {
  overlay,
  content,
  title,
  field,
  label,
  input,
  inputDisabled,
  actions,
  btnPrimary,
  btnSecondary,
} from './InventoryForm.css';

interface InventoryFormProps {
  open: boolean;
  item?: InventoryItem | null;
  onClose: () => void;
  onSubmit: (data: InventoryFormData) => void;
}

export function InventoryForm({ open, item, onClose, onSubmit }: InventoryFormProps) {
  const { t } = useTranslation();
  const isEdit = !!item;

  const [nameKey, setNameKey] = useState('');
  const [quantity, setQuantity] = useState('');
  const [categoryKey, setCategoryKey] = useState('');
  const [unitPrice, setUnitPrice] = useState('');

  const reset = useCallback(() => {
    setNameKey('');
    setQuantity('');
    setCategoryKey('');
    setUnitPrice('');
  }, []);

  useEffect(() => {
    if (open) {
      if (item) {
        setNameKey(item.nameKey);
        setQuantity(String(item.quantity));
        setCategoryKey(item.categoryKey);
        setUnitPrice(String(item.unitPrice / 100));
      } else {
        reset();
      }
    }
  }, [open, item, reset]);

  const qtyNum = Number(quantity) || 0;
  const priceNum = Math.round((Number(unitPrice) || 0) * 100);
  const total = calculateTotalPrice(qtyNum, priceNum);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameKey || !quantity || !categoryKey || !unitPrice) return;
    onSubmit({
      nameKey,
      quantity: qtyNum,
      categoryKey,
      unitPrice: priceNum,
    });
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={overlay} />
        <Dialog.Content className={content}>
          <Dialog.Title className={title}>
            {isEdit ? t('table.editItem') : t('table.addItem')}
          </Dialog.Title>
          <form onSubmit={handleSubmit}>
            <div className={field}>
              <label className={label}>{t('form.itemName')}</label>
              <input
                className={input}
                value={nameKey}
                onChange={(e) => setNameKey(e.target.value)}
                placeholder={t('form.placeholder')}
                required
              />
            </div>
            <div className={field}>
              <label className={label}>{t('form.quantity')}</label>
              <input
                className={input}
                type="number"
                min={0}
                step={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={t('form.placeholder')}
                required
              />
            </div>
            <div className={field}>
              <label className={label}>{t('form.category')}</label>
              <input
                className={input}
                value={categoryKey}
                onChange={(e) => setCategoryKey(e.target.value)}
                placeholder={t('form.placeholder')}
                required
              />
            </div>
            <div className={field}>
              <label className={label}>{t('form.unitPrice')}</label>
              <input
                className={input}
                type="number"
                min={0}
                step={0.01}
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder={t('form.placeholder')}
                required
              />
            </div>
            <div className={field}>
              <label className={label}>{t('form.totalPrice')}</label>
              <input className={`${input} ${inputDisabled}`} value={total / 100} disabled />
            </div>
            <div className={actions}>
              <button type="button" className={btnSecondary} onClick={onClose}>
                {t('table.cancel')}
              </button>
              <button type="submit" className={btnPrimary}>
                {t('table.save')}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

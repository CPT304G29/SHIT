import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';
import { useMessagesSettingsStore, DEFAULT_THRESHOLDS } from './messages.settings.store';
import {
  overlay,
  content,
  title,
  field,
  label,
  input,
  actions,
  btnPrimary,
  btnSecondary,
} from '@/features/inventory/InventoryForm.css';
import { settingsRow, settingsHelp, toggleRow, toggle } from './MessagesPage.css';

interface MessagesSettingsProps {
  open: boolean;
  onClose: () => void;
}

export function MessagesSettings({ open, onClose }: MessagesSettingsProps) {
  const { t } = useTranslation();
  const thresholds = useMessagesSettingsStore((s) => s.thresholds);
  const enabledTypes = useMessagesSettingsStore((s) => s.enabledTypes);
  const setThresholds = useMessagesSettingsStore((s) => s.setThresholds);
  const setTypeEnabled = useMessagesSettingsStore((s) => s.setTypeEnabled);
  const reset = useMessagesSettingsStore((s) => s.reset);

  const [lowStock, setLowStock] = useState(String(thresholds.lowStock));
  const [highValue, setHighValue] = useState(String(thresholds.highValue / 100));
  const [rapid, setRapid] = useState(String(thresholds.rapidDecreasePercent));

  useEffect(() => {
    if (open) {
      setLowStock(String(thresholds.lowStock));
      setHighValue(String(thresholds.highValue / 100));
      setRapid(String(thresholds.rapidDecreasePercent));
    }
  }, [open, thresholds]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setThresholds({
      lowStock: Math.max(1, Math.floor(Number(lowStock) || DEFAULT_THRESHOLDS.lowStock)),
      highValue: Math.max(0, Math.round((Number(highValue) || 0) * 100)),
      rapidDecreasePercent: Math.min(
        100,
        Math.max(1, Math.floor(Number(rapid) || DEFAULT_THRESHOLDS.rapidDecreasePercent))
      ),
    });
    onClose();
  };

  const handleReset = () => {
    reset();
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={overlay} />
        <Dialog.Content className={content} aria-describedby={undefined}>
          <Dialog.Title className={title}>{t('messages.settings.title')}</Dialog.Title>
          <form onSubmit={handleSave}>
            <div className={field}>
              <label className={label} htmlFor="th-lowstock">
                {t('messages.settings.lowStock')}
              </label>
              <input
                id="th-lowstock"
                className={input}
                type="number"
                min={1}
                step={1}
                value={lowStock}
                onChange={(e) => setLowStock(e.target.value)}
              />
              <div className={settingsHelp}>{t('messages.settings.lowStockHelp')}</div>
            </div>

            <div className={field}>
              <label className={label} htmlFor="th-highvalue">
                {t('messages.settings.highValue')}
              </label>
              <input
                id="th-highvalue"
                className={input}
                type="number"
                min={0}
                step={1}
                value={highValue}
                onChange={(e) => setHighValue(e.target.value)}
              />
              <div className={settingsHelp}>{t('messages.settings.highValueHelp')}</div>
            </div>

            <div className={field}>
              <label className={label} htmlFor="th-rapid">
                {t('messages.settings.rapidDecrease')}
              </label>
              <input
                id="th-rapid"
                className={input}
                type="number"
                min={1}
                max={100}
                step={1}
                value={rapid}
                onChange={(e) => setRapid(e.target.value)}
              />
              <div className={settingsHelp}>{t('messages.settings.rapidDecreaseHelp')}</div>
            </div>

            <div className={settingsRow}>
              <div className={label}>{t('messages.settings.enableTypes')}</div>
              {(['outOfStock', 'lowStock', 'highValue', 'rapidDecrease'] as const).map((type) => (
                <label key={type} className={toggleRow}>
                  <input
                    type="checkbox"
                    className={toggle}
                    checked={enabledTypes[type]}
                    onChange={(e) => setTypeEnabled(type, e.target.checked)}
                  />
                  <span>{t(`messages.type.${type}`)}</span>
                </label>
              ))}
            </div>

            <div className={actions}>
              <button type="button" className={btnSecondary} onClick={handleReset}>
                {t('messages.settings.reset')}
              </button>
              <button type="submit" className={btnPrimary}>
                {t('messages.settings.save')}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

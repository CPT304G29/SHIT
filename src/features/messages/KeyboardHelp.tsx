import * as Dialog from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';
import { overlay, content, title } from '@/features/inventory/InventoryForm.css';
import { helpList, helpRow, helpKey, helpDesc } from './MessagesPage.css';

interface KeyboardHelpProps {
  open: boolean;
  onClose: () => void;
}

export function KeyboardHelp({ open, onClose }: KeyboardHelpProps) {
  const { t } = useTranslation();

  const SHORTCUTS = [
    { keys: ['j', '↓'], desc: t('messages.help.next') },
    { keys: ['k', '↑'], desc: t('messages.help.prev') },
    { keys: ['Enter'], desc: t('messages.help.open') },
    { keys: ['e'], desc: t('messages.help.toggleRead') },
    { keys: ['s'], desc: t('messages.help.snooze') },
    { keys: ['x'], desc: t('messages.help.dismiss') },
    { keys: ['/'], desc: t('messages.help.search') },
    { keys: ['?'], desc: t('messages.help.help') },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={overlay} />
        <Dialog.Content className={content} aria-describedby={undefined}>
          <Dialog.Title className={title}>{t('messages.help.title')}</Dialog.Title>
          <ul className={helpList}>
            {SHORTCUTS.map((s) => (
              <li key={s.keys.join('+')} className={helpRow}>
                <span>
                  {s.keys.map((k, i) => (
                    <kbd key={k} className={helpKey}>
                      {k}
                      {i < s.keys.length - 1 ? ' / ' : ''}
                    </kbd>
                  ))}
                </span>
                <span className={helpDesc}>{s.desc}</span>
              </li>
            ))}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

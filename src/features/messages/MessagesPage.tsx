import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X, RotateCcw, Settings, Clock } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useMessages } from './useMessages';
import { useMessagesStore } from './messages.store';
import { MessagesSettings } from './MessagesSettings';
import { SeveritySummary } from './SeveritySummary';
import type { Message, MessageFilter } from './messages.types';
import {
  page,
  header,
  title,
  subtitle,
  toolbar,
  filters,
  filterButton,
  filterButtonActive,
  markAllButton,
  list,
  itemRow,
  itemRowUnread,
  severityDot,
  severityDotVariants,
  itemMain,
  itemHeading,
  itemBody,
  severityBadge,
  severityBadgeVariants,
  itemActions,
  iconButton,
  empty,
  settingsButton,
  dropdownContent,
  dropdownItem,
} from './MessagesPage.css';

const FILTERS: MessageFilter[] = ['all', 'unread', 'critical'];

export function MessagesPage() {
  const { t } = useTranslation();
  const messages = useMessages();
  const markRead = useMessagesStore((s) => s.markRead);
  const markUnread = useMessagesStore((s) => s.markUnread);
  const markAllRead = useMessagesStore((s) => s.markAllRead);
  const dismiss = useMessagesStore((s) => s.dismiss);
  const snooze = useMessagesStore((s) => s.snooze);

  const [filter, setFilter] = useState<MessageFilter>('all');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const visible = useMemo(() => {
    if (filter === 'unread') return messages.filter((m) => !m.read);
    if (filter === 'critical') return messages.filter((m) => m.severity === 'critical');
    return messages;
  }, [messages, filter]);

  const unreadIds = messages.filter((m) => !m.read).map((m) => m.id);

  return (
    <div className={page}>
      <div className={header}>
        <h1 className={title}>{t('messages.title')}</h1>
        <p className={subtitle}>{t('messages.subtitle')}</p>
      </div>

      <SeveritySummary messages={messages} />

      <div className={toolbar} role="toolbar" aria-label={t('messages.title')}>
        <div className={filters} role="tablist" aria-label={t('messages.title')}>
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              className={`${filterButton} ${filter === f ? filterButtonActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {t(`messages.filter.${f}`)}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={markAllButton}
          onClick={() => markAllRead(unreadIds)}
          disabled={unreadIds.length === 0}
        >
          {t('messages.actions.markAllRead')}
        </button>
        <button
          type="button"
          className={settingsButton}
          onClick={() => setSettingsOpen(true)}
          aria-label={t('messages.settings.title')}
          data-testid="open-settings"
        >
          <Settings size={14} aria-hidden="true" />
          {t('messages.settings.button')}
        </button>
      </div>

      {visible.length === 0 ? (
        <div className={empty}>{t('messages.empty')}</div>
      ) : (
        <ul className={list} aria-live="polite">
          {visible.map((m) => (
            <MessageRow
              key={m.id}
              message={m}
              onToggleRead={() => (m.read ? markUnread(m.id) : markRead(m.id))}
              onDismiss={() => dismiss(m.id)}
              onSnooze={(durationMs) => snooze(m.id, Date.now() + durationMs)}
            />
          ))}
        </ul>
      )}

      <MessagesSettings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}

interface MessageRowProps {
  message: Message;
  onToggleRead: () => void;
  onDismiss: () => void;
  onSnooze: (durationMs: number) => void;
}

const SNOOZE_OPTIONS: Array<{ key: '1h' | '24h' | '7d'; ms: number }> = [
  { key: '1h', ms: 60 * 60 * 1000 },
  { key: '24h', ms: 24 * 60 * 60 * 1000 },
  { key: '7d', ms: 7 * 24 * 60 * 60 * 1000 },
];

function MessageRow({ message, onToggleRead, onDismiss, onSnooze }: MessageRowProps) {
  const { t } = useTranslation();
  const itemName = t(message.itemNameKey);
  const body = t(`messages.body.${message.type}`, {
    name: itemName,
    quantity: message.quantity,
    percent: '0',
  });

  return (
    <li
      className={`${itemRow} ${!message.read ? itemRowUnread : ''}`}
      data-testid="message-item"
      data-unread={!message.read}
      data-severity={message.severity}
    >
      <span
        className={`${severityDot} ${severityDotVariants[message.severity]}`}
        aria-hidden="true"
      />
      <div className={itemMain}>
        <div className={itemHeading}>
          <span>{t(`messages.type.${message.type}`)}</span>
          <span className={`${severityBadge} ${severityBadgeVariants[message.severity]}`}>
            {t(`messages.severity.${message.severity}`)}
          </span>
        </div>
        <div className={itemBody}>{body}</div>
      </div>
      <div className={itemActions}>
        <button
          type="button"
          className={iconButton}
          onClick={onToggleRead}
          aria-label={t(message.read ? 'messages.actions.markUnread' : 'messages.actions.markRead')}
          data-testid="toggle-read"
        >
          {message.read ? <RotateCcw size={16} /> : <Check size={16} />}
        </button>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className={iconButton}
              aria-label={t('messages.actions.snooze')}
              data-testid="snooze"
            >
              <Clock size={16} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className={dropdownContent} sideOffset={4} align="end">
              {SNOOZE_OPTIONS.map((opt) => (
                <DropdownMenu.Item
                  key={opt.key}
                  className={dropdownItem}
                  onSelect={() => onSnooze(opt.ms)}
                  data-testid={`snooze-${opt.key}`}
                >
                  <Clock size={14} aria-hidden="true" />
                  {t(`messages.actions.snoozeFor.${opt.key}`)}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <button
          type="button"
          className={iconButton}
          onClick={onDismiss}
          aria-label={t('messages.actions.dismiss')}
          data-testid="dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </li>
  );
}

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X, RotateCcw, Settings } from 'lucide-react';
import { useMessages } from './useMessages';
import { useMessagesStore } from './messages.store';
import { MessagesSettings } from './MessagesSettings';
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
} from './MessagesPage.css';

const FILTERS: MessageFilter[] = ['all', 'unread', 'critical'];

export function MessagesPage() {
  const { t } = useTranslation();
  const messages = useMessages();
  const markRead = useMessagesStore((s) => s.markRead);
  const markUnread = useMessagesStore((s) => s.markUnread);
  const markAllRead = useMessagesStore((s) => s.markAllRead);
  const dismiss = useMessagesStore((s) => s.dismiss);

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
}

function MessageRow({ message, onToggleRead, onDismiss }: MessageRowProps) {
  const { t } = useTranslation();
  const itemName = t(message.itemNameKey);
  const body = t(`messages.body.${message.type}`, {
    name: itemName,
    quantity: message.quantity,
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

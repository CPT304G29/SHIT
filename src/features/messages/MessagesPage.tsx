import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X, RotateCcw, Settings, Clock, Keyboard } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useMessages, useRapidDropPercent } from './useMessages';
import { useMessagesStore } from './messages.store';
import { MessagesSettings } from './MessagesSettings';
import { SeveritySummary } from './SeveritySummary';
import { MessageDetailDrawer } from './MessageDetailDrawer';
import { useMessageKeyboard } from './useMessageKeyboard';
import { KeyboardHelp } from './KeyboardHelp';
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
  itemMainButton,
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
  itemRowFocused,
  searchInput,
  bulkBar,
  bulkLabel,
  bulkButton,
  checkbox,
} from './MessagesPage.css';

const FILTERS: MessageFilter[] = ['all', 'unread', 'critical'];

interface MessagesPageProps {
  onJumpToInventory?: (itemId: string) => void;
}

export function MessagesPage({ onJumpToInventory }: MessagesPageProps = {}) {
  const { t } = useTranslation();
  const messages = useMessages();
  const markRead = useMessagesStore((s) => s.markRead);
  const markUnread = useMessagesStore((s) => s.markUnread);
  const markAllRead = useMessagesStore((s) => s.markAllRead);
  const dismiss = useMessagesStore((s) => s.dismiss);
  const dismissMany = useMessagesStore((s) => s.dismissMany);
  const snooze = useMessagesStore((s) => s.snooze);
  const snoozeMany = useMessagesStore((s) => s.snoozeMany);

  const [filter, setFilter] = useState<MessageFilter>('all');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [detailMessage, setDetailMessage] = useState<Message | null>(null);
  const [cursor, setCursor] = useState(0);
  const [keyboardActive, setKeyboardActive] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const searchRef = useRef<HTMLInputElement | null>(null);

  const visible = useMemo(() => {
    let list = messages;
    if (filter === 'unread') list = list.filter((m) => !m.read);
    else if (filter === 'critical') list = list.filter((m) => m.severity === 'critical');
    const q = search.trim().toLowerCase();
    if (q.length > 0) {
      list = list.filter((m) => t(m.itemNameKey).toLowerCase().includes(q));
    }
    return list;
  }, [messages, filter, search, t]);

  const unreadIds = messages.filter((m) => !m.read).map((m) => m.id);

  useEffect(() => {
    if (keyboardActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (['j', 'k', 'e', 'x', 's', 'Enter', '?', '/', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        setKeyboardActive(true);
      }
    };
    window.addEventListener('keydown', onKey, { once: false });
    return () => window.removeEventListener('keydown', onKey);
  }, [keyboardActive]);

  useMessageKeyboard({
    enabled: !settingsOpen && !detailMessage && !helpOpen,
    count: visible.length,
    cursor,
    setCursor,
    onToggleRead: (i) => {
      const m = visible[i];
      if (!m) return;
      if (m.read) markUnread(m.id);
      else markRead(m.id);
    },
    onDismiss: (i) => {
      const m = visible[i];
      if (!m) return;
      dismiss(m.id);
      setCursor((c) => Math.max(0, c - 1));
    },
    onSnooze: (i) => {
      const m = visible[i];
      if (!m) return;
      snooze(m.id, Date.now() + 24 * 60 * 60 * 1000);
    },
    onOpen: (i) => {
      const m = visible[i];
      if (!m) return;
      setDetailMessage(m);
      if (!m.read) markRead(m.id);
    },
    onShowHelp: () => setHelpOpen(true),
    onFocusSearch: () => searchRef.current?.focus(),
  });

  return (
    <div className={page}>
      <div className={header}>
        <h1 className={title}>{t('messages.title')}</h1>
        <p className={subtitle}>{t('messages.subtitle')}</p>
      </div>

      <SeveritySummary messages={messages} />

      <div className={toolbar} role="toolbar" aria-label={t('messages.title')}>
        <input
          ref={searchRef}
          type="search"
          className={searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('messages.searchPlaceholder')}
          aria-label={t('messages.searchPlaceholder')}
          data-testid="message-search"
        />
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
        <button
          type="button"
          className={settingsButton}
          onClick={() => setHelpOpen(true)}
          aria-label={t('messages.help.title')}
          data-testid="open-help"
          title={t('messages.help.title')}
        >
          <Keyboard size={14} aria-hidden="true" />
        </button>
      </div>

      {selected.size > 0 && (
        <div className={bulkBar} role="region" aria-label={t('messages.bulk.label')} data-testid="bulk-bar">
          <span className={bulkLabel}>
            {t('messages.bulk.label', { count: selected.size })}
          </span>
          <button
            type="button"
            className={bulkButton}
            onClick={() => {
              markAllRead([...selected]);
              setSelected(new Set());
            }}
            data-testid="bulk-mark-read"
          >
            {t('messages.actions.markAllRead')}
          </button>
          <button
            type="button"
            className={bulkButton}
            onClick={() => {
              snoozeMany([...selected], Date.now() + 24 * 60 * 60 * 1000);
              setSelected(new Set());
            }}
            data-testid="bulk-snooze"
          >
            {t('messages.actions.snoozeFor.24h')}
          </button>
          <button
            type="button"
            className={bulkButton}
            onClick={() => {
              dismissMany([...selected]);
              setSelected(new Set());
            }}
            data-testid="bulk-dismiss"
          >
            {t('messages.actions.dismiss')}
          </button>
          <button
            type="button"
            className={bulkButton}
            onClick={() => setSelected(new Set())}
            data-testid="bulk-clear"
            style={{ marginLeft: 'auto' }}
          >
            {t('messages.bulk.clear')}
          </button>
        </div>
      )}

      {visible.length === 0 ? (
        <div className={empty}>{t('messages.empty')}</div>
      ) : (
        <ul className={list} aria-live="polite">
          {visible.map((m, i) => (
            <MessageRow
              key={m.id}
              message={m}
              focused={keyboardActive && i === cursor}
              selected={selected.has(m.id)}
              onSelectChange={(next) =>
                setSelected((prev) => {
                  const out = new Set(prev);
                  if (next) out.add(m.id);
                  else out.delete(m.id);
                  return out;
                })
              }
              onToggleRead={() => (m.read ? markUnread(m.id) : markRead(m.id))}
              onDismiss={() => dismiss(m.id)}
              onSnooze={(durationMs) => snooze(m.id, Date.now() + durationMs)}
              onOpen={() => {
                setDetailMessage(m);
                if (!m.read) markRead(m.id);
              }}
            />
          ))}
        </ul>
      )}

      <MessagesSettings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <MessageDetailDrawer
        message={detailMessage}
        onClose={() => setDetailMessage(null)}
        onJumpToInventory={(id) => onJumpToInventory?.(id)}
      />
      <KeyboardHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}

interface MessageRowProps {
  message: Message;
  focused: boolean;
  selected: boolean;
  onSelectChange: (next: boolean) => void;
  onToggleRead: () => void;
  onDismiss: () => void;
  onSnooze: (durationMs: number) => void;
  onOpen: () => void;
}

const SNOOZE_OPTIONS: Array<{ key: '1h' | '24h' | '7d'; ms: number }> = [
  { key: '1h', ms: 60 * 60 * 1000 },
  { key: '24h', ms: 24 * 60 * 60 * 1000 },
  { key: '7d', ms: 7 * 24 * 60 * 60 * 1000 },
];

function MessageRow({
  message,
  focused,
  selected,
  onSelectChange,
  onToggleRead,
  onDismiss,
  onSnooze,
  onOpen,
}: MessageRowProps) {
  const { t } = useTranslation();
  const dropPercent = useRapidDropPercent(message.itemId);
  const itemName = t(message.itemNameKey);
  const body = t(`messages.body.${message.type}`, {
    name: itemName,
    quantity: message.quantity,
    percent: dropPercent,
  });

  return (
    <li
      className={`${itemRow} ${!message.read ? itemRowUnread : ''} ${focused ? itemRowFocused : ''}`}
      data-testid="message-item"
      data-unread={!message.read}
      data-severity={message.severity}
      data-focused={focused || undefined}
      data-selected={selected || undefined}
    >
      <input
        type="checkbox"
        className={checkbox}
        checked={selected}
        onChange={(e) => onSelectChange(e.target.checked)}
        aria-label={t('messages.bulk.select')}
        data-testid="select-checkbox"
      />
      <span
        className={`${severityDot} ${severityDotVariants[message.severity]}`}
        aria-hidden="true"
      />
      <button type="button" className={itemMainButton} onClick={onOpen} data-testid="open-detail">
        <span className={itemHeading}>
          <span>{t(`messages.type.${message.type}`)}</span>
          <span className={`${severityBadge} ${severityBadgeVariants[message.severity]}`}>
            {t(`messages.severity.${message.severity}`)}
          </span>
        </span>
        <span className={itemBody}>{body}</span>
      </button>
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

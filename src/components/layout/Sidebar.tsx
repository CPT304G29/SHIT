import { useState } from 'react';
import { LayoutList, BarChart3, Calendar, MessageSquare, FolderOpen } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useTranslation } from 'react-i18next';
import { sidebar, navItem, navItemActive } from './Sidebar.css';

const navItems = [
  { id: 'inventory', icon: LayoutList, labelKey: 'nav.inventory', active: true },
  { id: 'charts', icon: BarChart3, labelKey: 'nav.charts', active: false },
  { id: 'calendar', icon: Calendar, labelKey: 'nav.calendar', active: false },
  { id: 'messages', icon: MessageSquare, labelKey: 'nav.messages', active: false },
  { id: 'files', icon: FolderOpen, labelKey: 'nav.files', active: false },
];

export function Sidebar() {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState('inventory');

  return (
    <Tooltip.Provider delayDuration={200}>
      <nav className={sidebar} aria-label="Main navigation">
        {navItems.map(({ id, icon: Icon, labelKey, active }) => {
          const isActive = activeId === id;
          const isDisabled = !active;

          return (
            <Tooltip.Root key={id}>
              <Tooltip.Trigger asChild>
                <button
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                  disabled={isDisabled}
                  onClick={() => {
                    if (isDisabled) return;
                    setActiveId(id);
                  }}
                  className={`${navItem} ${isActive ? navItemActive : ''}`}
                  style={{
                    opacity: isDisabled ? 0.6 : 1,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Icon size={20} />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="right"
                  sideOffset={8}
                  style={{
                    backgroundColor: '#1A1A1A',
                    color: '#FFFFFF',
                    padding: '6px 10px',
                    borderRadius: 4,
                    fontSize: 12,
                    whiteSpace: 'nowrap',
                    zIndex: 101,
                  }}
                >
                  {t(labelKey)}
                  {isDisabled && ` — ${t('comingSoon')}`}
                  <Tooltip.Arrow style={{ fill: '#1A1A1A' }} />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          );
        })}
      </nav>
    </Tooltip.Provider>
  );
}

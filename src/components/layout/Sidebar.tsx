import { LayoutList, BarChart3, Calendar, MessageSquare, FolderOpen } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useTranslation } from 'react-i18next';
import {
  sidebar,
  sidebarExpanded,
  brand,
  brandMark,
  brandText,
  brandTextVisible,
  sectionLabel,
  sectionLabelVisible,
  navList,
  navItem,
  navItemExpanded,
  navItemHover,
  navItemActive,
  iconBox,
  navLabel,
  navLabelVisible,
  divider,
  dividerVisible,
  bottomArea,
  versionText,
  versionTextVisible,
} from './Sidebar.css';

const navItems = [
  { id: 'inventory', icon: LayoutList, labelKey: 'nav.inventory' },
  { id: 'charts', icon: BarChart3, labelKey: 'nav.charts' },
  { id: 'calendar', icon: Calendar, labelKey: 'nav.calendar' },
  { id: 'messages', icon: MessageSquare, labelKey: 'nav.messages' },
  { id: 'files', icon: FolderOpen, labelKey: 'nav.files' },
];

interface SidebarProps {
  expanded: boolean;
  onExpand: (expanded: boolean) => void;
  activePage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ expanded, onExpand, activePage, onNavigate }: SidebarProps) {
  const { t } = useTranslation();

  return (
    <Tooltip.Provider delayDuration={200}>
      <nav
        className={`${sidebar} ${expanded ? sidebarExpanded : ''}`}
        aria-label="Main navigation"
        onMouseEnter={() => onExpand(true)}
        onMouseLeave={() => onExpand(false)}
      >
        {/* Brand */}
        <div className={brand}>
          <div className={brandMark}>U</div>
          <span className={`${brandText} ${expanded ? brandTextVisible : ''}`}>UNIQLO</span>
        </div>

        {/* Section Label */}
        <div className={`${sectionLabel} ${expanded ? sectionLabelVisible : ''}`}>Main Menu</div>

        {/* Navigation */}
        <div className={navList}>
          {navItems.map(({ id, icon: Icon, labelKey }) => {
            const isActive = activePage === id;
            const isDisabled = id !== 'inventory' && id !== 'charts' && id !== 'calendar';

            const button = (
              <button
                type="button"
                aria-label={t(labelKey)}
                aria-current={isActive ? 'page' : undefined}
                disabled={isDisabled}
                onClick={() => {
                  if (isDisabled) return;
                  onNavigate(id);
                }}
                className={`${navItem} ${navItemHover} ${isActive ? navItemActive : ''} ${expanded ? navItemExpanded : ''}`}
                style={{
                  opacity: isDisabled ? 0.4 : 1,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                }}
              >
                <span className={iconBox}>
                  <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                </span>
                <span className={`${navLabel} ${expanded ? navLabelVisible : ''}`}>
                  {t(labelKey)}
                </span>
              </button>
            );

            if (expanded) {
              return <div key={id}>{button}</div>;
            }

            return (
              <Tooltip.Root key={id}>
                <Tooltip.Trigger asChild>{button}</Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="right"
                    sideOffset={10}
                    style={{
                      backgroundColor: '#1A1A1A',
                      color: '#FFFFFF',
                      padding: '6px 12px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      zIndex: 101,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
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
        </div>

        {/* Bottom */}
        <div className={`${divider} ${expanded ? dividerVisible : ''}`} />
        <div className={bottomArea}>
          <span className={`${versionText} ${expanded ? versionTextVisible : ''}`}>SHIT v1.0</span>
        </div>
      </nav>
    </Tooltip.Provider>
  );
}

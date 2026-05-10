import { LayoutList, BarChart3, Calendar, MessageSquare, FolderOpen } from 'lucide-react';
import { LayoutGroup, motion } from 'framer-motion';
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
  navItemWrap,
  navItem,
  navItemExpanded,
  navItemHover,
  navItemActive,
  navItemActiveBackdrop,
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
    <nav
      className={`${sidebar} ${expanded ? sidebarExpanded : ''}`}
      aria-label="Main navigation"
      onMouseEnter={() => onExpand(true)}
      onMouseLeave={() => onExpand(false)}
    >
      <div className={brand}>
        <div className={brandMark}>U</div>
        <span className={`${brandText} ${expanded ? brandTextVisible : ''}`}>UNIQLO</span>
      </div>

      <div className={`${sectionLabel} ${expanded ? sectionLabelVisible : ''}`}>Main Menu</div>

      <LayoutGroup>
        <div className={navList}>
          {navItems.map(({ id, icon: Icon, labelKey }) => {
            const isActive = activePage === id;
            const isDisabled = id !== 'inventory' && id !== 'charts' && id !== 'calendar';

            return (
              <div key={id} className={navItemWrap}>
                <button
                  type="button"
                  aria-label={t(labelKey)}
                  aria-current={isActive ? 'page' : undefined}
                  disabled={isDisabled}
                  title={isDisabled ? `${t(labelKey)} - ${t('comingSoon')}` : undefined}
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
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active-pill"
                      className={navItemActiveBackdrop}
                      transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.9 }}
                    />
                  )}
                  <motion.span
                    className={iconBox}
                    animate={{
                      x: isActive ? 1 : 0,
                      scale: isActive ? 1.06 : 1,
                    }}
                    transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                  </motion.span>
                  <motion.span
                    className={`${navLabel} ${expanded ? navLabelVisible : ''}`}
                    animate={{
                      x: isActive && expanded ? 2 : 0,
                    }}
                    transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {t(labelKey)}
                  </motion.span>
                </button>
              </div>
            );
          })}
        </div>
      </LayoutGroup>

      <div className={`${divider} ${expanded ? dividerVisible : ''}`} />
      <div className={bottomArea}>
        <span className={`${versionText} ${expanded ? versionTextVisible : ''}`}>SHIT v1.0</span>
      </div>
    </nav>
  );
}

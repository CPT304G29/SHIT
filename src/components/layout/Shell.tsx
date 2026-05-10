import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { appShell } from '@/styles/global.css';
import { vars } from '@/styles/theme.css';
import type { Theme } from '@/hooks/useThemeTransition';

interface ShellProps {
  children: ReactNode;
  theme: Theme;
  isTransitioning: boolean;
  onToggleTheme: (event: React.MouseEvent<HTMLElement>) => void;
  activePage: string;
  onNavigate: (page: string) => void;
}

export function Shell({
  children,
  theme,
  isTransitioning,
  onToggleTheme,
  activePage,
  onNavigate,
}: ShellProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const sidebarWidth = sidebarExpanded ? 200 : 64;

  return (
    <div className={appShell}>
      <Sidebar
        expanded={sidebarExpanded}
        onExpand={setSidebarExpanded}
        activePage={activePage}
        onNavigate={onNavigate}
      />
      <div
        style={{
          flex: 1,
          marginLeft: sidebarWidth,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          transition: 'margin-left 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <Header
          theme={theme}
          isTransitioning={isTransitioning}
          onToggleTheme={onToggleTheme}
          sidebarWidth={sidebarWidth}
        />
        <main
          style={{
            flex: 1,
            marginTop: 64,
            padding: '28px 32px',
            backgroundColor: vars.color.surface,
            transition: 'background-color 0.3s ease',
            overflow: 'hidden',
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{ minHeight: '100%' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

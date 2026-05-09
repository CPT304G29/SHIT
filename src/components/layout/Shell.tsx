import { useState, type ReactNode } from 'react';
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
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

import { type ReactNode } from 'react';
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
}

export function Shell({ children, theme, isTransitioning, onToggleTheme }: ShellProps) {
  return (
    <div className={appShell}>
      <Sidebar />
      <div
        style={{
          flex: 1,
          marginLeft: 64,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Header theme={theme} isTransitioning={isTransitioning} onToggleTheme={onToggleTheme} />
        <main
          style={{
            flex: 1,
            marginTop: 56,
            padding: 24,
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

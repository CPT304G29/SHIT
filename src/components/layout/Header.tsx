import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import type { Theme } from '@/hooks/useThemeTransition';
import { header, headerActions, logo } from './Header.css';

interface HeaderProps {
  theme: Theme;
  isTransitioning: boolean;
  onToggleTheme: (event: React.MouseEvent<HTMLElement>) => void;
  sidebarWidth: number;
}

export function Header({ theme, isTransitioning, onToggleTheme, sidebarWidth }: HeaderProps) {
  return (
    <header className={header} style={{ left: sidebarWidth }}>
      <div className={headerActions}>
        <ThemeToggle theme={theme} isTransitioning={isTransitioning} onToggle={onToggleTheme} />
        <LanguageSwitch />
        <img src="/uniqlo_logo.svg" alt="UNIQLO" className={logo} />
      </div>
    </header>
  );
}

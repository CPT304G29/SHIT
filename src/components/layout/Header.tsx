import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import type { Theme } from '@/hooks/useThemeTransition';
import { header, headerTitle, headerActions, logo } from './Header.css';

interface HeaderProps {
  theme: Theme;
  isTransitioning: boolean;
  onToggleTheme: (event: React.MouseEvent<HTMLElement>) => void;
}

export function Header({ theme, isTransitioning, onToggleTheme }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <header className={header}>
      <h1 className={headerTitle}>{t('nav.inventory')}</h1>
      <div className={headerActions}>
        <ThemeToggle theme={theme} isTransitioning={isTransitioning} onToggle={onToggleTheme} />
        <LanguageSwitch />
        <img src="/uniqlo_logo.svg" alt="UNIQLO" className={logo} />
      </div>
    </header>
  );
}

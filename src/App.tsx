import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { lightTheme, darkTheme } from '@/styles/theme.css';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import { useThemeTransition } from '@/hooks/useThemeTransition';

function App() {
  const { theme, isTransitioning, toggleTheme } = useThemeTransition();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className={theme === 'light' ? lightTheme : darkTheme}>
      <div style={{ padding: 40 }}>
        <h1>{t('app.title')}</h1>
        <p>Current theme: {theme}</p>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <ThemeToggle theme={theme} isTransitioning={isTransitioning} onToggle={toggleTheme} />
          <LanguageSwitch />
        </div>
      </div>
    </div>
  );
}

export default App;

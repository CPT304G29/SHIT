import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { lightTheme, darkTheme } from '@/styles/theme.css';
import { Shell } from '@/components/layout/Shell';
import { useThemeTransition } from '@/hooks/useThemeTransition';

function App() {
  const { theme, isTransitioning, toggleTheme } = useThemeTransition();
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className={theme === 'light' ? lightTheme : darkTheme}>
      <Shell theme={theme} isTransitioning={isTransitioning} onToggleTheme={toggleTheme}>
        <div style={{ padding: 40 }}>
          <h1>Content area</h1>
          <p>Inventory table will be rendered here.</p>
        </div>
      </Shell>
    </div>
  );
}

export default App;

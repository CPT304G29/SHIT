import { useEffect } from 'react';
import { lightTheme, darkTheme } from '@/styles/theme.css';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useThemeTransition } from '@/hooks/useThemeTransition';

function App() {
  const { theme, isTransitioning, toggleTheme } = useThemeTransition();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className={theme === 'light' ? lightTheme : darkTheme}>
      <div style={{ padding: 40 }}>
        <h1>Smart Handling Inventory Tracker</h1>
        <p>Current theme: {theme}</p>
        <ThemeToggle theme={theme} isTransitioning={isTransitioning} onToggle={toggleTheme} />
      </div>
    </div>
  );
}

export default App;

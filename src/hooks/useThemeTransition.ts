import { useCallback, useState } from 'react';
import { lightTheme, darkTheme } from '@/styles/theme.css';

export type Theme = 'light' | 'dark';

interface UseThemeTransitionReturn {
  theme: Theme;
  isTransitioning: boolean;
  toggleTheme: (event: React.MouseEvent<HTMLElement>) => void;
}

const STORAGE_KEY = 'shit-theme-preference';

function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    // ignore
  }
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

function applyDomTheme(nextTheme: Theme) {
  document.documentElement.setAttribute('data-theme', nextTheme);
  document.body.classList.remove(lightTheme, darkTheme);
  document.body.classList.add(nextTheme === 'light' ? lightTheme : darkTheme);
}

export function useThemeTransition(): UseThemeTransitionReturn {
  const [theme, setTheme] = useState<Theme>(() => {
    const initial = getInitialTheme();
    applyDomTheme(initial);
    return initial;
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const toggleTheme = useCallback(
    async (event: React.MouseEvent<HTMLElement>) => {
      if (isTransitioning) return;

      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const nextTheme: Theme = theme === 'light' ? 'dark' : 'light';

      document.documentElement.style.setProperty('--vt-x', `${centerX}px`);
      document.documentElement.style.setProperty('--vt-y', `${centerY}px`);

      if (!document.startViewTransition) {
        applyDomTheme(nextTheme);
        setTheme(nextTheme);
        try {
          localStorage.setItem(STORAGE_KEY, nextTheme);
        } catch {
          // ignore
        }
        return;
      }

      setIsTransitioning(true);

      const transition = document.startViewTransition(() => {
        applyDomTheme(nextTheme);
      });

      setTheme(nextTheme);
      try {
        localStorage.setItem(STORAGE_KEY, nextTheme);
      } catch {
        // ignore
      }

      try {
        await transition.finished;
      } catch {
        // ignore transition errors (e.g. interrupted)
      } finally {
        setIsTransitioning(false);
        document.documentElement.style.removeProperty('--vt-x');
        document.documentElement.style.removeProperty('--vt-y');
      }
    },
    [theme, isTransitioning]
  );

  return { theme, isTransitioning, toggleTheme };
}

import { useCallback, useRef, useState } from 'react';
import { themeBg } from '@/styles/theme.css';

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

export function useThemeTransition(): UseThemeTransitionReturn {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const circleRef = useRef<HTMLDivElement | null>(null);

  const toggleTheme = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (isTransitioning) return;

      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const maxRadius = Math.hypot(
        Math.max(centerX, window.innerWidth - centerX),
        Math.max(centerY, window.innerHeight - centerY)
      );

      const nextTheme: Theme = theme === 'light' ? 'dark' : 'light';

      // Use the OLD theme background color so the circle masks the page
      // while the new theme renders underneath.
      const circleColor = themeBg[theme];

      const circle = document.createElement('div');
      circle.style.cssText = `
        position: fixed;
        left: ${centerX}px;
        top: ${centerY}px;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: ${circleColor};
        transform: translate(-50%, -50%) scale(0);
        z-index: 9999;
        pointer-events: none;
        will-change: transform, opacity;
      `;
      document.body.appendChild(circle);
      circleRef.current = circle;
      setIsTransitioning(true);

      // Switch theme immediately on the next frame so the new theme renders
      // underneath the expanding circle mask.
      requestAnimationFrame(() => {
        document.documentElement.setAttribute('data-theme', nextTheme);
        setTheme(nextTheme);
        try {
          localStorage.setItem(STORAGE_KEY, nextTheme);
        } catch {
          // ignore
        }
      });

      const animation = circle.animate(
        [
          { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
          {
            transform: `translate(-50%, -50%) scale(${maxRadius / 50})`,
            opacity: 1,
            offset: 0.85,
          },
          {
            transform: `translate(-50%, -50%) scale(${maxRadius / 50})`,
            opacity: 0,
          },
        ],
        {
          duration: 700,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          fill: 'forwards',
        }
      );

      animation.onfinish = () => {
        circle.remove();
        circleRef.current = null;
        setIsTransitioning(false);
      };
    },
    [theme, isTransitioning]
  );

  return { theme, isTransitioning, toggleTheme };
}

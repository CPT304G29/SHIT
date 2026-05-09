import { Moon, Sun } from 'lucide-react';
import type { Theme } from '@/hooks/useThemeTransition';

interface ThemeToggleProps {
  theme: Theme;
  isTransitioning: boolean;
  onToggle: (event: React.MouseEvent<HTMLElement>) => void;
}

export function ThemeToggle({ theme, isTransitioning, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      disabled={isTransitioning}
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: 4,
        background: 'transparent',
        border: 'none',
        cursor: isTransitioning ? 'wait' : 'pointer',
        opacity: isTransitioning ? 0.5 : 1,
        transition: 'opacity 0.2s ease',
        color: 'inherit',
      }}
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}

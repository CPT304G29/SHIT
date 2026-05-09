import { Moon, Sun } from 'lucide-react';
import type { Theme } from '@/hooks/useThemeTransition';
import { button, buttonDisabled } from './ThemeToggle.css';

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
      className={`${button} ${isTransitioning ? buttonDisabled : ''}`}
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}

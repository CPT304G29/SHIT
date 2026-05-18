import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../../layout/Header';

describe('Header', () => {
  const defaultProps = {
    theme: 'light' as const,
    isTransitioning: false,
    onToggleTheme: vi.fn(),
    sidebarWidth: 64,
  };

  it('renders theme toggle, language switch, and logo', () => {
    render(<Header {...defaultProps} />);

    expect(screen.getByLabelText(/switch to dark mode/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /select language/i })).toBeInTheDocument();
    expect(screen.getByAltText('UNIQLO')).toBeInTheDocument();
  });

  it('offsets header with sidebar width', () => {
    const { container } = render(<Header {...defaultProps} sidebarWidth={200} />);

    const header = container.querySelector('header');
    expect(header).toHaveStyle({ left: '200px' });
  });

  it('forwards theme toggle click', () => {
    const onToggleTheme = vi.fn();
    render(<Header {...defaultProps} onToggleTheme={onToggleTheme} />);

    fireEvent.click(screen.getByLabelText(/switch to dark mode/i));
    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../ThemeToggle';

describe('ThemeToggle', () => {
  it('renders moon icon in light mode', () => {
    render(<ThemeToggle theme="light" isTransitioning={false} onToggle={vi.fn()} />);

    expect(screen.getByLabelText(/switch to dark mode/i)).toBeInTheDocument();
  });

  it('renders sun icon in dark mode', () => {
    render(<ThemeToggle theme="dark" isTransitioning={false} onToggle={vi.fn()} />);

    expect(screen.getByLabelText(/switch to light mode/i)).toBeInTheDocument();
  });

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn();
    render(<ThemeToggle theme="light" isTransitioning={false} onToggle={onToggle} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('is disabled during transition', () => {
    render(<ThemeToggle theme="light" isTransitioning={true} onToggle={vi.fn()} />);

    expect(screen.getByRole('button')).toBeDisabled();
  });
});

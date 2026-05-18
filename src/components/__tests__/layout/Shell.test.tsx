import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Shell } from '../../layout/Shell';

vi.mock('@/features/messages/useMessages', () => ({
  useUnreadCount: () => 0,
}));

describe('Shell', () => {
  const onToggleTheme = vi.fn();
  const onNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderShell(
    props: Partial<Parameters<typeof Shell>[0]> = {},
    childText = 'Page body'
  ) {
    return render(
      <Shell
        theme="dark"
        isTransitioning={false}
        onToggleTheme={onToggleTheme}
        activePage="inventory"
        onNavigate={onNavigate}
        {...props}
      >
        <div data-testid="page-content">{childText}</div>
      </Shell>
    );
  }

  it('renders children inside main content', () => {
    renderShell();

    expect(screen.getByTestId('page-content')).toHaveTextContent('Page body');
  });

  it('renders footer with app title and privacy link', () => {
    renderShell();

    expect(screen.getByText(/SHIT ·/)).toBeInTheDocument();
    expect(screen.getByTestId('footer-privacy-link')).toBeInTheDocument();
  });

  it('navigates to privacy when footer link is clicked', () => {
    renderShell();

    fireEvent.click(screen.getByTestId('footer-privacy-link'));
    expect(onNavigate).toHaveBeenCalledWith('privacy');
  });

  it('forwards theme toggle from header', () => {
    renderShell({ theme: 'light' });

    fireEvent.click(screen.getByLabelText(/switch to dark mode/i));
    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('expands sidebar on hover', () => {
    renderShell();

    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    fireEvent.mouseEnter(nav);

    expect(screen.getByText('SHIT v1.0')).toBeInTheDocument();
  });

  it('disables theme toggle while transitioning', () => {
    renderShell({ isTransitioning: true, theme: 'light' });

    expect(screen.getByLabelText(/switch to dark mode/i)).toBeDisabled();
  });
});

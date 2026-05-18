import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '../../layout/Sidebar';

const mockUseUnreadCount = vi.fn(() => 0);

vi.mock('@/features/messages/useMessages', () => ({
  useUnreadCount: () => mockUseUnreadCount(),
}));

describe('Sidebar', () => {
  const onExpand = vi.fn();
  const onNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUnreadCount.mockReturnValue(0);
  });

  const renderSidebar = (overrides: Partial<Parameters<typeof Sidebar>[0]> = {}) =>
    render(
      <Sidebar
        expanded={false}
        onExpand={onExpand}
        activePage="inventory"
        onNavigate={onNavigate}
        {...overrides}
      />
    );

  it('renders main navigation with brand', () => {
    renderSidebar();

    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    expect(screen.getByText('UNIQLO')).toBeInTheDocument();
    expect(screen.getByText('Main Menu')).toBeInTheDocument();
  });

  it('expands on mouse enter and collapses on mouse leave', () => {
    renderSidebar();

    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    fireEvent.mouseEnter(nav);
    expect(onExpand).toHaveBeenCalledWith(true);

    fireEvent.mouseLeave(nav);
    expect(onExpand).toHaveBeenCalledWith(false);
  });

  it('navigates when an enabled nav item is clicked', () => {
    renderSidebar({ activePage: 'charts' });

    fireEvent.click(screen.getByRole('button', { name: /charts/i }));
    expect(onNavigate).toHaveBeenCalledWith('charts');
  });

  it('marks active page with aria-current', () => {
    renderSidebar({ activePage: 'calendar', expanded: true });

    const calendarButton = screen.getByRole('button', { name: /calendar/i });
    expect(calendarButton).toHaveAttribute('aria-current', 'page');
  });

  it('shows unread badge when messages have unread count', () => {
    mockUseUnreadCount.mockReturnValue(5);
    renderSidebar({ expanded: true, activePage: 'messages' });

    expect(screen.getByTestId('sidebar-unread-badge')).toHaveTextContent('5');
  });

  it('caps unread badge at 99+', () => {
    mockUseUnreadCount.mockReturnValue(150);
    renderSidebar({ expanded: true });

    expect(screen.getByTestId('sidebar-unread-badge')).toHaveTextContent('99+');
  });

  it('includes unread count in messages aria-label', () => {
    mockUseUnreadCount.mockReturnValue(3);
    renderSidebar();

    expect(screen.getByRole('button', { name: /messages.*unread/i })).toBeInTheDocument();
  });

  it('shows version text when expanded', () => {
    renderSidebar({ expanded: true });

    expect(screen.getByText('SHIT v1.0')).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from '@/lib/i18n';
import { LanguageSwitch } from '../LanguageSwitch';

describe('LanguageSwitch', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
  });

  it('shows current language native label on trigger', () => {
    render(<LanguageSwitch />);

    expect(screen.getByRole('button', { name: /select language/i })).toHaveTextContent('En');
  });

  it('falls back to uppercase code when language is unknown', async () => {
    await i18n.changeLanguage('fr' as 'en');
    render(<LanguageSwitch />);

    expect(screen.getByRole('button', { name: /select language/i })).toHaveTextContent('FR');
  });

  it('changes language when a menu item is selected', async () => {
    const changeLanguage = vi.spyOn(i18n, 'changeLanguage');
    const user = userEvent.setup();

    render(<LanguageSwitch />);

    await user.click(screen.getByRole('button', { name: /select language/i }));
    await user.click(screen.getByRole('menuitem', { name: /中.*中文/ }));

    expect(changeLanguage).toHaveBeenCalledWith('zh');
  });

  it('marks the active language with a check icon', async () => {
    await i18n.changeLanguage('ja');
    const user = userEvent.setup();

    render(<LanguageSwitch />);

    await user.click(screen.getByRole('button', { name: /select language/i }));

    const japaneseItem = screen.getByRole('menuitem', { name: /日.*日本語/ });
    expect(japaneseItem).toBeInTheDocument();
  });
});

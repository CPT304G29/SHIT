import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PrivacyPolicy } from '../PrivacyPolicy';

describe('PrivacyPolicy', () => {
  it('lists every persisted storage key used by the app, including consent', () => {
    render(<PrivacyPolicy />);

    const table = screen.getByTestId('privacy-storage-table');
    const view = within(table);

    expect(view.getByText('shit-inventory')).toBeInTheDocument();
    expect(view.getByText('shit-messages')).toBeInTheDocument();
    expect(view.getByText('shit-messages-settings')).toBeInTheDocument();
    expect(view.getByText('shit-messages-history')).toBeInTheDocument();
    expect(view.getByText('shit-theme-preference')).toBeInTheDocument();
    expect(view.getByText('shit-language')).toBeInTheDocument();
    expect(view.getByText('i18nextLng')).toBeInTheDocument();
    expect(view.getByText('shit-cookie-consent')).toBeInTheDocument();
  });
});

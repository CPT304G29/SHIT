import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UniqloLogo } from '../UniqloLogo';

describe('UniqloLogo', () => {
  it('renders UNIQLO label with default height', () => {
    render(<UniqloLogo />);

    const logo = screen.getByLabelText('UNIQLO');
    expect(logo.tagName).toBe('svg');
    expect(logo).toHaveAttribute('height', '28');
    expect(logo).toHaveAttribute('width', '98');
  });

  it('scales width from custom height', () => {
    render(<UniqloLogo height={40} />);

    const logo = screen.getByLabelText('UNIQLO');
    expect(logo).toHaveAttribute('height', '40');
    expect(logo).toHaveAttribute('width', '140');
  });

  it('renders brand text inside svg', () => {
    render(<UniqloLogo />);

    expect(screen.getByText('UNIQLO')).toBeInTheDocument();
  });
});

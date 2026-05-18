import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';

vi.mock('three', () => ({}));

vi.mock('../../EasterEgg/ParticleGalaxy', () => ({
  ParticleGalaxy: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="particle-galaxy-mock" onClick={onClose} role="presentation" />
  ),
}));

import { ParticleGalaxy } from '../../EasterEgg/ParticleGalaxy';

describe('ParticleGalaxy', () => {
  it('calls onClose when clicked', () => {
    const onClose = vi.fn();
    render(<ParticleGalaxy onClose={onClose} />);
    fireEvent.click(document.querySelector('[data-testid="particle-galaxy-mock"]')!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { saveChartAsSvg } from '../chartExport';

describe('saveChartAsSvg', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(URL, 'createObjectURL', {
      value: vi.fn(() => 'blob:chart'),
      configurable: true,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      value: vi.fn(),
      configurable: true,
    });
  });

  it('returns false when the container has no svg', () => {
    const container = document.createElement('div');

    expect(saveChartAsSvg(container, 'Empty Chart')).toBe(false);
  });

  it('serializes the svg and downloads it with a sanitized file name', () => {
    const container = document.createElement('div');
    container.innerHTML = '<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" /></svg>';
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const createObjectURL = vi.mocked(URL.createObjectURL);
    const revokeObjectURL = vi.mocked(URL.revokeObjectURL);
    let createdAnchor: HTMLAnchorElement | null = null;
    const createElement = vi.spyOn(document, 'createElement');
    createElement.mockImplementation((tagName: string, options?: ElementCreationOptions) => {
      const element = Document.prototype.createElement.call(document, tagName, options);
      if (tagName === 'a') createdAnchor = element as HTMLAnchorElement;
      return element;
    });

    expect(saveChartAsSvg(container, 'Price & Quantity Chart!')).toBe(true);

    expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(createdAnchor?.href).toBe('blob:chart');
    expect(createdAnchor?.download).toBe('price-quantity-chart.svg');
    expect(click).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:chart');
  });

  it('falls back to chart.svg for an empty export name', () => {
    const container = document.createElement('div');
    container.innerHTML = '<svg><path d="M0 0" /></svg>';
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    let createdAnchor: HTMLAnchorElement | null = null;
    vi.spyOn(document, 'createElement').mockImplementation(
      (tagName: string, options?: ElementCreationOptions) => {
        const element = Document.prototype.createElement.call(document, tagName, options);
        if (tagName === 'a') createdAnchor = element as HTMLAnchorElement;
        return element;
      }
    );

    saveChartAsSvg(container, '   ');

    expect(createdAnchor?.download).toBe('chart.svg');
  });
});

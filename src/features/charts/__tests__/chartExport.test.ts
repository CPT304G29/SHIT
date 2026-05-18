import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { saveChartAsSvg } from '../chartExport';

describe('saveChartAsSvg', () => {
  let createObjectURL: ReturnType<typeof vi.fn>;
  let revokeObjectURL: ReturnType<typeof vi.fn>;
  let click: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    createObjectURL = vi.fn(() => 'blob:chart-svg');
    revokeObjectURL = vi.fn();
    click = vi.fn();

    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: createObjectURL,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: revokeObjectURL,
    });
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(click);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns false when the container has no SVG', () => {
    const container = document.createElement('div');

    expect(saveChartAsSvg(container, 'Stock Levels')).toBe(false);
    expect(createObjectURL).not.toHaveBeenCalled();
    expect(click).not.toHaveBeenCalled();
  });

  it('serializes the first SVG and downloads it with a sanitized file name', () => {
    const container = document.createElement('div');
    container.innerHTML = '<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" /></svg>';
    let downloadedName = '';

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const element = document.createElementNS('http://www.w3.org/1999/xhtml', tagName);
      if (tagName === 'a') {
        Object.defineProperty(element, 'download', {
          configurable: true,
          get: () => downloadedName,
          set: (value: string) => {
            downloadedName = value;
          },
        });
      }
      return element as HTMLElement;
    });

    expect(saveChartAsSvg(container, ' Stock Levels! 2026 ')).toBe(true);

    expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    const blob = createObjectURL.mock.calls[0][0] as Blob;
    expect(blob.type).toBe('image/svg+xml;charset=utf-8');
    expect(downloadedName).toBe('stock-levels-2026.svg');
    expect(click).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:chart-svg');
  });

  it('falls back to chart.svg when the provided name has no safe characters', () => {
    const container = document.createElement('div');
    container.innerHTML = '<svg><rect width="10" height="10" /></svg>';
    let downloadedName = '';

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const element = document.createElementNS('http://www.w3.org/1999/xhtml', tagName);
      if (tagName === 'a') {
        Object.defineProperty(element, 'download', {
          configurable: true,
          get: () => downloadedName,
          set: (value: string) => {
            downloadedName = value;
          },
        });
      }
      return element as HTMLElement;
    });

    expect(saveChartAsSvg(container, ' /// ')).toBe(true);
    expect(downloadedName).toBe('chart.svg');
  });
});

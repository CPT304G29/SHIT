function sanitizeFileName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function saveChartAsSvg(container: HTMLElement, fileName: string): boolean {
  const svg = container.querySelector('svg');
  if (!svg) return false;

  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  const serialized = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = `${sanitizeFileName(fileName) || 'chart'}.svg`;
  anchor.click();

  URL.revokeObjectURL(url);
  return true;
}

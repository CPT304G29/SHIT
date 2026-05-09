import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from './theme.css';

export const appShell = style({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: vars.color.bg,
});

export const sidebarWidth = '64px';
export const headerHeight = '56px';

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
});

globalStyle('html', {
  fontSize: '16px',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
});

globalStyle('body', {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
  color: vars.color.text,
  backgroundColor: vars.color.bg,
  lineHeight: 1.5,
  minHeight: '100vh',
  transition: 'background-color 0.3s ease, color 0.3s ease',
});

globalStyle('button', {
  fontFamily: 'inherit',
  cursor: 'pointer',
  border: 'none',
  background: 'none',
});

globalStyle('input, textarea', {
  fontFamily: 'inherit',
});

globalStyle('a', {
  color: 'inherit',
  textDecoration: 'none',
});

globalStyle('ul, ol', {
  listStyle: 'none',
});

globalStyle('img', {
  maxWidth: '100%',
  height: 'auto',
  display: 'block',
});

globalStyle('[hidden]', {
  display: 'none !important',
});

// Focus styles for accessibility
globalStyle(':focus-visible', {
  outline: `2px solid ${vars.color.brand}`,
  outlineOffset: '2px',
});

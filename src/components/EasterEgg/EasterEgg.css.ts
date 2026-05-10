import { style } from '@vanilla-extract/css';

export const overlay = style({
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  backdropFilter: 'blur(8px)',
  cursor: 'pointer',
  animation: 'fadeIn 0.6s ease-out',
});

export const canvas = style({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
});

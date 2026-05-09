import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const button = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  borderRadius: 10,
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: vars.color.textMuted,
  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  selectors: {
    '&:hover': {
      backgroundColor: vars.color.surfaceHover,
      color: vars.color.text,
      transform: 'scale(1.08)',
    },
    '&:active': {
      transform: 'scale(0.96)',
    },
  },
});

export const buttonDisabled = style({
  opacity: 0.4,
  cursor: 'wait',
  selectors: {
    '&:hover': {
      backgroundColor: 'transparent',
      transform: 'none',
    },
  },
});

import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const header = style({
  position: 'fixed',
  top: 0,
  right: 0,
  height: 64,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '0 28px',
  backgroundColor: vars.color.bg,
  borderBottom: `1px solid ${vars.color.border}`,
  zIndex: 99,
  transition: 'left 0.35s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease, border-color 0.3s ease',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
});

export const headerActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

export const logo = style({
  height: 28,
  width: 'auto',
  opacity: 0.95,
  transition: 'opacity 0.2s ease',
  selectors: {
    '&:hover': {
      opacity: 1,
    },
  },
});

import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const header = style({
  position: 'fixed',
  top: 0,
  left: 64,
  right: 0,
  height: 64,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 28px',
  backgroundColor: vars.color.bg,
  borderBottom: `1px solid ${vars.color.border}`,
  zIndex: 99,
  transition: 'background-color 0.3s ease, border-color 0.3s ease',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
});

export const headerTitle = style({
  fontSize: 20,
  fontWeight: 700,
  color: vars.color.text,
  letterSpacing: '-0.02em',
  lineHeight: 1.2,
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

import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const header = style({
  position: 'fixed',
  top: 0,
  left: 64,
  right: 0,
  height: 56,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 24px',
  backgroundColor: vars.color.bg,
  borderBottom: `1px solid ${vars.color.border}`,
  zIndex: 99,
  transition: 'background-color 0.3s ease, border-color 0.3s ease',
});

export const headerTitle = style({
  fontSize: 16,
  fontWeight: 600,
  color: vars.color.text,
  letterSpacing: '-0.01em',
});

export const headerActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
});

export const logo = style({
  height: 28,
  width: 'auto',
});

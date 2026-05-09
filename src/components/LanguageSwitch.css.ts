import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

const slideDown = keyframes({
  from: { opacity: 0, transform: 'translateY(-6px) scale(0.96)' },
  to: { opacity: 1, transform: 'translateY(0) scale(1)' },
});

export const trigger = style({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '7px 12px',
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  color: vars.color.text,
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  lineHeight: 1,
  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  ':hover': {
    borderColor: vars.color.borderHover,
    background: vars.color.surfaceHover,
    boxShadow: vars.shadow.sm,
    transform: 'translateY(-1px)',
  },
  ':focus-visible': {
    outline: `2px solid ${vars.color.brand}`,
    outlineOffset: 2,
  },
});

export const content = style({
  position: 'relative',
  zIndex: 999,
  background: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.xl,
  boxShadow: vars.shadow.lg,
  padding: 10,
  minWidth: 170,
  marginTop: 6,
  animation: `${slideDown} 0.2s cubic-bezier(0.16, 1, 0.3, 1)`,
});

export const header = style({
  padding: '6px 10px 8px',
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: vars.color.textMuted,
  borderBottom: `1px solid ${vars.color.border}`,
  marginBottom: 4,
});

export const item = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '10px 14px',
  borderRadius: vars.radius.lg,
  fontSize: 14,
  cursor: 'pointer',
  color: vars.color.text,
  background: 'transparent',
  outline: 'none',
  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
  ':hover': {
    background: vars.color.surfaceHover,
    transform: 'translateX(2px)',
  },
});

export const itemActive = style({
  color: vars.color.brand,
  fontWeight: 600,
  background: vars.color.surface,
  ':hover': {
    background: vars.color.surface,
    transform: 'translateX(1px)',
  },
});

export const itemLabel = style({
  color: vars.color.textMuted,
  fontSize: 12,
  marginLeft: 6,
  fontWeight: 400,
});

export const checkIcon = style({
  color: vars.color.brand,
  flexShrink: 0,
});

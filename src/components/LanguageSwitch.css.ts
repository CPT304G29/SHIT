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
  padding: '6px 10px',
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  color: vars.color.text,
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  lineHeight: 1,
  transition: 'border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
  ':hover': {
    borderColor: vars.color.borderHover,
    background: vars.color.surfaceHover,
    boxShadow: vars.shadow.sm,
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
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.lg,
  padding: 8,
  minWidth: 160,
  marginTop: 6,
  animation: `${slideDown} 0.18s cubic-bezier(0.16, 1, 0.3, 1)`,
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
  padding: '9px 12px',
  borderRadius: vars.radius.md,
  fontSize: 14,
  cursor: 'pointer',
  color: vars.color.text,
  background: 'transparent',
  outline: 'none',
  transition: 'background-color 0.15s ease, color 0.15s ease, transform 0.1s ease',
  ':hover': {
    background: vars.color.surfaceHover,
    transform: 'translateX(1px)',
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

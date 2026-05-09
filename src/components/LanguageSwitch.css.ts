import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const trigger = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  padding: '4px 8px',
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  color: vars.color.text,
  fontSize: 12,
  fontWeight: 500,
  cursor: 'pointer',
  lineHeight: 1,
  transition: 'border-color 0.2s ease, background-color 0.2s ease',
  ':hover': {
    borderColor: vars.color.borderHover,
    background: vars.color.surfaceHover,
  },
});

export const content = style({
  background: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  boxShadow: vars.shadow.md,
  padding: 4,
  minWidth: 120,
  zIndex: 101,
});

export const item = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  padding: '6px 10px',
  borderRadius: vars.radius.sm,
  fontSize: 13,
  cursor: 'pointer',
  color: vars.color.text,
  background: 'transparent',
  outline: 'none',
  transition: 'background-color 0.15s ease',
  ':hover': {
    background: vars.color.surfaceHover,
  },
});

export const itemActive = style({
  color: vars.color.brand,
  background: vars.color.surface,
  ':hover': {
    background: vars.color.surface,
  },
});

export const itemLabel = style({
  color: vars.color.textMuted,
  fontSize: 12,
  marginLeft: 4,
});

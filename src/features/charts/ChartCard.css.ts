import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const card = style({
  backgroundColor: vars.color.bg,
  borderRadius: vars.radius.xl,
  padding: '20px 24px',
  boxShadow: vars.shadow.sm,
  transition: 'box-shadow 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: '100%',
  height: '100%',
  minHeight: 0,
  selectors: {
    '&:hover': {
      boxShadow: vars.shadow.md,
    },
  },
});

export const cardHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  flexShrink: 0,
});

export const cardTitle = style({
  fontSize: 11,
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: vars.color.textMuted,
});

export const saveButton = style({
  appearance: 'none',
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  backgroundColor: vars.color.bg,
  color: vars.color.textMuted,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  transition: 'background-color 120ms, color 120ms, border-color 120ms',
  ':hover': {
    backgroundColor: vars.color.surfaceHover,
    borderColor: vars.color.borderHover,
    color: vars.color.text,
  },
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${vars.color.ring}`,
      outlineOffset: 2,
    },
  },
});

export const cardContent = style({
  flex: 1,
  minHeight: 0,
  position: 'relative',
});

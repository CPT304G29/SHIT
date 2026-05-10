import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

const slideUp = keyframes({
  from: { transform: 'translateY(100%)', opacity: 0 },
  to: { transform: 'translateY(0)', opacity: 1 },
});

export const banner = style({
  position: 'fixed',
  left: 16,
  right: 16,
  bottom: 16,
  zIndex: 400,
  maxWidth: 720,
  margin: '0 auto',
  padding: 20,
  backgroundColor: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.xl,
  boxShadow: vars.shadow.xl,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  animation: `${slideUp} 0.35s cubic-bezier(0.16, 1, 0.3, 1)`,
  '@media': {
    '(min-width: 600px)': {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
});

export const text = style({
  flex: 1,
  fontSize: 13,
  lineHeight: 1.5,
  color: vars.color.text,
  margin: 0,
});

export const link = style({
  color: vars.color.brand,
  textDecoration: 'underline',
  cursor: 'pointer',
  background: 'transparent',
  border: 'none',
  padding: 0,
  font: 'inherit',
  selectors: {
    '&:hover': {
      color: vars.color.brandHover,
    },
    '&:focus-visible': {
      outline: `2px solid ${vars.color.ring}`,
      outlineOffset: 2,
      borderRadius: vars.radius.sm,
    },
  },
});

export const actions = style({
  display: 'flex',
  gap: vars.space.sm,
  flexShrink: 0,
});

export const button = style({
  appearance: 'none',
  border: `1px solid ${vars.color.border}`,
  background: vars.color.bg,
  padding: '8px 16px',
  fontSize: 13,
  fontWeight: 600,
  color: vars.color.text,
  borderRadius: vars.radius.md,
  cursor: 'pointer',
  transition: 'background-color 120ms, border-color 120ms',
  ':hover': {
    backgroundColor: vars.color.surfaceHover,
    borderColor: vars.color.borderHover,
  },
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${vars.color.ring}`,
      outlineOffset: 2,
    },
  },
});

export const buttonPrimary = style({
  backgroundColor: vars.color.brand,
  color: vars.color.textInverse,
  borderColor: vars.color.brand,
  ':hover': {
    backgroundColor: vars.color.brandHover,
    borderColor: vars.color.brandHover,
  },
});

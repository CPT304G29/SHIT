import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const scaleIn = keyframes({
  from: { opacity: 0, transform: 'translate(-50%, -50%) scale(0.96)' },
  to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
});

export const overlay = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.35)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  zIndex: 200,
  animation: `${fadeIn} 0.25s ease`,
});

export const content = style({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 480,
  backgroundColor: vars.color.bg,
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border}`,
  boxShadow: vars.shadow.xl,
  zIndex: 201,
  padding: 28,
  animation: `${scaleIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1)`,
});

export const title = style({
  fontSize: 20,
  fontWeight: 700,
  color: vars.color.text,
  marginBottom: 24,
  letterSpacing: '-0.01em',
});

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  marginBottom: 20,
});

export const label = style({
  fontSize: 13,
  fontWeight: 600,
  color: vars.color.textMuted,
  letterSpacing: '0.02em',
});

export const input = style({
  padding: '11px 14px',
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.bg,
  color: vars.color.text,
  fontSize: 14,
  outline: 'none',
  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  selectors: {
    '&:focus': {
      borderColor: vars.color.brand,
      boxShadow: `0 0 0 3px ${vars.color.ring}`,
    },
    '&:hover:not(:focus)': {
      borderColor: vars.color.borderHover,
    },
  },
});

export const inputDisabled = style({
  backgroundColor: vars.color.surface,
  color: vars.color.textMuted,
  cursor: 'not-allowed',
});

export const actions = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 12,
  marginTop: 4,
});

export const btnPrimary = style({
  padding: '11px 22px',
  borderRadius: vars.radius.lg,
  backgroundColor: vars.color.brand,
  color: vars.color.textInverse,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  border: 'none',
  boxShadow: '0 2px 8px rgba(229, 0, 18, 0.2)',
  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  selectors: {
    '&:hover': {
      backgroundColor: vars.color.brandHover,
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 14px rgba(229, 0, 18, 0.3)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
});

export const btnSecondary = style({
  padding: '11px 22px',
  borderRadius: vars.radius.lg,
  backgroundColor: 'transparent',
  color: vars.color.text,
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
  border: `1px solid ${vars.color.border}`,
  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  selectors: {
    '&:hover': {
      backgroundColor: vars.color.surfaceHover,
      borderColor: vars.color.borderHover,
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
});

export const btnDanger = style({
  padding: '11px 22px',
  borderRadius: vars.radius.lg,
  backgroundColor: vars.color.danger,
  color: vars.color.textInverse,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  border: 'none',
  boxShadow: '0 2px 8px rgba(229, 0, 18, 0.2)',
  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  selectors: {
    '&:hover': {
      backgroundColor: vars.color.dangerHover,
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 14px rgba(229, 0, 18, 0.3)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
});

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
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  zIndex: 200,
  animation: `${fadeIn} 0.2s ease`,
});

export const content = style({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 480,
  backgroundColor: vars.color.bg,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  boxShadow: vars.shadow.lg,
  zIndex: 201,
  padding: 24,
  animation: `${scaleIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1)`,
});

export const title = style({
  fontSize: 18,
  fontWeight: 600,
  color: vars.color.text,
  marginBottom: 20,
});

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  marginBottom: 16,
});

export const label = style({
  fontSize: 13,
  fontWeight: 500,
  color: vars.color.textMuted,
});

export const input = style({
  padding: '10px 12px',
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.bg,
  color: vars.color.text,
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.2s ease',
  selectors: {
    '&:focus': {
      borderColor: vars.color.brand,
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
  marginTop: 8,
});

export const btnPrimary = style({
  padding: '10px 20px',
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.brand,
  color: vars.color.textInverse,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  selectors: {
    '&:hover': {
      backgroundColor: vars.color.brandHover,
    },
  },
});

export const btnSecondary = style({
  padding: '10px 20px',
  borderRadius: vars.radius.md,
  backgroundColor: 'transparent',
  color: vars.color.text,
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
  border: `1px solid ${vars.color.border}`,
  transition: 'background-color 0.2s ease',
  selectors: {
    '&:hover': {
      backgroundColor: vars.color.surface,
    },
  },
});

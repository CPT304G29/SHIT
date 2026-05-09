import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
});

export const toolbar = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
});

export const searchInput = style({
  padding: '10px 14px 10px 38px',
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.bg,
  color: vars.color.text,
  fontSize: 14,
  width: 320,
  outline: 'none',
  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  selectors: {
    '&:focus': {
      borderColor: vars.color.brand,
      boxShadow: `0 0 0 3px ${vars.color.ring}`,
    },
    '&::placeholder': {
      color: vars.color.textMuted,
    },
  },
});

export const addButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 18px',
  borderRadius: vars.radius.lg,
  backgroundColor: vars.color.brand,
  color: vars.color.textInverse,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  border: 'none',
  boxShadow: '0 2px 8px rgba(229, 0, 18, 0.25)',
  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  selectors: {
    '&:hover': {
      backgroundColor: vars.color.brandHover,
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 14px rgba(229, 0, 18, 0.35)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 1px 4px rgba(229, 0, 18, 0.2)',
    },
  },
});

export const tableWrapper = style({
  backgroundColor: vars.color.bg,
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border}`,
  overflow: 'hidden',
  boxShadow: vars.shadow.md,
  transition: 'box-shadow 0.3s ease',
});

export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 14,
});

export const thead = style({
  backgroundColor: vars.color.surface,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const th = style({
  padding: '14px 20px',
  textAlign: 'left',
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: vars.color.textMuted,
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'color 0.2s ease',
  fontFeatureSettings: '"tnum"',
  selectors: {
    '&:hover': {
      color: vars.color.text,
    },
  },
});

export const thRight = style({
  textAlign: 'right',
});

export const tbody = style({});

export const tr = style({
  borderBottom: `1px solid ${vars.color.border}`,
  transition: 'background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
  selectors: {
    '&:last-child': {
      borderBottom: 'none',
    },
    '&:hover': {
      backgroundColor: vars.color.surfaceHover,
      boxShadow: `inset 3px 0 0 0 ${vars.color.brand}`,
    },
  },
});

export const td = style({
  padding: '16px 20px',
  color: vars.color.text,
  verticalAlign: 'middle',
  fontWeight: 500,
  transition: 'color 0.15s ease',
});

export const tdRight = style({
  textAlign: 'right',
  fontFeatureSettings: '"tnum"',
});

export const tdActions = style({
  padding: '16px 20px',
  display: 'flex',
  gap: 4,
  justifyContent: 'flex-end',
  opacity: 0,
  transition: 'opacity 0.2s ease',
});

globalStyle(`${tr}:hover ${tdActions}`, {
  opacity: 1,
});

export const actionButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: vars.radius.md,
  color: vars.color.textMuted,
  cursor: 'pointer',
  border: 'none',
  background: 'transparent',
  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
  selectors: {
    '&:hover': {
      color: vars.color.brand,
      backgroundColor: vars.color.surfaceHover,
      transform: 'scale(1.1)',
    },
  },
});

export const emptyState = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '100px 24px',
  gap: 20,
  color: vars.color.textMuted,
  textAlign: 'center',
});

export const categoryBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 10px',
  borderRadius: 20,
  fontSize: 12,
  fontWeight: 500,
  backgroundColor: vars.color.surface,
  color: vars.color.textMuted,
  border: `1px solid ${vars.color.border}`,
  transition: 'all 0.2s ease',
});

globalStyle(`${tr}:hover ${categoryBadge}`, {
  backgroundColor: vars.color.bg,
  color: vars.color.text,
  borderColor: vars.color.borderHover,
});

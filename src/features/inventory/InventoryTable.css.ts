import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
});

export const toolbar = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
});

export const searchInput = style({
  padding: '8px 12px',
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.bg,
  color: vars.color.text,
  fontSize: 14,
  width: 280,
  outline: 'none',
  transition: 'border-color 0.2s ease',
  selectors: {
    '&:focus': {
      borderColor: vars.color.brand,
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
  padding: '8px 16px',
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

export const tableWrapper = style({
  backgroundColor: vars.color.bg,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  overflow: 'hidden',
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
  padding: '14px 16px',
  textAlign: 'left',
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: vars.color.textMuted,
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'color 0.15s ease',
  selectors: {
    '&:hover': {
      color: vars.color.text,
    },
  },
});

export const tbody = style({});

export const tr = style({
  borderBottom: `1px solid ${vars.color.border}`,
  transition: 'background-color 0.15s ease',
  selectors: {
    '&:last-child': {
      borderBottom: 'none',
    },
    '&:hover': {
      backgroundColor: vars.color.surfaceHover,
    },
  },
});

export const td = style({
  padding: '16px',
  color: vars.color.text,
  verticalAlign: 'middle',
});

export const tdActions = style({
  padding: '16px',
  display: 'flex',
  gap: 8,
  justifyContent: 'flex-end',
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
  transition: 'color 0.15s ease, background-color 0.15s ease',
  selectors: {
    '&:hover': {
      color: vars.color.brand,
      backgroundColor: vars.color.surface,
    },
  },
});

export const emptyState = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '80px 24px',
  gap: 16,
  color: vars.color.textMuted,
  textAlign: 'center',
});

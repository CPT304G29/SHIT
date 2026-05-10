import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
  maxWidth: 760,
});

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
});

export const title = style({
  fontSize: 28,
  fontWeight: 600,
  color: vars.color.text,
  margin: 0,
});

export const subtitle = style({
  fontSize: 14,
  color: vars.color.textMuted,
  margin: 0,
});

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});

export const sectionTitle = style({
  fontSize: 18,
  fontWeight: 600,
  color: vars.color.text,
  margin: 0,
});

export const paragraph = style({
  fontSize: 14,
  lineHeight: 1.6,
  color: vars.color.text,
  margin: 0,
});

export const muted = style({
  fontSize: 13,
  color: vars.color.textMuted,
});

export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 13,
  backgroundColor: vars.color.surface,
  borderRadius: vars.radius.lg,
  overflow: 'hidden',
});

export const th = style({
  textAlign: 'left',
  padding: '10px 14px',
  borderBottom: `1px solid ${vars.color.border}`,
  fontWeight: 600,
  fontSize: 12,
  letterSpacing: 0.4,
  textTransform: 'uppercase',
  color: vars.color.textMuted,
});

export const td = style({
  padding: '10px 14px',
  borderBottom: `1px solid ${vars.color.border}`,
  color: vars.color.text,
  verticalAlign: 'top',
});

export const code = style({
  fontFamily: 'Consolas, "Courier New", monospace',
  fontSize: 12,
  padding: '2px 6px',
  backgroundColor: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
});

export const status = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 12px',
  borderRadius: vars.radius.md,
  fontSize: 13,
  fontWeight: 500,
  width: 'fit-content',
});

export const statusUndecided = style({
  backgroundColor: 'rgba(229, 167, 0, 0.12)',
  color: '#A77A00',
});

export const statusAccepted = style({
  backgroundColor: 'rgba(30, 142, 62, 0.12)',
  color: vars.color.success,
});

export const statusRejected = style({
  backgroundColor: 'rgba(229, 0, 18, 0.12)',
  color: vars.color.danger,
});

export const buttonRow = style({
  display: 'flex',
  gap: vars.space.sm,
  flexWrap: 'wrap',
});

export const button = style({
  appearance: 'none',
  border: `1px solid ${vars.color.border}`,
  background: vars.color.bg,
  padding: '8px 16px',
  fontSize: 13,
  fontWeight: 500,
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

export const buttonDanger = style({
  borderColor: vars.color.danger,
  color: vars.color.danger,
  ':hover': {
    backgroundColor: 'rgba(229, 0, 18, 0.08)',
    borderColor: vars.color.dangerHover,
  },
});

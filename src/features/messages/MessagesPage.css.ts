import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
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

export const toolbar = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  flexWrap: 'wrap',
});

export const filters = style({
  display: 'inline-flex',
  borderRadius: vars.radius.lg,
  backgroundColor: vars.color.surface,
  padding: 4,
  gap: 2,
});

export const filterButton = style({
  appearance: 'none',
  border: 'none',
  background: 'transparent',
  padding: '6px 14px',
  fontSize: 13,
  fontWeight: 500,
  color: vars.color.textMuted,
  borderRadius: vars.radius.md,
  cursor: 'pointer',
  transition: 'background-color 120ms, color 120ms',
  ':hover': {
    color: vars.color.text,
  },
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${vars.color.ring}`,
      outlineOffset: 2,
    },
  },
});

export const filterButtonActive = style({
  backgroundColor: vars.color.bg,
  color: vars.color.text,
  boxShadow: vars.shadow.sm,
});

export const markAllButton = style({
  marginLeft: 'auto',
  appearance: 'none',
  border: `1px solid ${vars.color.border}`,
  background: vars.color.bg,
  padding: '6px 12px',
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
  ':disabled': {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${vars.color.ring}`,
      outlineOffset: 2,
    },
  },
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});

export const itemRow = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.space.md,
  padding: vars.space.md,
  backgroundColor: vars.color.surface,
  borderRadius: vars.radius.lg,
  borderLeft: '3px solid transparent',
  transition: 'background-color 120ms',
  ':hover': {
    backgroundColor: vars.color.surfaceHover,
  },
});

export const itemRowUnread = style({
  backgroundColor: vars.color.bg,
  borderLeftColor: vars.color.brand,
  boxShadow: vars.shadow.sm,
});

export const severityDot = style({
  width: 10,
  height: 10,
  borderRadius: '50%',
  marginTop: 6,
  flexShrink: 0,
});

export const severityDotVariants = styleVariants({
  critical: { backgroundColor: vars.color.danger },
  warning: { backgroundColor: '#E5A700' },
  info: { backgroundColor: vars.color.success },
});

export const itemMain = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

export const itemHeading = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  fontSize: 14,
  fontWeight: 600,
  color: vars.color.text,
});

export const itemBody = style({
  fontSize: 13,
  color: vars.color.textMuted,
  lineHeight: 1.5,
});

export const severityBadge = style({
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 0.4,
  textTransform: 'uppercase',
  padding: '2px 8px',
  borderRadius: vars.radius.sm,
});

export const severityBadgeVariants = styleVariants({
  critical: {
    backgroundColor: 'rgba(229, 0, 18, 0.12)',
    color: vars.color.danger,
  },
  warning: {
    backgroundColor: 'rgba(229, 167, 0, 0.15)',
    color: '#A77A00',
  },
  info: {
    backgroundColor: 'rgba(30, 142, 62, 0.12)',
    color: vars.color.success,
  },
});

export const itemActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  flexShrink: 0,
});

export const iconButton = style({
  appearance: 'none',
  border: 'none',
  background: 'transparent',
  padding: 6,
  borderRadius: vars.radius.md,
  cursor: 'pointer',
  color: vars.color.textMuted,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 120ms, color 120ms',
  ':hover': {
    backgroundColor: vars.color.surfaceHover,
    color: vars.color.text,
  },
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${vars.color.ring}`,
      outlineOffset: 2,
    },
  },
});

export const empty = style({
  textAlign: 'center',
  color: vars.color.textMuted,
  fontSize: 14,
  padding: '80px 0',
});

export const settingsRow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  marginBottom: vars.space.md,
});

export const settingsHelp = style({
  fontSize: 12,
  color: vars.color.textMuted,
  lineHeight: 1.5,
});

export const toggleRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  fontSize: 14,
  color: vars.color.text,
  cursor: 'pointer',
  userSelect: 'none',
});

export const toggle = style({
  width: 16,
  height: 16,
  cursor: 'pointer',
  accentColor: vars.color.brand,
});

export const summary = style({
  display: 'grid',
  gridTemplateColumns: '160px 1fr',
  alignItems: 'center',
  gap: vars.space.lg,
  padding: vars.space.md,
  backgroundColor: vars.color.surface,
  borderRadius: vars.radius.lg,
  '@media': {
    '(max-width: 600px)': {
      gridTemplateColumns: '1fr',
      justifyItems: 'center',
    },
  },
});

export const summaryChart = style({
  position: 'relative',
  width: 140,
  height: 140,
});

export const summaryTotal = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
  fontSize: 24,
  fontWeight: 700,
  color: vars.color.text,
});

export const summaryTotalLabel = style({
  fontSize: 11,
  fontWeight: 500,
  color: vars.color.textMuted,
  letterSpacing: 0.4,
  textTransform: 'uppercase',
});

export const summaryLegend = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const summaryRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  fontSize: 13,
});

export const summaryDot = style({
  width: 10,
  height: 10,
  borderRadius: '50%',
  flexShrink: 0,
});

export const summaryLabel = style({
  color: vars.color.text,
  fontWeight: 500,
});

export const summaryCount = style({
  marginLeft: 'auto',
  color: vars.color.textMuted,
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
});

export const settingsButton = style({
  appearance: 'none',
  border: `1px solid ${vars.color.border}`,
  background: vars.color.bg,
  padding: '6px 12px',
  fontSize: 13,
  fontWeight: 500,
  color: vars.color.text,
  borderRadius: vars.radius.md,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
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

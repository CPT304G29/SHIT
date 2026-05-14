import { style } from '@vanilla-extract/css';
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
  margin: 0,
  fontSize: 28,
  fontWeight: 600,
  color: vars.color.text,
});

export const subtitle = style({
  margin: 0,
  fontSize: 14,
  lineHeight: 1.6,
  color: vars.color.textMuted,
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: vars.space.md,
});

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  padding: vars.space.lg,
  borderRadius: vars.radius.xl,
  backgroundColor: vars.color.bg,
  boxShadow: vars.shadow.sm,
});

export const cardTitle = style({
  margin: 0,
  fontSize: 16,
  fontWeight: 600,
  color: vars.color.text,
});

export const cardText = style({
  margin: 0,
  fontSize: 13,
  lineHeight: 1.6,
  color: vars.color.textMuted,
});

export const stats = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  gap: vars.space.sm,
});

export const stat = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: vars.space.md,
  borderRadius: vars.radius.lg,
  backgroundColor: vars.color.surface,
});

export const statLabel = style({
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.textMuted,
});

export const statValue = style({
  fontSize: 22,
  fontWeight: 700,
  color: vars.color.text,
});

export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
});

export const detailSector = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  padding: vars.space.md,
  borderRadius: vars.radius.lg,
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
});

export const sectorTitle = style({
  margin: 0,
  fontSize: 13,
  fontWeight: 600,
  color: vars.color.text,
});

export const sectorList = style({
  margin: 0,
  paddingLeft: 18,
  fontSize: 13,
  lineHeight: 1.6,
  color: vars.color.textMuted,
});

export const button = style({
  appearance: 'none',
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.text,
  color: vars.color.bg,
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 600,
  padding: '9px 14px',
  transition: 'opacity 120ms, transform 120ms',
  ':hover': {
    transform: 'translateY(-1px)',
  },
  ':disabled': {
    cursor: 'not-allowed',
    opacity: 0.45,
    transform: 'none',
  },
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${vars.color.ring}`,
      outlineOffset: 2,
    },
  },
});

export const secondaryButton = style([
  button,
  {
    backgroundColor: vars.color.bg,
    color: vars.color.text,
  },
]);

export const fileInput = style({
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
});

export const tableWrap = style({
  overflowX: 'auto',
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
});

export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 13,
});

export const th = style({
  padding: '10px 12px',
  textAlign: 'left',
  fontWeight: 600,
  color: vars.color.textMuted,
  backgroundColor: vars.color.surface,
  borderBottom: `1px solid ${vars.color.border}`,
  whiteSpace: 'nowrap',
});

export const td = style({
  padding: '10px 12px',
  color: vars.color.text,
  borderBottom: `1px solid ${vars.color.border}`,
  whiteSpace: 'nowrap',
});

export const errorList = style({
  margin: 0,
  paddingLeft: 18,
  color: vars.color.danger,
  fontSize: 13,
  lineHeight: 1.6,
});

export const hint = style({
  fontSize: 12,
  color: vars.color.textMuted,
});

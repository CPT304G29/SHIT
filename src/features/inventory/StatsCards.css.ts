import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const section = style({
  marginBottom: 40,
});

export const sectionTitle = style({
  fontSize: 11,
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: vars.color.textMuted,
  marginBottom: 20,
});

export const statsRow = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 0,
});

export const statItem = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  padding: '0 32px',
  borderLeft: `1px solid ${vars.color.border}`,
  selectors: {
    '&:first-child': {
      borderLeft: 'none',
      paddingLeft: 0,
    },
  },
});

export const statValue = style({
  fontSize: 28,
  fontWeight: 600,
  color: vars.color.text,
  letterSpacing: '-0.02em',
  lineHeight: 1.2,
  fontFeatureSettings: '"tnum"',
});

export const statLabel = style({
  fontSize: 11,
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: vars.color.textMuted,
});

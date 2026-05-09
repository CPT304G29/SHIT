import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const cardsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 20,
});

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 10,
  padding: '20px 22px',
  backgroundColor: vars.color.bg,
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border}`,
  boxShadow: vars.shadow.sm,
  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  cursor: 'default',
  selectors: {
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: vars.shadow.md,
      borderColor: vars.color.borderHover,
    },
  },
});

export const cardIcon = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: 10,
  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  selectors: {
    [`${card}:hover &`]: {
      transform: 'scale(1.08)',
    },
  },
});

export const cardValue = style({
  fontSize: 24,
  fontWeight: 700,
  color: vars.color.text,
  letterSpacing: '-0.02em',
  lineHeight: 1.2,
  fontFeatureSettings: '"tnum"',
});

export const cardLabel = style({
  fontSize: 13,
  fontWeight: 500,
  color: vars.color.textMuted,
  letterSpacing: '0.01em',
});

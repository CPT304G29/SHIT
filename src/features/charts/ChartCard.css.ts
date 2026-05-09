import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const card = style({
  backgroundColor: vars.color.bg,
  borderRadius: vars.radius.xl,
  padding: '28px 32px',
  boxShadow: vars.shadow.sm,
  transition: 'box-shadow 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  selectors: {
    '&:hover': {
      boxShadow: vars.shadow.md,
    },
  },
});

export const cardTitle = style({
  fontSize: 11,
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: vars.color.textMuted,
});

export const cardContent = style({
  flex: 1,
  minHeight: 280,
});

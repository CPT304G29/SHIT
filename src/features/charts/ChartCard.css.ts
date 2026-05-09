import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const card = style({
  backgroundColor: vars.color.bg,
  borderRadius: vars.radius.xl,
  padding: '20px 24px',
  boxShadow: vars.shadow.sm,
  transition: 'box-shadow 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: '100%',
  height: '100%',
  minHeight: 0,
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
  flexShrink: 0,
});

export const cardContent = style({
  flex: 1,
  minHeight: 0,
  position: 'relative',
});

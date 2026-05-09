import { style } from '@vanilla-extract/css';

export const sidebar = style({
  position: 'fixed',
  left: 0,
  top: 0,
  bottom: 0,
  width: 64,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: 80,
  gap: 4,
  background:
    'linear-gradient(180deg, #E50012 0%, #D40010 50%, #C40010 100%)',
  zIndex: 100,
  boxShadow: '4px 0 16px rgba(0, 0, 0, 0.08)',
});

export const navItem = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 44,
  height: 44,
  borderRadius: 10,
  color: 'rgba(255, 255, 255, 0.65)',
  cursor: 'pointer',
  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  selectors: {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      color: 'rgba(255, 255, 255, 0.95)',
      transform: 'scale(1.05)',
    },
  },
});

export const navItemActive = style({
  color: '#FFFFFF',
  backgroundColor: 'rgba(0, 0, 0, 0.12)',
  selectors: {
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.16)',
      color: '#FFFFFF',
      transform: 'scale(1.05)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      left: -10,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 3,
      height: 20,
      backgroundColor: '#FFFFFF',
      borderRadius: '0 3px 3px 0',
      boxShadow: '0 0 8px rgba(255, 255, 255, 0.4)',
    },
  },
});

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
  gap: 8,
  backgroundColor: '#E50012',
  zIndex: 100,
});

export const navItem = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  borderRadius: 4,
  color: 'rgba(255, 255, 255, 0.9)',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease, color 0.2s ease',
  selectors: {
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
  },
});

export const navItemActive = style({
  color: '#FFFFFF',
  selectors: {
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 4,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 20,
      height: 2,
      backgroundColor: '#FFFFFF',
      borderRadius: 1,
    },
  },
});

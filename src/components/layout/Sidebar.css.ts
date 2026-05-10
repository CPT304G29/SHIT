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
  padding: '24px 0',
  background: 'linear-gradient(180deg, #E50012 0%, #D40010 50%, #C40010 100%)',
  zIndex: 100,
  boxShadow: '4px 0 24px rgba(0, 0, 0, 0.12)',
  borderTopRightRadius: 20,
  borderBottomRightRadius: 20,
  transition: 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
  overflow: 'hidden',
});

export const sidebarExpanded = style({
  width: 220,
});

export const brand = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 40,
  marginBottom: 32,
  width: '100%',
  padding: '0 20px',
  gap: 10,
});

export const brandMark = style({
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  backgroundColor: '#FFFFFF',
  color: '#E50012',
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: '0.04em',
  flexShrink: 0,
});

export const brandText = style({
  fontSize: 15,
  fontWeight: 700,
  color: '#FFFFFF',
  letterSpacing: '0.02em',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  maxWidth: 0,
  opacity: 0,
  transition: 'max-width 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
});

export const brandTextVisible = style({
  maxWidth: 120,
  opacity: 1,
});

export const sectionLabel = style({
  fontSize: 10,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'rgba(255, 255, 255, 0.35)',
  width: '100%',
  padding: '0 20px',
  marginBottom: 8,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  maxWidth: 0,
  opacity: 0,
  transition: 'max-width 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
});

export const sectionLabelVisible = style({
  maxWidth: 180,
  opacity: 1,
});

export const navList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  width: '100%',
  padding: '0 12px',
  flex: 1,
});

export const navItemWrap = style({
  position: 'relative',
});

export const navItem = style({
  display: 'flex',
  alignItems: 'center',
  height: 44,
  borderRadius: 10,
  color: 'rgba(255, 255, 255, 0.6)',
  cursor: 'pointer',
  border: 'none',
  background: 'transparent',
  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  padding: '0 14px',
  gap: 14,
  width: '100%',
  position: 'relative',
  zIndex: 1,
});

export const navItemExpanded = style({
  padding: '0 14px',
});

export const navItemHover = style({
  selectors: {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      color: 'rgba(255, 255, 255, 0.95)',
    },
  },
});

export const navItemActive = style({
  color: '#FFFFFF',
  selectors: {
    '&:hover': {
      color: '#FFFFFF',
    },
  },
});

export const navItemActiveBackdrop = style({
  position: 'absolute',
  inset: 0,
  borderRadius: 10,
  backgroundColor: 'rgba(0, 0, 0, 0.16)',
  boxShadow: 'inset 3px 0 0 0 #FFFFFF',
  pointerEvents: 'none',
});

export const iconBox = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 20,
  height: 20,
  flexShrink: 0,
});

export const navLabel = style({
  fontSize: 14,
  fontWeight: 500,
  color: 'inherit',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  maxWidth: 0,
  opacity: 0,
  transition: 'max-width 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
});

export const navLabelVisible = style({
  maxWidth: 140,
  opacity: 1,
});

export const bottomArea = style({
  marginTop: 'auto',
  width: '100%',
  padding: '16px 20px 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const divider = style({
  height: 1,
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  margin: '0 20px 16px',
  width: 'calc(100% - 40px)',
  transition: 'opacity 0.3s ease',
  opacity: 0,
});

export const dividerVisible = style({
  opacity: 1,
});

export const versionText = style({
  fontSize: 11,
  fontWeight: 500,
  color: 'rgba(255, 255, 255, 0.3)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  maxWidth: 0,
  opacity: 0,
  transition: 'max-width 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
});

export const versionTextVisible = style({
  maxWidth: 100,
  opacity: 1,
});

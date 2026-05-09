import { createTheme } from '@vanilla-extract/css';

export const [lightTheme, vars] = createTheme({
  color: {
    brand: '#E50012',
    brandHover: '#C40010',
    bg: '#FFFFFF',
    surface: '#F5F5F5',
    surfaceHover: '#EBEBEB',
    text: '#1A1A1A',
    textMuted: '#666666',
    textInverse: '#FFFFFF',
    border: '#E0E0E0',
    borderHover: '#CCCCCC',
    shadow: 'rgba(0, 0, 0, 0.08)',
    danger: '#E50012',
    dangerHover: '#C40010',
    success: '#1E8E3E',
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  radius: {
    sm: '2px',
    md: '4px',
    lg: '8px',
  },
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.04)',
    md: '0 4px 12px rgba(0, 0, 0, 0.06)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.08)',
  },
});

export const darkTheme = createTheme(vars, {
  color: {
    brand: '#FF3344',
    brandHover: '#E50012',
    bg: '#0A0A0A',
    surface: '#141414',
    surfaceHover: '#1E1E1E',
    text: '#F5F5F5',
    textMuted: '#888888',
    textInverse: '#0A0A0A',
    border: '#2A2A2A',
    borderHover: '#3A3A3A',
    shadow: 'rgba(0, 0, 0, 0.3)',
    danger: '#FF3344',
    dangerHover: '#E50012',
    success: '#34A853',
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  radius: {
    sm: '2px',
    md: '4px',
    lg: '8px',
  },
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.2)',
    md: '0 4px 12px rgba(0, 0, 0, 0.3)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.4)',
  },
});

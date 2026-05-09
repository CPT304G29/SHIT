import { createTheme } from '@vanilla-extract/css';

export const [lightTheme, vars] = createTheme({
  color: {
    brand: '#E50012',
    brandHover: '#C40010',
    bg: '#FFFFFF',
    surface: '#F7F7F7',
    surfaceHover: '#EFEFEF',
    text: '#1A1A1A',
    textMuted: '#666666',
    textInverse: '#FFFFFF',
    border: '#E8E8E8',
    borderHover: '#D0D0D0',
    shadow: 'rgba(0, 0, 0, 0.06)',
    danger: '#E50012',
    dangerHover: '#C40010',
    success: '#1E8E3E',
    glass: 'rgba(255, 255, 255, 0.72)',
    ring: 'rgba(229, 0, 18, 0.25)',
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
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  shadow: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
    md: '0 4px 16px rgba(0, 0, 0, 0.05), 0 2px 6px rgba(0, 0, 0, 0.03)',
    lg: '0 12px 32px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)',
    xl: '0 20px 48px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05)',
  },
});

export const themeBg: Record<'light' | 'dark', string> = {
  light: '#FFFFFF',
  dark: '#0A0A0A',
};

export const darkTheme = createTheme(vars, {
  color: {
    brand: '#FF3344',
    brandHover: '#E50012',
    bg: '#0A0A0A',
    surface: '#121212',
    surfaceHover: '#1A1A1A',
    text: '#F5F5F5',
    textMuted: '#888888',
    textInverse: '#0A0A0A',
    border: '#262626',
    borderHover: '#3A3A3A',
    shadow: 'rgba(0, 0, 0, 0.4)',
    danger: '#FF3344',
    dangerHover: '#E50012',
    success: '#34A853',
    glass: 'rgba(18, 18, 18, 0.72)',
    ring: 'rgba(255, 51, 68, 0.3)',
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
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  shadow: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.15)',
    md: '0 4px 16px rgba(0, 0, 0, 0.25), 0 2px 6px rgba(0, 0, 0, 0.2)',
    lg: '0 12px 32px rgba(0, 0, 0, 0.35), 0 4px 12px rgba(0, 0, 0, 0.2)',
    xl: '0 20px 48px rgba(0, 0, 0, 0.4), 0 8px 16px rgba(0, 0, 0, 0.25)',
  },
});

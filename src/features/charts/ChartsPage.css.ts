import { style } from '@vanilla-extract/css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 40,
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  gridAutoRows: '400px',
  gap: 20,
  '@media': {
    '(max-width: 1100px)': {
      gridTemplateColumns: 'repeat(6, 1fr)',
    },
    '(max-width: 700px)': {
      gridTemplateColumns: '1fr',
      gridAutoRows: '380px',
    },
  },
});

const itemBase = style({
  display: 'flex',
  minHeight: 0,
});

export const wide = style([
  itemBase,
  {
    gridColumn: 'span 8',
    '@media': {
      '(max-width: 1100px)': {
        gridColumn: 'span 6',
      },
      '(max-width: 700px)': {
        gridColumn: 'span 1',
      },
    },
  },
]);

export const narrow = style([
  itemBase,
  {
    gridColumn: 'span 4',
    '@media': {
      '(max-width: 1100px)': {
        gridColumn: 'span 6',
      },
      '(max-width: 700px)': {
        gridColumn: 'span 1',
      },
    },
  },
]);

export const medium = style([
  itemBase,
  {
    gridColumn: 'span 6',
    '@media': {
      '(max-width: 1100px)': {
        gridColumn: 'span 6',
      },
      '(max-width: 700px)': {
        gridColumn: 'span 1',
      },
    },
  },
]);

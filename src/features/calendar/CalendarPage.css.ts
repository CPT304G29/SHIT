import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
});

export const hero = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
  gap: 20,
  '@media': {
    '(max-width: 960px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const heroPanel = style({
  background:
    'linear-gradient(135deg, rgba(229, 0, 18, 0.1) 0%, rgba(229, 0, 18, 0.02) 40%, transparent 100%)',
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border}`,
  padding: '24px 28px',
  boxShadow: vars.shadow.sm,
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
});

export const heroTitle = style({
  fontSize: 28,
  fontWeight: 700,
  letterSpacing: '-0.02em',
  color: vars.color.text,
});

export const heroSubtitle = style({
  fontSize: 14,
  lineHeight: 1.7,
  color: vars.color.textMuted,
  maxWidth: 720,
});

export const heroStats = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 14,
  '@media': {
    '(max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const statCard = style({
  borderRadius: vars.radius.lg,
  padding: '16px 18px',
  backgroundColor: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

export const statLabel = style({
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: vars.color.textMuted,
});

export const statValue = style({
  fontSize: 24,
  fontWeight: 700,
  fontVariantNumeric: 'tabular-nums',
  color: vars.color.text,
});

export const statMeta = style({
  fontSize: 12,
  color: vars.color.textMuted,
});

export const summaryPanel = style({
  backgroundColor: vars.color.bg,
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border}`,
  padding: '24px',
  boxShadow: vars.shadow.sm,
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
});

export const panelEyebrow = style({
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: vars.color.textMuted,
});

export const selectedDate = style({
  fontSize: 24,
  fontWeight: 700,
  color: vars.color.text,
  letterSpacing: '-0.02em',
});

export const selectedMeta = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 12,
});

export const selectedMetric = style({
  borderRadius: vars.radius.lg,
  backgroundColor: vars.color.surface,
  padding: '14px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

export const selectedMetricLabel = style({
  fontSize: 12,
  color: vars.color.textMuted,
});

export const selectedMetricValue = style({
  fontSize: 20,
  fontWeight: 700,
  fontVariantNumeric: 'tabular-nums',
  color: vars.color.text,
});

export const layout = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.6fr) minmax(360px, 1fr)',
  gap: 20,
  alignItems: 'stretch',
  '@media': {
    '(max-width: 1180px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const calendarCard = style({
  backgroundColor: vars.color.bg,
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border}`,
  padding: '20px',
  boxShadow: vars.shadow.sm,
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
  height: '100%',
});

export const calendarHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
});

export const monthTitle = style({
  fontSize: 18,
  fontWeight: 700,
  letterSpacing: '-0.02em',
  color: vars.color.text,
});

export const monthActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
});

export const iconButton = style({
  width: 36,
  height: 36,
  borderRadius: 999,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: vars.color.surface,
  color: vars.color.text,
  transition: 'all 0.2s ease',
  selectors: {
    '&:hover': {
      backgroundColor: vars.color.surfaceHover,
    },
  },
});

export const monthHint = style({
  fontSize: 12,
  color: vars.color.textMuted,
});

export const weekdayRow = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
  gap: 10,
});

export const weekdayCell = style({
  padding: '0 8px',
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: vars.color.textMuted,
});

export const monthGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
  gap: 10,
  '@media': {
    '(max-width: 720px)': {
      gap: 8,
    },
  },
});

export const dayButton = style({
  minHeight: 110,
  padding: '14px 12px 12px',
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.bg,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 8,
  transition: 'all 0.2s ease',
  textAlign: 'left',
  selectors: {
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: vars.shadow.md,
      borderColor: vars.color.borderHover,
    },
  },
  '@media': {
    '(max-width: 720px)': {
      minHeight: 92,
      padding: '12px 10px',
    },
  },
});

export const dayButtonMuted = style({
  backgroundColor: vars.color.surface,
  opacity: 0.72,
});

export const dayButtonDisabled = style({
  opacity: 0.42,
  cursor: 'not-allowed',
  backgroundColor: vars.color.surface,
  selectors: {
    '&:hover': {
      transform: 'none',
      boxShadow: 'none',
      borderColor: vars.color.border,
    },
  },
});

export const dayButtonSelected = style({
  borderColor: vars.color.brand,
  boxShadow: `0 0 0 1px ${vars.color.brand}`,
});

export const dayButtonActive = style({
  background:
    'linear-gradient(180deg, rgba(229, 0, 18, 0.06) 0%, rgba(229, 0, 18, 0.01) 100%)',
});

export const dayNumber = style({
  fontSize: 15,
  fontWeight: 700,
  color: vars.color.text,
});

export const dayNet = style({
  fontSize: 20,
  fontWeight: 700,
  fontVariantNumeric: 'tabular-nums',
});

export const positive = style({
  color: vars.color.success,
});

export const negative = style({
  color: vars.color.danger,
});

export const neutral = style({
  color: vars.color.textMuted,
});

export const dayMeta = style({
  display: 'flex',
  gap: 10,
  fontSize: 11,
  color: vars.color.textMuted,
  fontVariantNumeric: 'tabular-nums',
  flexWrap: 'wrap',
});

export const detailsColumn = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  minHeight: 0,
  height: '100%',
});

export const tableCard = style({
  backgroundColor: vars.color.bg,
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border}`,
  boxShadow: vars.shadow.sm,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
});

export const tableHeader = style({
  padding: '18px 20px 16px',
  borderBottom: `1px solid ${vars.color.border}`,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

export const tableTitle = style({
  fontSize: 18,
  fontWeight: 700,
  color: vars.color.text,
});

export const tableSubtitle = style({
  fontSize: 13,
  color: vars.color.textMuted,
});

export const tableWrap = style({
  overflowX: 'auto',
  flex: 1,
  minHeight: 0,
});

export const tableFooter = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '14px 20px 18px',
  borderTop: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.bg,
  '@media': {
    '(max-width: 720px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
});

export const tableFooterHint = style({
  fontSize: 12,
  color: vars.color.textMuted,
});

export const pagination = style({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginLeft: 'auto',
  '@media': {
    '(max-width: 720px)': {
      marginLeft: 0,
      justifyContent: 'space-between',
    },
  },
});

export const pageIndicator = style({
  fontSize: 12,
  color: vars.color.textMuted,
  fontVariantNumeric: 'tabular-nums',
  minWidth: 72,
  textAlign: 'center',
});

export const pageButton = style({
  minWidth: 88,
  height: 34,
  padding: '0 14px',
  borderRadius: 999,
  backgroundColor: vars.color.surface,
  color: vars.color.text,
  fontSize: 12,
  fontWeight: 600,
  transition: 'all 0.2s ease',
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: vars.color.surfaceHover,
    },
    '&:disabled': {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
  },
});

export const detailTable = style({
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: 760,
  height: '100%',
  tableLayout: 'fixed',
});

export const tableHeadCell = style({
  padding: '14px 20px',
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: vars.color.textMuted,
  backgroundColor: vars.color.surface,
  borderBottom: `1px solid ${vars.color.border}`,
  textAlign: 'left',
});

export const tableCell = style({
  padding: '16px 20px',
  borderBottom: `1px solid ${vars.color.border}`,
  fontSize: 14,
  color: vars.color.text,
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
  verticalAlign: 'middle',
});

export const tableRow = style({
  transition: 'box-shadow 0.24s ease, background-color 0.24s ease',
});

globalStyle(`${tableRow} td`, {
  transition:
    'background-color 0.24s ease, box-shadow 0.24s ease, transform 0.24s ease, border-color 0.24s ease',
});

globalStyle(`${tableRow}:hover td`, {
  backgroundColor: vars.color.surface,
  transform: 'translateY(-1px)',
});

globalStyle(`${tableRow}:hover td:first-child`, {
  boxShadow: `inset 3px 0 0 ${vars.color.brand}`,
});

export const tableCellContent = style({
  display: 'block',
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  transition: 'transform 0.24s ease, opacity 0.24s ease',
});

globalStyle(`${tableRow}:hover .${tableCellContent}`, {
  transform: 'translateX(2px)',
});

export const tableCellStrong = style({
  fontWeight: 600,
});

export const tableCellMuted = style({
  color: vars.color.textMuted,
});

export const tableCellBlank = style({
  color: 'transparent',
  userSelect: 'none',
});

export const badge = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 58,
  padding: '6px 10px',
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
});

export const badgeInbound = style({
  backgroundColor: 'rgba(30, 142, 62, 0.12)',
  color: vars.color.success,
});

export const badgeOutbound = style({
  backgroundColor: 'rgba(229, 0, 18, 0.1)',
  color: vars.color.danger,
});

export const emptyCard = style({
  padding: '28px 20px',
  color: vars.color.textMuted,
  textAlign: 'center',
  fontSize: 14,
});

export const chartsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
  gap: 20,
  '@media': {
    '(max-width: 1100px)': {
      gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
    },
    '(max-width: 700px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

const chartSpanBase = style({
  display: 'flex',
  minHeight: 0,
});

export const chartWide = style([
  chartSpanBase,
  {
    gridColumn: 'span 8',
    minHeight: 360,
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

export const chartNarrow = style([
  chartSpanBase,
  {
    gridColumn: 'span 4',
    minHeight: 360,
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

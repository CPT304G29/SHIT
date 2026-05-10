export function CalendarChartTooltip({
  active,
  payload,
  label,
  isDark,
  formatter,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string;
  isDark?: boolean;
  formatter?: (value: number, name?: string) => string;
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        background: isDark ? 'rgba(18,18,18,0.9)' : 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
        borderRadius: 12,
        padding: '10px 14px',
        boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(0,0,0,0.08)',
        fontSize: 12,
        color: isDark ? '#F5F5F5' : '#1A1A1A',
      }}
    >
      {label ? (
        <div style={{ marginBottom: 6, color: isDark ? '#888888' : '#666666', fontSize: 11 }}>
          {label}
        </div>
      ) : null}
      {payload.map((entry) => (
        <div
          key={`${entry.name}-${entry.value}`}
          style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              backgroundColor: entry.color ?? '#E50012',
              flexShrink: 0,
            }}
          />
          <span style={{ color: isDark ? '#BBBBBB' : '#666666' }}>{entry.name}</span>
          <strong style={{ marginLeft: 'auto' }}>
            {formatter && typeof entry.value === 'number'
              ? formatter(entry.value, entry.name)
              : entry.value}
          </strong>
        </div>
      ))}
    </div>
  );
}

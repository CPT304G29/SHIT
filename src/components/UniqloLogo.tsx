interface UniqloLogoProps {
  height?: number;
}

export function UniqloLogo({ height = 28 }: UniqloLogoProps) {
  const width = Math.round(height * 3.5);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 350 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="UNIQLO"
    >
      <rect width="350" height="100" rx="2" fill="#E50012" />
      <text
        x="175"
        y="58"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#FFFFFF"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        fontWeight="900"
        fontSize="52"
        letterSpacing="2"
      >
        UNIQLO
      </text>
    </svg>
  );
}

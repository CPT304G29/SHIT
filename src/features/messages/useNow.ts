import { useEffect, useState } from 'react';

/**
 * Returns the current epoch ms, refreshed at `intervalMs` to drive
 * time-based UI such as snooze expiry. Default 60s tick.
 */
export function useNow(intervalMs = 60_000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

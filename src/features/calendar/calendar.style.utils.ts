import { negative, neutral, positive } from './CalendarPage.css';

export function getSignedToneClass(value: number) {
  if (value > 0) return positive;
  if (value < 0) return negative;
  return neutral;
}

import { create } from 'zustand';
import type { InventoryChangeEvent } from './calendar.types';

interface CalendarImportState {
  events: InventoryChangeEvent[];
  setEvents: (events: InventoryChangeEvent[]) => void;
  clearEvents: () => void;
}

export const useCalendarImportStore = create<CalendarImportState>()((set) => ({
  events: [],
  setEvents: (events) => set({ events }),
  clearEvents: () => set({ events: [] }),
}));

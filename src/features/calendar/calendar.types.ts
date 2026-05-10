export type InventoryChangeDirection = 'in' | 'out';

export interface InventoryChangeEvent {
  id: string;
  itemId: string;
  nameKey: string;
  categoryKey: string;
  dateKey: string;
  timestamp: number;
  direction: InventoryChangeDirection;
  quantity: number;
  unitPrice: number;
  totalValue: number;
}

export interface CalendarDaySummary {
  dateKey: string;
  date: Date;
  events: InventoryChangeEvent[];
  inboundQty: number;
  outboundQty: number;
  netQty: number;
  totalValue: number;
  dealCount: number;
  avgDealPrice: number;
}

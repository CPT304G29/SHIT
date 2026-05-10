export type MessageSeverity = 'info' | 'warning' | 'critical';

export type MessageType = 'outOfStock' | 'lowStock' | 'highValue';

export interface DerivedMessage {
  id: string;
  type: MessageType;
  severity: MessageSeverity;
  itemId: string;
  itemNameKey: string;
  quantity: number;
  totalValue: number;
  createdAt: number;
}

export interface Message extends DerivedMessage {
  read: boolean;
  dismissed: boolean;
}

export type MessageFilter = 'all' | 'unread' | 'critical';

export const LOW_STOCK_THRESHOLD = 10;
export const HIGH_VALUE_THRESHOLD = 1_000_000; // cents → £10,000

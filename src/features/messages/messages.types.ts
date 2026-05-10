export type MessageSeverity = 'info' | 'warning' | 'critical';

export type MessageType = 'outOfStock' | 'lowStock' | 'highValue' | 'rapidDecrease';

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
  snoozedUntil: number | null;
}

export type MessageFilter = 'all' | 'unread' | 'critical';

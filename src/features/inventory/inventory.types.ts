export interface InventoryItem {
  id: string;
  nameKey: string;
  quantity: number;
  categoryKey: string;
  unitPrice: number; // stored in cents to avoid float errors
  createdAt: number;
  updatedAt: number;
}

export interface InventoryFormData {
  nameKey: string;
  quantity: number;
  categoryKey: string;
  unitPrice: number; // cents
}

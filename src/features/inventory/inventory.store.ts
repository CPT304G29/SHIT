import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { InventoryItem, InventoryFormData } from './inventory.types';
import { createItem, updateItem } from './inventory.utils';

interface InventoryState {
  items: InventoryItem[];
  addItem: (data: InventoryFormData) => void;
  updateItem: (id: string, data: InventoryFormData) => void;
  deleteItem: (id: string) => void;
}

const initialItems: InventoryItem[] = [
  {
    id: '1',
    nameKey: 'item.blazerFemale',
    quantity: 20,
    categoryKey: 'category.outerwear',
    unitPrice: 12900,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    nameKey: 'item.bomberJacket',
    quantity: 70,
    categoryKey: 'category.outerwear',
    unitPrice: 26900,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '3',
    nameKey: 'item.briefsMale',
    quantity: 3000,
    categoryKey: 'category.underwear',
    unitPrice: 4599,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '4',
    nameKey: 'item.checkeredFlannel',
    quantity: 12,
    categoryKey: 'category.outerwear',
    unitPrice: 14000,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '5',
    nameKey: 'item.denimJeans',
    quantity: 31,
    categoryKey: 'category.pants',
    unitPrice: 12900,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '6',
    nameKey: 'item.hoodie',
    quantity: 75,
    categoryKey: 'category.outerwear',
    unitPrice: 6050,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '7',
    nameKey: 'item.jujutsuKaisenTee',
    quantity: 67,
    categoryKey: 'category.shirt',
    unitPrice: 8000,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '8',
    nameKey: 'item.longSleeveShirt',
    quantity: 45,
    categoryKey: 'category.shirt',
    unitPrice: 7900,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '9',
    nameKey: 'item.nikeAirForce',
    quantity: 6,
    categoryKey: 'category.shoes',
    unitPrice: 49900,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '10',
    nameKey: 'item.poloShirt',
    quantity: 27,
    categoryKey: 'category.shirt',
    unitPrice: 5000,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '11',
    nameKey: 'item.slacks',
    quantity: 57,
    categoryKey: 'category.pants',
    unitPrice: 8900,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '12',
    nameKey: 'item.winniePoohSocks',
    quantity: 450,
    categoryKey: 'category.socks',
    unitPrice: 1510,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set) => ({
      items: initialItems,
      addItem: (data) =>
        set((state) => ({
          items: [...state.items, createItem(data)],
        })),
      updateItem: (id, data) =>
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? updateItem(item, data) : item)),
        })),
      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
    }),
    {
      name: 'shit-inventory',
    }
  )
);

"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  ticker: string;
  size: string;
  color: string;
  qty: number;
  priceSol: number;
  priceUsd: number;
  image: string;
  printifyProductId?: string;
  printifyVariantId?: number;
};

type CartState = {
  items: CartItem[];
  open: boolean;
  add: (i: CartItem) => void;
  remove: (productId: string, size: string, color: string) => void;
  setQty: (productId: string, size: string, color: string, qty: number) => void;
  clear: () => void;
  setOpen: (v: boolean) => void;
  totalSol: () => number;
  totalUsd: () => number;
  count: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      open: false,
      add: (i) =>
        set((s) => {
          const idx = s.items.findIndex(
            (x) => x.productId === i.productId && x.size === i.size && x.color === i.color
          );
          if (idx >= 0) {
            const items = [...s.items];
            items[idx] = { ...items[idx], qty: items[idx].qty + i.qty };
            return { items, open: true };
          }
          return { items: [...s.items, i], open: true };
        }),
      remove: (productId, size, color) =>
        set((s) => ({ items: s.items.filter((x) => !(x.productId === productId && x.size === size && x.color === color)) })),
      setQty: (productId, size, color, qty) =>
        set((s) => ({ items: s.items.map((x) => (x.productId === productId && x.size === size && x.color === color ? { ...x, qty: Math.max(1, qty) } : x)) })),
      clear: () => set({ items: [] }),
      setOpen: (v) => set({ open: v }),
      totalSol: () => get().items.reduce((a, x) => a + x.priceSol * x.qty, 0),
      totalUsd: () => get().items.reduce((a, x) => a + x.priceUsd * x.qty, 0),
      count: () => get().items.reduce((a, x) => a + x.qty, 0),
    }),
    { name: "printrhouse-cart" }
  )
);

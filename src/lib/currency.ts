"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Currency = "SOL" | "USD";
type CurrencyState = { currency: Currency; setCurrency: (c: Currency) => void };

export const useCurrency = create<CurrencyState>()(
  persist((set) => ({ currency: "SOL", setCurrency: (currency) => set({ currency }) }), { name: "printrhouse-currency" })
);

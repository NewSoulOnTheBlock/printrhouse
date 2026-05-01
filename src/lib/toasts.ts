"use client";
import { create } from "zustand";

type Toast = { id: string; kind: "ok" | "err" | "info"; text: string };

type S = {
  toasts: Toast[];
  show: (kind: Toast["kind"], text: string) => void;
  dismiss: (id: string) => void;
};

export const useToasts = create<S>((set) => ({
  toasts: [],
  show: (kind, text) => {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, { id, kind, text }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 4000);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = { email: string; handle: string } | null;
type AuthState = {
  user: User;
  login: (email: string) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (email) => set({ user: { email, handle: email.split("@")[0] } }),
      logout: () => set({ user: null }),
    }),
    { name: "printrhouse-auth" }
  )
);

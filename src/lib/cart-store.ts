"use client";

// ============================================================
// STORE APLIKASI — Keranjang, Wishlist, Pesanan Saya, Pelacak View
// (PRD v3.0 §8, §10.3) — hanya menyimpan data NON-SENSITIF:
// slug + qty + order code. Tidak ada data pribadi. Tidak pernah.
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useMemo, useState, useSyncExternalStore } from "react";
import { computeCart, getItem, type CartTotals, type CategoryId } from "./catalog";

export interface CartItem {
  slug: string;
  qty: number;
  type: "unit" | "website" | "addon" | "plan";
}

export interface AddResult {
  ok: boolean;
  reason?: "exists" | "replaced-plan" | "invalid";
}

interface CartState {
  items: CartItem[];
  add: (slug: string, qty?: number) => AddResult;
  addMany: (entries: { slug: string; qty: number }[]) => { added: number; replacedPlan: boolean };
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (slug, qty = 1) => {
        const item = getItem(slug);
        if (!item) return { ok: false, reason: "invalid" };

        const items = [...get().items];
        const existingIdx = items.findIndex((i) => i.slug === slug);

        if (item.type === "plan") {
          // Maks 1 plan — menambah plan lain mengganti (PRD §8.2)
          const hadPlan = items.some((i) => i.type === "plan");
          const next = items.filter((i) => i.type !== "plan");
          next.push({ slug, qty: 1, type: "plan" });
          set({ items: next });
          return { ok: true, reason: hadPlan ? "replaced-plan" : undefined };
        }

        if (existingIdx >= 0) {
          if (item.type === "website" || item.maxQty === 1) {
            return { ok: false, reason: "exists" };
          }
          const cur = items[existingIdx];
          items[existingIdx] = { ...cur, qty: Math.min(item.maxQty, cur.qty + qty) };
          set({ items });
          return { ok: true };
        }

        items.push({ slug, qty: Math.min(item.maxQty, Math.max(1, qty)), type: item.type });
        set({ items });
        return { ok: true };
      },

      addMany: (entries) => {
        let added = 0;
        let replacedPlan = false;
        let finalItems = [...get().items];
        for (const e of entries) {
          const item = getItem(e.slug);
          if (!item) continue;
          const idx = finalItems.findIndex((i) => i.slug === e.slug);
          if (item.type === "plan") {
            finalItems = finalItems.filter((i) => i.type !== "plan");
            finalItems.push({ slug: e.slug, qty: 1, type: "plan" });
            replacedPlan = true;
            added++;
            continue;
          }
          if (idx >= 0) {
            if (item.type === "website" || item.maxQty === 1) continue;
            const cur = finalItems[idx];
            finalItems[idx] = { ...cur, qty: Math.min(item.maxQty, cur.qty + e.qty) };
          } else {
            finalItems.push({ slug: e.slug, qty: Math.min(item.maxQty, Math.max(1, e.qty)), type: item.type });
          }
          added++;
        }
        set({ items: finalItems });
        return { added, replacedPlan };
      },

      setQty: (slug, qty) => {
        const item = getItem(slug);
        if (!item) return;
        const clamped = Math.max(item.minQty, Math.min(item.maxQty, Math.round(qty) || item.minQty));
        set({ items: get().items.map((i) => (i.slug === slug ? { ...i, qty: clamped } : i)) });
      },

      remove: (slug) => set({ items: get().items.filter((i) => i.slug !== slug) }),

      clear: () => set({ items: [] }),
    }),
    { name: "apm-cart" }
  )
);

// ---------------- Wishlist ----------------

interface WishlistState {
  slugs: string[];
  toggle: (slug: string) => boolean;
  has: (slug: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      slugs: [],
      toggle: (slug) => {
        const has = get().slugs.includes(slug);
        set({ slugs: has ? get().slugs.filter((s) => s !== slug) : [...get().slugs, slug] });
        return !has;
      },
      has: (slug) => get().slugs.includes(slug),
      clear: () => set({ slugs: [] }),
    }),
    { name: "apm-wishlist" }
  )
);

// ---------------- Pesanan Saya (order history lokal — PRD §10.3) ----------------

export interface MyOrder {
  code: string;
  createdAt: string; // ISO
  total: number;
  itemCount: number;
  items: { name: string; qty: number; unit: string }[];
}

interface MyOrdersState {
  orders: MyOrder[];
  add: (order: MyOrder) => void;
  remove: (code: string) => void;
  clear: () => void;
}

export const useMyOrdersStore = create<MyOrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      add: (order) => {
        if (get().orders.some((o) => o.code === order.code)) return;
        set({ orders: [order, ...get().orders].slice(0, 20) });
      },
      remove: (code) => set({ orders: get().orders.filter((o) => o.code !== code) }),
      clear: () => set({ orders: [] }),
    }),
    { name: "apm-orders" }
  )
);

// ---------------- Pelacak view kategori (sinyal "For You" — PRD §11.4) ----------------

const VIEWS_KEY = "apm-views";

export function trackCategoryView(cat: CategoryId) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(VIEWS_KEY);
    const views: Record<string, number> = raw ? JSON.parse(raw) : {};
    views[cat] = (views[cat] || 0) + 1;
    window.localStorage.setItem(VIEWS_KEY, JSON.stringify(views));
  } catch {
    // abaikan
  }
}

export function getViewScores(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(VIEWS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// ---------------- Hooks kenyamanan ----------------

/** true setelah komponen ter-hidrasi di klien — aman dari hydration mismatch. */
const emptySubscribe = () => () => {};
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

/** Total keranjang real-time (harga dari master data, bukan dari klien). */
export function useCartTotals(): CartTotals & { totalQty: number } {
  const items = useCartStore((s) => s.items);
  const totals = useMemo(() => computeCart(items), [items]);
  const totalQty = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);
  return { ...totals, totalQty };
}

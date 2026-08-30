"use client";

// ============================================================
// QUICK BRIEF STORE — state global sheet brief cepat (R3 / D-R3-09)
// Tidak dipersist; tidak menyimpan data pribadi apa pun.
// Konteks: slug produk (opsional) + intent konsultasi (opsional).
// ============================================================

import { create } from "zustand";

export type BriefIntent = "umum" | "brand" | "social" | "website" | "promo";

interface BriefState {
  open: boolean;
  slug?: string;
  intent: BriefIntent;
  /** Penghitung buka — dipakai sebagai key agar form reset tiap dibuka. */
  seq: number;
  show: (opts?: { slug?: string; intent?: BriefIntent }) => void;
  hide: () => void;
}

export const useBriefStore = create<BriefState>()((set) => ({
  open: false,
  slug: undefined,
  intent: "umum",
  seq: 0,
  show: (opts) =>
    set((s) => ({
      open: true,
      slug: opts?.slug,
      intent: opts?.intent ?? "umum",
      seq: s.seq + 1,
    })),
  hide: () => set({ open: false }),
}));

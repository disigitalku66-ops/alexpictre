"use client";

import { useState } from "react";
import { Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { getItem } from "@/lib/catalog";
import { navigate } from "@/lib/router";

type AddToCartButtonProps = Omit<React.ComponentProps<typeof Button>, "onClick"> & {
  slug: string;
  qty?: number;
  label?: string;
  /** entries tambahan (dipakai bundle) — dikirim bersamaan */
  extraEntries?: { slug: string; qty: number }[];
  onAdded?: () => void;
};

/**
 * Tombol tambah-keranjang dengan seluruh aturan PRD §8.2:
 * - plan: maks 1 — mengganti plan lain via dialog konfirmasi
 * - website / qty-terkunci: cegah duplikat dengan toast info
 * - sukses: toast + aksi "Lihat Keranjang"
 */
export function AddToCartButton({
  slug,
  qty = 1,
  label = "+ Keranjang",
  extraEntries,
  onAdded,
  children,
  ...buttonProps
}: AddToCartButtonProps) {
  const add = useCartStore((s) => s.add);
  const addMany = useCartStore((s) => s.addMany);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const item = getItem(slug);

  function doAdd() {
    setBusy(true);
    try {
      if (extraEntries && extraEntries.length > 0) {
        const entries = [{ slug, qty }, ...extraEntries];
        const res = addMany(entries);
        if (res.added > 0) {
          toast.success("Paket ditambahkan ke keranjang", {
            description: `${res.added} layanan dimasukkan sekaligus.`,
            action: { label: "Lihat Keranjang", onClick: () => navigate("/keranjang") },
          });
          onAdded?.();
        } else {
          toast.info("Semua item sudah ada di keranjang");
        }
        return;
      }

      const res = add(slug, qty);
      if (!res.ok) {
        if (res.reason === "exists") {
          toast.info("Sudah ada di keranjang", {
            description: item?.type === "website" ? "Satu proyek per baris — lanjut checkout atau pilih layanan lain." : undefined,
            action: { label: "Lihat Keranjang", onClick: () => navigate("/keranjang") },
          });
        } else {
          toast.error("Layanan tidak ditemukan");
        }
        return;
      }
      if (res.reason === "replaced-plan") {
        toast.success("Paket langganan diperbarui", {
          description: "Paket retainer lama di keranjang diganti dengan paket baru.",
          action: { label: "Lihat Keranjang", onClick: () => navigate("/keranjang") },
        });
      } else {
        toast.success("Berhasil ditambahkan ke keranjang", {
          description: item ? `${item.name} · ${item.unit}` : undefined,
          action: { label: "Lihat Keranjang", onClick: () => navigate("/keranjang") },
        });
      }
      onAdded?.();
    } finally {
      setBusy(false);
    }
  }

  function handleClick() {
    const isPlan = item?.type === "plan";
    const hasOtherPlan = useCartStore.getState().items.some((i) => i.type === "plan" && i.slug !== slug);
    if (isPlan && hasOtherPlan) {
      setConfirmOpen(true);
      return;
    }
    doAdd();
  }

  return (
    <>
      <Button onClick={handleClick} disabled={busy || buttonProps.disabled} {...buttonProps}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <ShoppingCart className="h-4 w-4" aria-hidden />}
        {children ?? label}
      </Button>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ganti paket langganan?</AlertDialogTitle>
            <AlertDialogDescription>
              Keranjang hanya dapat memuat satu paket retainer. Paket lama akan diganti dengan{" "}
              <strong>{item?.name}</strong> ({item?.unit}).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmOpen(false);
                doAdd();
              }}
            >
              Ya, ganti paket
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

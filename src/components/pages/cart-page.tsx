"use client";

// ============================================================
// HALAMAN KERANJANG & CHECKOUT (#/keranjang) — Task 4-c
// PRD v3.0 §6.5: daftar item modular, aturan multi-bahasa 35%,
// ringkasan real-time, brief klien + honeypot, checkout via
// WhatsApp (POST /api/checkout — harga selalu dihitung server).
// ============================================================

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Loader2,
  Lock,
  MessageCircle,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  TriangleAlert,
} from "lucide-react";

import { Img } from "@/components/shared/img";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { formatIDR, getItem, type PricedLine } from "@/lib/catalog";
import { useCartStore, useCartTotals, useMounted, useMyOrdersStore } from "@/lib/cart-store";
import { Link, navigate } from "@/lib/router";
import { cn } from "@/lib/utils";

const MULTILANG_SLUG = "addon-multi-bahasa";
const WEBSITE_FALLBACK_SLUG = "landing-page-fullstack";
const NOTES_MAX = 500;

// ---------- Kontrak API ----------
interface CheckoutOk {
  ok: true;
  orderCode: string;
  total: number;
  waUrl: string;
  dbLogged: boolean;
}
interface CheckoutErr {
  ok: false;
  error: string;
}
type CheckoutResponse = CheckoutOk | CheckoutErr;

function mapCheckoutError(error: string | undefined): string {
  switch (error) {
    case "RATE_LIMITED":
      return "Terlalu banyak percobaan — tunggu 1 menit";
    case "MULTILANG_REQUIRES_WEBSITE":
      return "Tambahkan paket website untuk add-on Multi-Bahasa";
    case "BRIEF_INVALID":
      return "Periksa kembali data brief Anda";
    default:
      return "Gagal memproses — coba lagi atau chat kami langsung";
  }
}

// ---------- Kontrol qty (tanpa setState di effect) ----------
function QtyControl({
  slug,
  qty,
  min,
  max,
}: {
  slug: string;
  qty: number;
  min: number;
  max: number;
}) {
  const setQty = useCartStore((s) => s.setQty);
  const [text, setText] = useState(String(qty));

  const commit = (n: number) => {
    const clamped = Math.max(min, Math.min(max, Math.round(n)));
    setQty(slug, clamped);
    setText(String(clamped));
  };

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Atur jumlah item">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-11 w-11 sm:h-9 sm:w-9"
        onClick={() => commit(qty - 1)}
        disabled={qty <= min}
        aria-label="Kurangi jumlah"
      >
        <Minus className="h-4 w-4" aria-hidden />
      </Button>
      <Input
        type="text"
        inputMode="numeric"
        className="h-11 w-16 text-center tabular-nums sm:h-9 sm:w-14"
        value={text}
        aria-label={`Jumlah item (min ${min}, maks ${max})`}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9]/g, "").slice(0, 3);
          setText(raw);
          const n = Number.parseInt(raw, 10);
          if (raw !== "" && Number.isFinite(n) && n >= min && n <= max) {
            setQty(slug, n);
          }
        }}
        onBlur={() => {
          const n = Number.parseInt(text, 10);
          commit(Number.isFinite(n) ? n : qty);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-11 w-11 sm:h-9 sm:w-9"
        onClick={() => commit(qty + 1)}
        disabled={qty >= max}
        aria-label="Tambah jumlah"
      >
        <Plus className="h-4 w-4" aria-hidden />
      </Button>
    </div>
  );
}

// ---------- Satu baris item keranjang ----------
function CartItemRow({
  line,
  multilangValid,
  multilangBasePrice,
}: {
  line: PricedLine;
  multilangValid: boolean;
  multilangBasePrice?: number;
}) {
  const remove = useCartStore((s) => s.remove);
  const meta = getItem(line.slug);
  const isMultilang = line.slug === MULTILANG_SLUG;
  const muted = isMultilang && !multilangValid;

  // Qty hanya bisa diubah untuk type 'unit', atau 'addon' yang maxQty > 1.
  const qtyLocked =
    !meta || meta.type === "website" || meta.type === "plan" || meta.maxQty === 1;

  return (
    <li className={cn("flex gap-3 py-5 first:pt-0 last:pb-0 sm:gap-4", muted && "opacity-70")}>
      <Link
        to={`/produk/${line.slug}`}
        ariaLabel={`Lihat detail ${line.name}`}
        className="shrink-0 self-start rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Img
          src={meta?.image ?? ""}
          alt={line.name}
          ratio="1/1"
          className="h-16 w-16 rounded-lg sm:h-20 sm:w-20"
          sizes="64px"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          to={`/produk/${line.slug}`}
          className="line-clamp-2 text-sm font-semibold leading-snug text-foreground hover:text-primary"
        >
          <span className={cn(muted && "line-through")}>{line.name}</span>
        </Link>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {meta?.code ?? line.code} &middot; {line.unit}
        </p>
        <p className={cn("mt-1 text-xs tabular-nums text-muted-foreground", muted && "line-through")}>
          {formatIDR(line.unitPrice)} <span className="opacity-70">/ {line.unit}</span>
        </p>
        {isMultilang && multilangValid && multilangBasePrice !== undefined && (
          <p className="mt-1.5 inline-flex items-center rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
            35% &times; {formatIDR(multilangBasePrice)}
          </p>
        )}

        <div className="mt-2.5">
          {qtyLocked ? (
            <p className="text-xs italic text-muted-foreground">per proyek — qty terkunci</p>
          ) : (
            <QtyControl
              slug={line.slug}
              qty={line.qty}
              min={meta?.minQty ?? 1}
              max={meta?.maxQty ?? 99}
            />
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end justify-between gap-2">
        <p
          className={cn(
            "text-sm font-bold tabular-nums text-foreground",
            muted && "line-through text-muted-foreground"
          )}
        >
          {formatIDR(line.subtotal)}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-11 w-11 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={() => remove(line.slug)}
          aria-label={`Hapus ${line.name} dari keranjang`}
        >
          <Trash2 className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </li>
  );
}

// ---------- Keranjang kosong ----------
function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col items-center py-16 text-center sm:py-24"
    >
      <div className="rounded-full bg-stone-100 p-7 dark:bg-stone-800/70" aria-hidden>
        <ShoppingCart className="h-14 w-14 text-stone-400 dark:text-stone-500" />
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Keranjangmu masih kosong
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        Pilih layanan desain, video, atau website dari katalog — harga transparan, tanpa biaya
        tersembunyi, checkout langsung via WhatsApp.
      </p>
      <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Button asChild size="lg" className="h-12 px-6">
          <Link to="/katalog">Jelajahi Katalog</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-12 px-6">
          <Link to="/langganan">Lihat Paket Retainer</Link>
        </Button>
      </div>
    </motion.div>
  );
}

// ---------- Skeleton saat menunggu hidrasi ----------
function CartSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-8" aria-hidden>
      <Skeleton className="h-72 w-full rounded-xl" />
      <div className="space-y-6">
        <Skeleton className="h-44 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    </div>
  );
}

// ============================================================
// HALAMAN UTAMA
// ============================================================
export function CartPage() {
  const mounted = useMounted();
  const items = useCartStore((s) => s.items);
  const add = useCartStore((s) => s.add);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const { lines, total, multilang, totalQty } = useCartTotals();

  // ---------- Brief klien ----------
  const [brief, setBrief] = useState({ name: "", brand: "", notes: "" });
  const [touched, setTouched] = useState({ name: false, brand: false, notes: false });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const nameError =
    brief.name.trim().length < 3 || brief.name.trim().length > 60
      ? "Nama lengkap wajib diisi (3–60 karakter)."
      : null;
  const brandError =
    brief.brand.trim().length < 2 || brief.brand.trim().length > 60
      ? "Nama brand/usaha wajib diisi (2–60 karakter)."
      : null;
  const notesError =
    brief.notes.length > NOTES_MAX ? `Catatan maksimal ${NOTES_MAX} karakter.` : null;
  const briefValid = !nameError && !brandError && !notesError;

  const showNameError = (touched.name || submitAttempted) && !!nameError;
  const showBrandError = (touched.brand || submitAttempted) && !!brandError;
  const showNotesError = (touched.notes || submitAttempted) && !!notesError;

  const multilangOk = !multilang.present || multilang.valid;
  const cartHasItems = items.length > 0;
  const canCheckout = cartHasItems && briefValid && multilangOk && !loading;

  // ---------- Submit checkout ----------
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!canCheckout) return;

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
          brief: { name: brief.name.trim(), brand: brief.brand.trim(), notes: brief.notes.trim() },
          honeypot: honeypotRef.current?.value ?? "",
        }),
      });

      const data = (await res.json().catch(() => null)) as CheckoutResponse | null;

      if (!data || !data.ok) {
        toast.error(mapCheckoutError(data?.error));
        return;
      }

      // 1) Buka WhatsApp — simpan status popup untuk fallback.
      const win = window.open(data.waUrl, "_blank", "noopener,noreferrer");
      const popupBlocked = win === null;

      // 2) Catat ke "Pesanan Saya" (akses lines SEBELUM clear).
      const itemCount = lines.reduce((n, l) => n + l.qty, 0);
      useMyOrdersStore.getState().add({
        code: data.orderCode,
        createdAt: new Date().toISOString(),
        total: data.total,
        itemCount,
        items: lines.map((l) => ({ name: l.name, qty: l.qty, unit: l.unit })),
      });

      // 3) Simpan untuk halaman terima kasih.
      try {
        window.sessionStorage.setItem("apm_last_wa", data.waUrl);
        window.sessionStorage.setItem("apm_last_order", data.orderCode);
      } catch {
        // penyimpanan tidak tersedia — abaikan
      }

      // 4) Kosongkan keranjang.
      clear();

      if (popupBlocked) {
        toast.info("Popup WhatsApp diblokir — gunakan tombol Buka WhatsApp di halaman berikutnya.");
      }

      // 5) Arahkan ke halaman terima kasih.
      navigate(`/terima-kasih?order=${encodeURIComponent(data.orderCode)}`);
    } catch {
      toast.error(mapCheckoutError(undefined));
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-6 sm:py-10 lg:px-8" aria-label="Keranjang & Checkout">
        <CartSkeleton />
      </section>
    );
  }

  if (!cartHasItems) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-6 sm:py-10 lg:px-8" aria-label="Keranjang & Checkout">
        <EmptyCart />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:py-10 lg:px-8" aria-label="Keranjang & Checkout">
      {/* Kepala halaman */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Keranjang &amp; Checkout
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalQty} item di keranjang &middot; total{" "}
            <span className="font-semibold tabular-nums text-foreground">{formatIDR(total)}</span>
          </p>
        </div>
        <Button asChild variant="ghost" size="sm" className="h-10 text-muted-foreground">
          <Link to="/katalog">Lanjut jelajahi katalog</Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-8">
        {/* ============ KOLOM KIRI: daftar item ============ */}
        <div className="min-w-0">
          {/* Banner aturan multi-bahasa */}
          {multilang.present && !multilang.valid && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="mb-4"
            >
              <Alert className="border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                <TriangleAlert className="text-amber-600 dark:text-amber-400" aria-hidden />
                <AlertTitle className="text-amber-950 dark:text-amber-100">
                  Add-on Multi-Bahasa harus dipesan bersama paket website
                </AlertTitle>
                <AlertDescription className="text-amber-800 dark:text-amber-300">
                  <p>
                    Harga add-on ini dihitung 35% dari paket website termahal di keranjang.
                    Tambahkan paket website atau hapus add-on untuk melanjutkan checkout.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      className="h-10 bg-amber-600 text-white hover:bg-amber-700"
                      onClick={() => add(WEBSITE_FALLBACK_SLUG)}
                    >
                      Tambah Landing Page
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-10 border-amber-400 bg-transparent text-amber-900 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200 dark:hover:bg-amber-900"
                      onClick={() => remove(MULTILANG_SLUG)}
                    >
                      Hapus add-on
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Daftar item */}
          <Card className="py-5 sm:py-6">
            <CardContent className="px-4 sm:px-6">
              <ul className="divide-y">
                {lines.map((line) => (
                  <CartItemRow
                    key={line.slug}
                    line={line}
                    multilangValid={multilang.valid}
                    multilangBasePrice={multilang.basePrice}
                  />
                ))}
              </ul>

              <Separator className="my-4" />

              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  Harga mengikuti master data katalog — diperbarui otomatis.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-10 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                      Kosongkan Keranjang
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Kosongkan keranjang?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Semua {totalQty} item di keranjang akan dihapus. Tindakan ini tidak dapat
                        dibatalkan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="h-10">Batal</AlertDialogCancel>
                      <AlertDialogAction
                        className="h-10 bg-destructive text-white hover:bg-destructive/90"
                        onClick={() => clear()}
                      >
                        Ya, Kosongkan
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ============ KOLOM KANAN: ringkasan + brief + checkout ============ */}
        <div className="space-y-6 self-start lg:sticky lg:top-40">
          {/* Ringkasan */}
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
              <CardDescription>{totalQty} item — harga final dihitung ulang oleh sistem.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="max-h-64 space-y-2.5 overflow-y-auto pr-1 scrollbar-slim" aria-label="Rincian subtotal per item">
                {lines.map((l) => {
                  const muted = l.slug === MULTILANG_SLUG && !multilang.valid;
                  return (
                    <li key={l.slug} className="flex items-start justify-between gap-3 text-sm">
                      <div className="min-w-0">
                        <p className={cn("truncate font-medium", muted && "text-muted-foreground line-through")}>
                          {l.name}
                        </p>
                        <p className="text-xs tabular-nums text-muted-foreground">
                          {l.qty} &times; {formatIDR(l.unitPrice)}
                        </p>
                      </div>
                      <p
                        className={cn(
                          "shrink-0 font-semibold tabular-nums",
                          muted ? "text-muted-foreground line-through" : "text-foreground"
                        )}
                      >
                        {formatIDR(l.subtotal)}
                      </p>
                    </li>
                  );
                })}
              </ul>
              <Separator className="my-4" />
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-semibold text-foreground">Total</span>
                <span className="text-2xl font-extrabold tabular-nums tracking-tight text-foreground">
                  {formatIDR(total)}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Harga final divalidasi ulang oleh sistem saat checkout.
              </p>
            </CardContent>
          </Card>

          {/* Brief klien + checkout */}
          <Card>
            <CardHeader>
              <CardTitle>Brief Klien</CardTitle>
              <CardDescription>Data ini dikirim ke WhatsApp bersama pesananmu.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} noValidate className="space-y-4">
                {/* Honeypot anti-bot — tanpa label, tersembunyi */}
                <input
                  ref={honeypotRef}
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="space-y-1.5">
                  <Label htmlFor="brief-name">Nama Lengkap</Label>
                  <Input
                    id="brief-name"
                    name="name"
                    placeholder="cth: Rina Wulandari"
                    value={brief.name}
                    maxLength={60}
                    autoComplete="name"
                    className="h-11"
                    aria-invalid={showNameError || undefined}
                    aria-describedby={showNameError ? "brief-name-error" : undefined}
                    onChange={(e) => setBrief((b) => ({ ...b, name: e.target.value }))}
                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                  />
                  {showNameError && (
                    <p id="brief-name-error" role="alert" className="text-xs font-medium text-destructive">
                      {nameError}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="brief-brand">Nama Brand / Usaha</Label>
                  <Input
                    id="brief-brand"
                    name="brand"
                    placeholder="cth: Kopi Senja Cirebon"
                    value={brief.brand}
                    maxLength={60}
                    autoComplete="organization"
                    className="h-11"
                    aria-invalid={showBrandError || undefined}
                    aria-describedby={showBrandError ? "brief-brand-error" : undefined}
                    onChange={(e) => setBrief((b) => ({ ...b, brand: e.target.value }))}
                    onBlur={() => setTouched((t) => ({ ...t, brand: true }))}
                  />
                  {showBrandError && (
                    <p id="brief-brand-error" role="alert" className="text-xs font-medium text-destructive">
                      {brandError}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="brief-notes">Catatan / Kebutuhan Khusus</Label>
                    <span
                      className={cn(
                        "text-xs tabular-nums text-muted-foreground",
                        brief.notes.length > NOTES_MAX && "font-semibold text-destructive"
                      )}
                      aria-live="polite"
                    >
                      {brief.notes.length}/{NOTES_MAX}
                    </span>
                  </div>
                  <Textarea
                    id="brief-notes"
                    name="notes"
                    placeholder="Deadline, referensi gaya, target pasar, dsb."
                    value={brief.notes}
                    rows={4}
                    className="min-h-24"
                    aria-invalid={showNotesError || undefined}
                    aria-describedby={showNotesError ? "brief-notes-error" : undefined}
                    onChange={(e) => setBrief((b) => ({ ...b, notes: e.target.value }))}
                    onBlur={() => setTouched((t) => ({ ...t, notes: true }))}
                  />
                  {showNotesError && (
                    <p id="brief-notes-error" role="alert" className="text-xs font-medium text-destructive">
                      {notesError}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={!canCheckout}
                  className="h-12 w-full bg-emerald-600 text-base font-semibold text-white hover:bg-emerald-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                      Memproses&hellip;
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-5 w-5" aria-hidden />
                      Checkout via WhatsApp
                    </>
                  )}
                </Button>

                {!multilangOk && (
                  <p className="text-center text-xs font-medium text-amber-700 dark:text-amber-400" role="alert">
                    Checkout terkunci: pasangkan add-on Multi-Bahasa dengan paket website terlebih
                    dahulu.
                  </p>
                )}

                <p className="flex items-start gap-1.5 pt-1 text-xs leading-relaxed text-muted-foreground">
                  <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                  Data brief hanya dikirim ke WhatsApp resmi AlexPicture — tidak disimpan di browser
                  Anda.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

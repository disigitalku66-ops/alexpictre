"use client";

// ============================================================
// HALAMAN LACAK PESANAN (#/lacak-pesanan) — Task 4-c
// PRD v3.0 §6.12: verifikasi ringan Order ID + nama brand
// (GET /api/orders/:code?brand=...), stepper pipeline status
// 7 tahap, dan "Pesanan Saya" (riwayat lokal, hak hapus data).
// ============================================================

import { useCallback, useRef, useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Check,
  Loader2,
  PackageSearch,
  Search,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react";

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatIDR } from "@/lib/catalog";
import { useMounted, useMyOrdersStore, type MyOrder } from "@/lib/cart-store";
import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";

// ---------- Kontrak API ----------
type OrderStatus =
  | "NEW"
  | "CONTACTED"
  | "DEAL"
  | "IN_PRODUCTION"
  | "DELIVERED"
  | "DONE"
  | "LOST";

type PaymentStatus = "UNPAID" | "DP" | "PAID";

interface TrackedItem {
  slug: string;
  name: string;
  qty: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
}

interface TrackedOrder {
  code: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: TrackedItem[];
  total: number;
  itemCount: number;
  createdAt: string;
}

interface OrdersResponse {
  ok: boolean;
  order?: TrackedOrder;
  error?: string;
}

// Pipeline 7 tahap — 6 tahap progres + LOST (terminal gagal).
const STAGES: { key: Exclude<OrderStatus, "LOST">; label: string }[] = [
  { key: "NEW", label: "Pesanan Diterima" },
  { key: "CONTACTED", label: "Dihubungi Admin" },
  { key: "DEAL", label: "Deal & DP" },
  { key: "IN_PRODUCTION", label: "Produksi Berjalan" },
  { key: "DELIVERED", label: "Aset Diserahkan" },
  { key: "DONE", label: "Selesai" },
];

// ---------- Helper tanggal manual (id-ID, WIB) ----------
function formatDateTimeID(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  try {
    const date = new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
    const time = new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(d);
    return `${date}, ${time} WIB`;
  } catch {
    return d.toLocaleString("id-ID");
  }
}

// ---------- Badge status pembayaran ----------
function PaymentBadge({ status }: { status: PaymentStatus }) {
  if (status === "PAID") {
    return (
      <Badge className="border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
        Lunas
      </Badge>
    );
  }
  if (status === "DP") {
    return (
      <Badge className="border-transparent bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
        DP Dibayar
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
      Belum Dibayar
    </Badge>
  );
}

// ---------- Stepper pipeline vertikal ----------
function StatusStepper({ status }: { status: OrderStatus }) {
  const currentIdx = Math.max(
    0,
    STAGES.findIndex((s) => s.key === status)
  );

  return (
    <ol className="space-y-0" aria-label={`Progres pesanan: tahap ${currentIdx + 1} dari ${STAGES.length}`}>
      {STAGES.map((stage, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <li key={stage.key} className="relative flex gap-3 pb-6 last:pb-0">
            {i < STAGES.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[13px] top-8 h-[calc(100%-2rem)] w-0.5 rounded",
                  i + 1 <= currentIdx
                    ? "bg-emerald-500"
                    : "bg-stone-200 dark:bg-stone-700"
                )}
              />
            )}
            <span
              aria-hidden
              className={cn(
                "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold",
                done && "border-emerald-600 bg-emerald-600 text-white",
                active &&
                  "border-amber-600 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
                !done &&
                  !active &&
                  "border-stone-300 bg-stone-50 text-stone-400 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-500"
              )}
            >
              {done ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <span
              aria-current={active ? "step" : undefined}
              className={cn(
                "pt-1 text-sm leading-none",
                active ? "font-bold text-foreground" : done ? "font-medium text-foreground" : "text-muted-foreground"
              )}
            >
              {stage.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

// ---------- State terminal LOST ----------
function LostState() {
  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4"
    >
      <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-destructive" aria-hidden />
      <div>
        <p className="font-semibold text-destructive">Dibatalkan / Tidak Jadi</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Pesanan ini berakhir tanpa deal. Hubungi kami via WhatsApp untuk membuat pesanan baru.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// HALAMAN UTAMA
// ============================================================
export function TrackOrderPage() {
  const mounted = useMounted();
  const orders = useMyOrdersStore((s) => s.orders);
  const removeOrder = useMyOrdersStore((s) => s.remove);
  const clearOrders = useMyOrdersStore((s) => s.clear);

  const [code, setCode] = useState("");
  const [brand, setBrand] = useState("");
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [result, setResult] = useState<TrackedOrder | null>(null);

  const brandRef = useRef<HTMLInputElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);

  const canSubmit = code.trim().length > 0 && brand.trim().length > 0 && !loading;

  const doTrack = useCallback(async (rawCode: string, rawBrand: string) => {
    const c = rawCode.trim().toUpperCase();
    const b = rawBrand.trim();
    if (!c || !b) return;

    setLoading(true);
    setNotFound(false);
    setResult(null);
    try {
      const res = await fetch(
        `/api/orders/${encodeURIComponent(c)}?brand=${encodeURIComponent(b)}`
      );
      if (res.status === 429) {
        toast.error("Terlalu banyak percobaan — tunggu sebentar.");
        return;
      }
      const data = (await res.json().catch(() => null)) as OrdersResponse | null;
      if (res.ok && data?.ok && data.order) {
        setResult(data.order);
        return;
      }
      if (res.status === 404 || data?.error === "NOT_FOUND") {
        setNotFound(true);
        return;
      }
      toast.error("Gagal memproses — coba lagi atau chat kami langsung");
    } catch {
      toast.error("Gagal memproses — coba lagi atau chat kami langsung");
    } finally {
      setLoading(false);
    }
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    doTrack(code, brand);
  }

  // Prefill dari "Pesanan Saya" + auto-submit bila brand sudah terisi.
  function trackFromHistory(order: MyOrder) {
    setCode(order.code);
    formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    const b = brand.trim();
    if (b) {
      doTrack(order.code, b);
    } else {
      window.setTimeout(() => brandRef.current?.focus(), 350);
      toast.info("Lengkapi nama brand untuk melacak pesanan.");
    }
  }

  if (!mounted) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-6 sm:py-10 lg:px-8" aria-label="Lacak Pesanan">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-8">
          <div className="space-y-6">
            <Skeleton className="h-56 w-full rounded-xl" />
          </div>
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:py-10 lg:px-8" aria-label="Lacak Pesanan">
      {/* Kepala halaman */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Lacak Pesanan
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cek progres pesanan Anda — cukup Order ID dan nama brand, tanpa perlu login.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-8">
        {/* ============ KOLOM KIRI: form lacak + hasil ============ */}
        <div className="min-w-0 space-y-6">
          {/* Form lacak */}
          <div ref={formCardRef}>
            <Card>
              <CardHeader>
                <CardTitle>Lacak Pesanan</CardTitle>
                <CardDescription>Masukkan Order ID &amp; nama brand — tanpa perlu login.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} noValidate className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="track-code">Order ID</Label>
                    <Input
                      id="track-code"
                      name="code"
                      placeholder="APM-250830-8F3K"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      autoComplete="off"
                      spellCheck={false}
                      className="h-11 font-mono tracking-wide"
                      aria-describedby="track-code-hint"
                    />
                    <p id="track-code-hint" className="text-xs text-muted-foreground">
                      Kode pesanan yang Anda terima setelah checkout.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="track-brand">Nama Brand</Label>
                    <Input
                      id="track-brand"
                      name="brand"
                      placeholder="sesuai yang diisi saat checkout"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      autoComplete="off"
                      className="h-11"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    className="h-12 w-full text-base font-semibold sm:w-auto sm:px-8"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                        Melacak&hellip;
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5" aria-hidden />
                        Lacak
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Hasil */}
          <div aria-live="polite">
            {notFound && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <Alert variant="destructive">
                  <XCircle aria-hidden />
                  <AlertTitle>Pesanan tidak ditemukan</AlertTitle>
                  <AlertDescription>
                    Periksa kembali Order ID &amp; nama brand (harus sama persis).
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <CardTitle className="font-mono text-lg tracking-wide">{result.code}</CardTitle>
                        <CardDescription className="mt-1">
                          Dibuat {formatDateTimeID(result.createdAt)}
                        </CardDescription>
                      </div>
                      <PaymentBadge status={result.paymentStatus} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {result.status === "LOST" ? (
                      <LostState />
                    ) : (
                      <StatusStepper status={result.status} />
                    )}

                    <Separator />

                    <div>
                      <p className="mb-2 text-sm font-semibold text-foreground">Item Pesanan</p>
                      <ul className="max-h-64 divide-y overflow-y-auto rounded-lg border scrollbar-slim" aria-label="Daftar item pesanan">
                        {result.items.map((it, i) => (
                          <li
                            key={`${it.slug}-${i}`}
                            className="flex items-start justify-between gap-3 px-3 py-2.5 text-sm"
                          >
                            <div className="min-w-0">
                              <p className="truncate font-medium text-foreground">{it.name}</p>
                              <p className="text-xs tabular-nums text-muted-foreground">
                                {it.qty} {it.unit} &times; {formatIDR(it.unitPrice)}
                              </p>
                            </div>
                            <p className="shrink-0 font-semibold tabular-nums text-foreground">
                              {formatIDR(it.subtotal)}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm font-semibold text-foreground">Total</span>
                      <span className="text-xl font-extrabold tabular-nums tracking-tight text-foreground">
                        {formatIDR(result.total)}
                      </span>
                    </div>
                    <p className="text-right text-xs text-muted-foreground">{result.itemCount} item</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* ============ KOLOM KANAN: Pesanan Saya ============ */}
        <div className="self-start lg:sticky lg:top-40">
          <Card>
            <CardHeader>
              <CardTitle>Pesanan Saya</CardTitle>
              <CardDescription>Tersimpan lokal di perangkat ini.</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <div className="rounded-full bg-stone-100 p-4 dark:bg-stone-800/70" aria-hidden>
                    <PackageSearch className="h-8 w-8 text-stone-400 dark:text-stone-500" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    Belum ada pesanan di perangkat ini
                  </p>
                  <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
                    Riwayat pesanan muncul di sini setelah Anda menyelesaikan checkout.
                  </p>
                  <Button asChild className="mt-1 h-11">
                    <Link to="/katalog">Jelajahi Katalog</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <ul className="max-h-96 space-y-3 overflow-y-auto pr-1 scrollbar-slim" aria-label="Riwayat pesanan tersimpan">
                    {orders.map((o) => (
                      <li key={o.code} className="rounded-lg border p-3">
                        <p className="truncate font-mono text-sm font-bold text-foreground">{o.code}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {formatDateTimeID(o.createdAt)}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {o.itemCount} item &middot;{" "}
                          <span className="font-semibold tabular-nums text-foreground">
                            {formatIDR(o.total)}
                          </span>
                        </p>
                        <div className="mt-2.5 flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-10"
                            onClick={() => trackFromHistory(o)}
                          >
                            <Search className="h-3.5 w-3.5" aria-hidden />
                            Lacak
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => removeOrder(o.code)}
                            aria-label={`Hapus riwayat ${o.code}`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <Separator className="my-4" />

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-10 w-full text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                        Hapus Semua Riwayat
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus semua riwayat pesanan?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Seluruh {orders.length} riwayat pesanan di perangkat ini akan dihapus
                          permanen. Ini tidak memengaruhi pesanan Anda di sistem kami.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="h-10">Batal</AlertDialogCancel>
                        <AlertDialogAction
                          className="h-10 bg-destructive text-white hover:bg-destructive/90"
                          onClick={() => clearOrders()}
                        >
                          Ya, Hapus Semua
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    Anda dapat menghapus riwayat ini kapan pun (UU PDP No. 27/2022).
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Catatan kaki verifikasi */}
      <p className="mt-8 flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        Verifikasi ringan via nama brand — data yang ditampilkan terbatas status &amp; item pesanan.
      </p>
    </section>
  );
}

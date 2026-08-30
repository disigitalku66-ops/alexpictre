"use client";

// ============================================================
// HALAMAN TERIMA KASIH (#/terima-kasih?order=CODE) — Task 4-c
// PRD v3.0 §6.6: konfirmasi post-checkout — Order ID, ringkasan
// dari "Pesanan Saya" (lokal), langkah selanjutnya, info
// pembayaran, fallback WhatsApp bila popup diblokir.
// ============================================================

import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Landmark,
  PackageSearch,
} from "lucide-react";

import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatIDR } from "@/lib/catalog";
import { useMyOrdersStore } from "@/lib/cart-store";
import { Link, useHashRoute } from "@/lib/router";
import { quickChatUrl } from "@/lib/whatsapp";
import { SITE } from "@/lib/site";

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

// ---------- Helper salin ke clipboard (dengan fallback) ----------
function copyToClipboard(text: string, successMsg: string): void {
  const done = () => toast.success(successMsg);
  const fail = () => toast.error("Gagal menyalin — silakan salin manual");

  const legacy = () => {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      if (ok) done();
      else fail();
    } catch {
      fail();
    }
  };

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(legacy);
  } else {
    legacy();
  }
}

function sessionGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

// ---------- Langkah selanjutnya ----------
const NEXT_STEPS = [
  "Tim kami membalas di WhatsApp (jam kerja Sen–Sab 08.00–20.00 WIB).",
  "Konfirmasi scope & ketersediaan.",
  "Invoice & pembayaran dikirim via WA.",
];

export function ThankYouPage() {
  const { query } = useHashRoute();
  const orders = useMyOrdersStore((s) => s.orders);

  // Halaman ini hanya ter-render klien (path hash), aman baca sessionStorage.
  const orderParam = (query.get("order") || "").trim().toUpperCase();
  const lastWa = sessionGet("apm_last_wa");
  const orderCode = orderParam || sessionGet("apm_last_order") || "";
  const order = orders.find((o) => o.code === orderCode) ?? null;

  const openLastWa = () => {
    if (lastWa) window.open(lastWa, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:py-10 lg:px-8" aria-label="Terima Kasih">
      <div className="mx-auto max-w-2xl">
        {/* Hero sukses */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex flex-col items-center pt-4 text-center sm:pt-8"
        >
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.1 }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/70"
            aria-hidden
          >
            <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
          </motion.div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Terima Kasih, Pesananmu Sudah Masuk!
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Simpan Order ID di bawah ini — tim kami akan menghubungi Anda melalui WhatsApp untuk
            konfirmasi pesanan.
          </p>
        </motion.div>

        {/* Order ID */}
        {orderCode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: 0.12, ease: "easeOut" }}
            className="mt-8"
          >
            <Card className="border-amber-200 bg-amber-50 py-4 dark:border-amber-900 dark:bg-amber-950">
              <CardContent className="flex items-center justify-between gap-3 px-4 sm:px-6">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-widest text-amber-800 dark:text-amber-300">
                    Order ID
                  </p>
                  <p className="mt-1 truncate font-mono text-xl font-bold tracking-wide text-amber-950 dark:text-amber-100 sm:text-2xl">
                    {orderCode}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 shrink-0 border-amber-300 bg-amber-100/60 text-amber-900 hover:bg-amber-200 hover:text-amber-950 dark:border-amber-800 dark:bg-amber-900/40 dark:text-amber-200 dark:hover:bg-amber-900"
                  onClick={() => copyToClipboard(orderCode, "Order ID disalin")}
                  aria-label="Salin Order ID"
                >
                  <Copy className="h-4 w-4" aria-hidden />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Ringkasan pesanan (dari "Pesanan Saya" lokal) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.2, ease: "easeOut" }}
          className="mt-6"
        >
          {order ? (
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Pesanan</CardTitle>
                <CardDescription>{formatDateTimeID(order.createdAt)}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="divide-y">
                  {order.items.map((it, i) => (
                    <li key={`${it.name}-${i}`} className="flex items-start justify-between gap-3 py-2.5 text-sm">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">{it.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {it.qty} {it.unit}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <Separator className="my-4" />
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-extrabold tabular-nums tracking-tight text-foreground">
                    {formatIDR(order.total)}
                  </span>
                </div>
                <p className="mt-1 text-right text-xs text-muted-foreground">
                  {order.itemCount} item &middot; tercatat di perangkat ini
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
                <PackageSearch className="h-8 w-8 text-muted-foreground" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Detail pesanan tidak tersedia di perangkat ini
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Riwayat lokal dapat saja terhapus. Anda tetap bisa mengecek progres pesanan
                    dengan Order ID dan nama brand.
                  </p>
                </div>
                <Button asChild variant="outline" className="h-11">
                  <Link to="/lacak-pesanan">
                    Lacak Pesanan
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Langkah selanjutnya */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.28, ease: "easeOut" }}
          className="mt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Langkah Selanjutnya</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {NEXT_STEPS.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      aria-hidden
                    >
                      {i + 1}
                    </span>
                    <p className="pt-1 text-sm leading-relaxed text-foreground">{step}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info pembayaran */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.36, ease: "easeOut" }}
          className="mt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Info Pembayaran</CardTitle>
              <CardDescription>Transfer bank — konfirmasi via chat WhatsApp.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-3 rounded-lg border bg-stone-50 p-4 dark:bg-stone-900/60">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-stone-200 dark:bg-stone-800" aria-hidden>
                    <Landmark className="h-5 w-5 text-stone-600 dark:text-stone-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{SITE.bank.name}</p>
                    <p className="mt-0.5 font-mono text-lg font-bold tracking-wide text-foreground">
                      {SITE.bank.account}
                    </p>
                    <p className="text-xs text-muted-foreground">a.n. {SITE.bank.holder}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 shrink-0"
                  onClick={() => copyToClipboard(SITE.bank.account, "Nomor rekening disalin")}
                  aria-label="Salin nomor rekening"
                >
                  <Copy className="h-4 w-4" aria-hidden />
                </Button>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Lakukan pembayaran setelah invoice dikirim via WhatsApp — konfirmasi bukti transfer
                di chat yang sama.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fallback WhatsApp */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.44, ease: "easeOut" }}
          className="mt-6"
        >
          {lastWa ? (
            <div>
              <Button
                type="button"
                className="h-12 w-full bg-[#25D366] text-base font-semibold text-white hover:bg-[#1eb757]"
                onClick={openLastWa}
              >
                <WhatsAppIcon className="h-5 w-5" />
                Buka WhatsApp
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Popup diblokir? Klik tombol ini.
              </p>
            </div>
          ) : (
            <Button asChild className="h-12 w-full bg-[#25D366] text-base font-semibold text-white hover:bg-[#1eb757]">
              <a href={quickChatUrl()} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="h-5 w-5" />
                Chat WhatsApp
              </a>
            </Button>
          )}
        </motion.div>

        {/* CTA akhir */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.52 }}
          className="mt-6 flex flex-col gap-3 pb-4 sm:flex-row"
        >
          <Button asChild variant="outline" className="h-11 flex-1">
            <Link to="/">Kembali ke Beranda</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 flex-1">
            <Link to="/lacak-pesanan">Lacak Pesanan</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 flex-1">
            <Link to="/portofolio">Lihat Portofolio</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

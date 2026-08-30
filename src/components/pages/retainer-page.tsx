"use client";

import { motion } from "framer-motion";
import { CalendarCheck, CalendarDays, Check, Clock, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { AddToCartButton } from "@/components/shared/add-to-cart-button";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatIDR, PLANS } from "@/lib/catalog";
import { Link } from "@/lib/router";
import { quickChatUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

// ============================================================
// HALAMAN LANGGANAN (#/langganan) — Paket Bulanan (Retainer)
// Data plan dari PLANS (@/lib/catalog); baris perbandingan
// fitur melengkapi PRD v3.0 §7.E.
// ============================================================

const HIGHLIGHT_SLUG = "retainer-growth";

/** Meta tampilan kartu yang tidak tersedia di PLANS (PRD §7.E). */
const PLAN_META: Record<string, { sla: string; kanal: string }> = {
  "retainer-starter": { sla: "< 24 jam kerja", kanal: "WhatsApp umum" },
  "retainer-growth": { sla: "8 jam kerja", kanal: "Grup WA khusus" },
  "retainer-pro": { sla: "< 3 jam kerja", kanal: "Grup WA PIC khusus + call bulanan" },
};

/** Baris perbandingan fitur: urutan nilai [Starter, Growth, Pro] — PRD §7.E. */
const FEATURE_ROWS: { label: string; values: [string, string, string] }[] = [
  { label: "Kontrak minimal", values: ["3 bulan", "3 bulan", "6 bulan"] },
  { label: "Desain statis", values: ["12/bulan", "24/bulan", "40/bulan"] },
  { label: "Video pendek", values: ["2 video (15 dtk)/bln", "6 video (15–30 dtk)/bln", "12 video (hingga 60 dtk)/bln"] },
  { label: "Copywriting", values: ["Caption semua desain", "Caption + content calendar bulanan", "Caption + strategi konten + calendar + review mingguan"] },
  { label: "Materi iklan Meta", values: ["—", "1 set/bulan", "3 set/bulan"] },
  { label: "Foto produk", values: ["—", "—", "1x/bulan (20 foto)"] },
  { label: "Revisi per item", values: ["2x", "3x", "Tak terbatas (dalam 7 hari)"] },
  { label: "Waktu respons", values: ["< 24 jam kerja", "8 jam kerja", "< 3 jam kerja"] },
  { label: "Kanal komunikasi", values: ["WhatsApp umum", "Grup WA khusus", "Grup WA PIC khusus + call bulanan"] },
  { label: "Laporan", values: ["—", "Ringkas bulanan", "Lengkap + rekomendasi"] },
];

const PLAN_ORDER: string[] = ["retainer-starter", "retainer-growth", "retainer-pro"];

const plans = [...PLANS]
  .filter((p) => PLAN_ORDER.includes(p.slug))
  .sort((a, b) => PLAN_ORDER.indexOf(a.slug) - PLAN_ORDER.indexOf(b.slug));

/** Baris deliverables yang sudah tampil sebagai meta kartu (revisi/SLA/kanal). */
const META_LINE_RE = /revisi|respons|grup\s+(wa|whatsapp)/i;

function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.28, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

export function RetainerPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-10 lg:px-8">
      {/* ===== HERO ===== */}
      <section aria-labelledby="retainer-hero-title" className="mx-auto max-w-3xl text-center">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Paket Bulanan</p>
          <h1
            id="retainer-hero-title"
            className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Tim Produksi Konten Tanpa Rekrut In-House
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Satu langganan bulanan untuk seluruh kebutuhan konten bisnis Anda — desain, video, hingga
            strategi. Tim AlexPicture bekerja layaknya tim internal, tanpa biaya rekrutmen dan pelatihan.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-primary" aria-hidden />
              SLA respons jelas
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <CalendarCheck className="h-3.5 w-3.5 text-primary" aria-hidden />
              Kontrak fleksibel mulai 3 bulan
            </span>
          </div>
        </FadeIn>
      </section>

      {/* ===== 3 KARTU PLAN ===== */}
      <section aria-label="Pilihan paket bulanan" className="mt-12 sm:mt-16">
        <div className="grid gap-8 md:grid-cols-3 md:gap-10 lg:gap-12">
          {plans.map((plan, i) => {
            const meta = PLAN_META[plan.slug];
            const highlighted = plan.slug === HIGHLIGHT_SLUG;
            const checklist = meta
              ? plan.deliverables.filter((line) => !META_LINE_RE.test(line))
              : plan.deliverables;
            return (
              <FadeIn key={plan.slug} delay={i * 0.06} className="h-full">
                <Card
                  className={cn(
                    "relative flex h-full flex-col",
                    highlighted
                      ? "z-10 border-2 border-primary shadow-xl md:scale-105"
                      : "shadow-sm",
                  )}
                >
                  {highlighted ? (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 shadow">
                      Paling Laris
                    </Badge>
                  ) : plan.slug === "retainer-pro" ? (
                    <Badge
                      variant="secondary"
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 shadow"
                    >
                      Untuk Brand Serius
                    </Badge>
                  ) : null}

                  <CardHeader className="pb-0">
                    <h2 className="text-lg font-bold text-foreground">{plan.name}</h2>
                    <p className="min-h-10 text-sm leading-snug text-muted-foreground">{plan.short}</p>
                    <div className="mt-3">
                      <span className="text-3xl font-extrabold tracking-tight tabular-nums text-foreground sm:text-4xl">
                        {formatIDR(plan.price)}
                      </span>
                      <span className="text-sm text-muted-foreground"> /bulan</span>
                    </div>
                    <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5 text-primary" aria-hidden />
                      {plan.duration}
                    </p>
                  </CardHeader>

                  <CardContent className="flex-1 pt-5">
                    <ul className="space-y-2.5">
                      {checklist.map((line) => (
                        <li key={line} className="flex items-start gap-2 text-sm text-foreground/90">
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                            aria-hidden
                          />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>

                    <Separator className="my-4" />

                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="sr-only">Revisi</dt>
                        <dd className="flex items-start gap-2 text-foreground/90">
                          <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                          <span>
                            <span className="font-semibold">Revisi:</span> {plan.revisions}
                          </span>
                        </dd>
                      </div>
                      {meta && (
                        <>
                          <div>
                            <dt className="sr-only">Waktu respons</dt>
                            <dd className="flex items-start gap-2 text-foreground/90">
                              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                              <span>
                                <span className="font-semibold">Waktu respons:</span> {meta.sla}
                              </span>
                            </dd>
                          </div>
                          <div>
                            <dt className="sr-only">Kanal komunikasi</dt>
                            <dd className="flex items-start gap-2 text-foreground/90">
                              <WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                              <span>
                                <span className="font-semibold">Kanal komunikasi:</span> {meta.kanal}
                              </span>
                            </dd>
                          </div>
                        </>
                      )}
                    </dl>
                  </CardContent>

                  <CardFooter className="pt-2">
                    <AddToCartButton
                      slug={plan.slug}
                      label="Pilih Paket"
                      className="h-11 w-full"
                      variant={highlighted ? "default" : "outline"}
                    />
                  </CardFooter>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* ===== TABEL PERBANDINGAN ===== */}
      <section aria-labelledby="retainer-compare-title" className="mt-12 sm:mt-16">
        <FadeIn>
          <h2 id="retainer-compare-title" className="text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
            Perbandingan Paket
          </h2>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Detail lengkap seluruh fitur ketiga paket retainer dalam satu tabel.
          </p>
        </FadeIn>

        {/* Desktop — tabel */}
        <FadeIn className="mt-6 hidden md:block">
          <Card className="py-0 shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/60 hover:bg-muted/60">
                  <TableHead className="h-12 w-[22%] text-sm font-bold text-foreground">Fitur</TableHead>
                  {plans.map((p) => (
                    <TableHead
                      key={p.slug}
                      className={cn(
                        "h-12 text-center text-sm font-bold text-foreground",
                        p.slug === HIGHLIGHT_SLUG && "bg-primary/10",
                      )}
                    >
                      <span className="inline-flex flex-col items-center gap-1">
                        <span>{p.name}</span>
                        {p.slug === HIGHLIGHT_SLUG && (
                          <Badge className="px-1.5 text-[10px]">Paling Laris</Badge>
                        )}
                      </span>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-foreground">Harga per bulan</TableCell>
                  {plans.map((p) => (
                    <TableCell
                      key={p.slug}
                      className={cn(
                        "text-center font-bold tabular-nums text-foreground",
                        p.slug === HIGHLIGHT_SLUG && "bg-primary/5",
                      )}
                    >
                      {formatIDR(p.price)}
                    </TableCell>
                  ))}
                </TableRow>
                {FEATURE_ROWS.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell className="font-medium text-foreground">{row.label}</TableCell>
                    {row.values.map((value, idx) => (
                      <TableCell
                        key={`${row.label}-${plans[idx]?.slug ?? idx}`}
                        className={cn(
                          "text-center",
                          plans[idx]?.slug === HIGHLIGHT_SLUG && "bg-primary/5",
                        )}
                      >
                        {value === "—" ? (
                          <span className="text-muted-foreground/50" aria-label="Tidak tersedia">
                            —
                          </span>
                        ) : (
                          value
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </FadeIn>

        {/* Mobile — accordion per plan */}
        <FadeIn className="mt-6 md:hidden">
          <Card className="py-0 shadow-sm">
            <Accordion type="single" collapsible className="px-4">
              {plans.map((plan, planIdx) => (
                <AccordionItem key={plan.slug} value={plan.slug}>
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1 pr-2">
                      <span className="font-bold text-foreground">{plan.name}</span>
                      <span className="text-xs font-medium tabular-nums text-muted-foreground">
                        {formatIDR(plan.price)}/bulan
                      </span>
                      {plan.slug === HIGHLIGHT_SLUG && (
                        <Badge className="px-1.5 text-[10px]">Paling Laris</Badge>
                      )}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <dl>
                      {[
                        { label: "Harga per bulan", value: formatIDR(plan.price) },
                        ...FEATURE_ROWS.map((row) => ({
                          label: row.label,
                          value: row.values[planIdx],
                        })),
                      ].map((row) => (
                        <div
                          key={row.label}
                          className="flex items-start justify-between gap-6 border-b border-border/60 py-2.5 last:border-b-0"
                        >
                          <dt className="text-muted-foreground">{row.label}</dt>
                          <dd className="text-right font-medium text-foreground">{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </FadeIn>

        <p className="mt-4 text-center text-xs text-muted-foreground sm:text-sm">
          Harga belum termasuk budget iklan · Kontrak minimal sesuai paket · Pembayaran per bulan di depan
        </p>
      </section>

      {/* ===== CTA STRIP ===== */}
      <section aria-labelledby="retainer-cta-title" className="mt-12 sm:mt-16">
        <FadeIn>
          <Card className="border-primary/30 bg-primary/5 shadow-sm">
            <CardContent className="flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:justify-between sm:p-8 sm:text-left">
              <div className="max-w-xl">
                <h2 id="retainer-cta-title" className="text-lg font-bold text-foreground sm:text-xl">
                  Belum yakin paket mana?
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Konsultasi gratis — ceritakan target konten bisnis Anda, dan tim kami bantu memilih
                  paket yang paling pas.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
                <Button
                  asChild
                  className="h-11 bg-[#25D366] px-5 text-white hover:bg-[#1eb757]"
                >
                  <a
                    href={quickChatUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Konsultasi gratis melalui WhatsApp"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Konsultasi via WhatsApp
                  </a>
                </Button>
                <Link
                  to="/katalog"
                  className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
                  ariaLabel="Lihat katalog layanan satuan"
                >
                  Lihat katalog layanan satuan
                </Link>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </section>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Clapperboard,
  Clock,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  PackageCheck,
  RefreshCw,
  Zap,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { Img } from "@/components/shared/img";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router";
import { SITE } from "@/lib/site";
import { quickChatUrl } from "@/lib/whatsapp";

// ============================================================
// HALAMAN TENTANG (#/tentang) — profil studio, nilai, alur
// kerja, dan info kontak AlexPicture (PRD v3.0 §6.6).
// ============================================================

interface ValueItem {
  icon: ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}

const VALUES: ValueItem[] = [
  { icon: Zap, title: "Cepat", desc: "SLA jelas, estimasi realistis" },
  { icon: BadgeCheck, title: "Transparan", desc: "Harga & deliverable tampil sejak awal" },
  { icon: Award, title: "Standar Industri", desc: "Proses & quality control ala agensi" },
];

interface WorkStep {
  icon: ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}

const WORK_STEPS: WorkStep[] = [
  {
    icon: FileText,
    title: "Brief",
    desc: "Ceritakan kebutuhan Anda melalui form checkout atau chat WhatsApp — tim kami memvalidasi detailnya.",
  },
  {
    icon: Clapperboard,
    title: "Produksi",
    desc: "Aset diproduksi sesuai brief dengan proses dan quality control standar agensi.",
  },
  {
    icon: RefreshCw,
    title: "Revisi",
    desc: "Masukan Anda kami terapkan sesuai kuota revisi layanan yang dipilih.",
  },
  {
    icon: PackageCheck,
    title: "Delivery & Serah Terima",
    desc: "Aset final dikirim melalui tautan unduhan, beserta file langsung bila ukuran memungkinkan.",
  },
];

const CONTACTS: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}[] = [
  { icon: MapPin, label: "Alamat Studio", value: SITE.address },
  { icon: Clock, label: "Jam Operasional", value: SITE.hours },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: SITE.phoneDisplay,
    href: quickChatUrl(),
    external: true,
  },
  { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
];

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

export function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-10 lg:px-8">
      {/* ===== HERO SPLIT ===== */}
      <section aria-labelledby="about-hero-title" className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Tentang Kami</p>
          <h1
            id="about-hero-title"
            className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Mitra Kreatif untuk Bisnis yang Serius Tumbuh
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            AlexPicture adalah studio kreatif berbasis di Cirebon yang memproduksi desain grafis, video
            komersial, dan website dengan standar industri serta proses kerja yang terstruktur. Setiap
            pesanan melewati alur yang jelas — brief, produksi, quality control, hingga serah terima —
            sehingga hasil yang Anda terima konsisten dan dapat dipertanggungjawabkan.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Kami percaya layanan kreatif profesional seharusnya mudah dijangkau. Karena itu, AlexPicture
            menghadirkan harga transparan ala marketplace — semua tarif dan deliverable tampil sejak awal
            — dengan kualitas pelayanan ala agensi untuk setiap bisnis, dari UMKM hingga korporat.
          </p>
        </FadeIn>
        <FadeIn delay={0.08}>
          <Img
            src="/images/hero-collage.png"
            alt="Kolase karya produksi AlexPicture — desain, video, dan website"
            ratio="4/3"
            className="rounded-2xl shadow-sm"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </FadeIn>
      </section>

      {/* ===== NILAI KAMI ===== */}
      <section aria-labelledby="about-values-title" className="mt-12 sm:mt-16">
        <FadeIn>
          <h2 id="about-values-title" className="text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
            Nilai Kami
          </h2>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Tiga prinsip yang kami pegang di setiap pesanan.
          </p>
        </FadeIn>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {VALUES.map((value, i) => (
            <FadeIn key={value.title} delay={i * 0.06} className="h-full">
              <Card className="h-full shadow-sm">
                <CardContent className="p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <value.icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">{value.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{value.desc}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ===== ALUR KERJA ===== */}
      <section aria-labelledby="about-flow-title" className="mt-12 sm:mt-16">
        <FadeIn>
          <h2 id="about-flow-title" className="text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
            Alur Kerja Kami
          </h2>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Empat langkah terstruktur dari brief hingga aset final diterima.
          </p>
        </FadeIn>
        <FadeIn delay={0.06}>
          <ol className="relative mt-8 space-y-8 md:grid md:grid-cols-4 md:gap-6 md:space-y-0">
            <span
              aria-hidden
              className="absolute bottom-3 left-7 top-3 w-px bg-border md:bottom-auto md:left-[12.5%] md:right-[12.5%] md:top-7 md:h-px md:w-auto"
            />
            {WORK_STEPS.map((step, i) => (
              <li key={step.title} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
                <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-card text-primary shadow-sm">
                  <step.icon className="h-6 w-6" aria-hidden />
                  <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                </span>
                <div className="md:mt-3">
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </FadeIn>
      </section>

      {/* ===== INFO STUDIO ===== */}
      <section aria-labelledby="about-studio-title" className="mt-12 sm:mt-16">
        <FadeIn>
          <h2 id="about-studio-title" className="text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
            Info Studio
          </h2>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Kunjungi atau hubungi tim kami di Cirebon.
          </p>
        </FadeIn>
        <FadeIn delay={0.06}>
          <Card className="mt-6 shadow-sm">
            <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
              <ul className="flex-1 space-y-5">
                {CONTACTS.map((contact) => {
                  const Icon = contact.icon;
                  const content = (
                    <>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {contact.label}
                        </span>
                        <span
                          className={
                            contact.href
                              ? "mt-0.5 block text-sm font-medium text-primary underline-offset-4 hover:underline"
                              : "mt-0.5 block text-sm font-medium text-foreground"
                          }
                        >
                          {contact.value}
                        </span>
                      </span>
                    </>
                  );
                  return (
                    <li key={contact.label}>
                      {contact.href ? (
                        <a
                          href={contact.href}
                          {...(contact.external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="flex items-start gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
                          aria-label={`${contact.label}: ${contact.value}`}
                        >
                          {content}
                        </a>
                      ) : (
                        <div className="flex items-start gap-3">{content}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
              <Img
                src="/images/cat-langganan.png"
                alt="Preview paket langganan bulanan AlexPicture"
                ratio="4/3"
                className="w-full shrink-0 rounded-xl shadow-sm sm:w-64"
                sizes="(max-width: 640px) 100vw, 256px"
              />
            </CardContent>
          </Card>
        </FadeIn>
      </section>

      {/* ===== CTA ===== */}
      <section aria-labelledby="about-cta-title" className="mt-12 sm:mt-16">
        <FadeIn>
          <Card className="border-primary/30 bg-primary/5 shadow-sm">
            <CardContent className="flex flex-col items-center gap-5 p-6 text-center sm:p-8">
              <div className="max-w-xl">
                <h2 id="about-cta-title" className="text-lg font-bold text-foreground sm:text-xl">
                  Kenali layanan kami
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Dari desain tunggal hingga tim produksi konten bulanan — semuanya tersedia dengan harga
                  transparan di katalog.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button asChild className="h-11 px-5">
                  <Link to="/katalog" ariaLabel="Jelajahi katalog layanan AlexPicture">
                    Jelajahi Katalog
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 border-emerald-600/60 px-5 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950"
                >
                  <a
                    href={quickChatUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Hubungi AlexPicture melalui WhatsApp"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden />
                    Chat WhatsApp
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </section>
    </div>
  );
}

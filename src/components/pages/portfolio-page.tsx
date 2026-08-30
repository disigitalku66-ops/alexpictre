"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import type { ReactNode } from "react";
import { Img } from "@/components/shared/img";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "@/lib/router";
import { quickChatUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

// ============================================================
// HALAMAN PORTOFOLIO (#/portofolio) — galeri contoh karya &
// mockup produksi AlexPicture (PRD v3.0 §6.4).
// ============================================================

type PortfolioCategory = "desain" | "video" | "website";

interface PortfolioItem {
  title: string;
  category: PortfolioCategory;
  image: string;
  caption: string;
}

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  // --- Desain (7) ---
  {
    title: "Desain Feed Instagram",
    category: "desain",
    image: "/images/mockup-feed.png",
    caption:
      "Konten feed Instagram dengan layout rapi dan identitas visual yang konsisten — siap dipakai untuk kalender konten bulanan brand Anda.",
  },
  {
    title: "Carousel 6 Slide",
    category: "desain",
    image: "/images/mockup-carousel.png",
    caption:
      "Carousel 6 slide untuk edukasi produk dan promo — alur baca dari slide pertama hingga call-to-action dirancang untuk menahan audiens.",
  },
  {
    title: "Story & Reels Cover",
    category: "desain",
    image: "/images/mockup-story.png",
    caption:
      "Sampul Story dan Reels yang eye-catching agar seluruh konten highlight profil tampil rapi dan on-brand.",
  },
  {
    title: "Poster Promo A4",
    category: "desain",
    image: "/images/mockup-poster.png",
    caption:
      "Poster promosi format A4 siap cetak — komposisi, tipografi, dan hierarki informasi disusun untuk menarik perhatian dan mendorong konversi.",
  },
  {
    title: "Logo & Branding",
    category: "desain",
    image: "/images/mockup-logo.png",
    caption:
      "Identitas visual brand mulai dari logo, palet warna, hingga panduan penggunaan sederhana agar brand tampil konsisten di semua media.",
  },
  {
    title: "Menu Katalog Digital",
    category: "desain",
    image: "/images/mockup-menu.png",
    caption:
      "Menu dan katalog digital untuk restoran serta UMKM — tampil menarik saat dicetak maupun ditampilkan di layar pelanggan.",
  },
  {
    title: "Foto Produk",
    category: "desain",
    image: "/images/mockup-foto.png",
    caption:
      "Sesi foto produk dengan pencahayaan dan styling profesional — aset visual utama untuk toko online, marketplace, dan materi iklan.",
  },
  // --- Video (2) ---
  {
    title: "Video UGC Produk",
    category: "video",
    image: "/images/port-ugc.png",
    caption:
      "Video UGC 20–40 detik bergaya natural dan relatable — efektif untuk iklan Meta maupun konten organic brand Anda.",
  },
  {
    title: "TV Commercial 30 Detik",
    category: "video",
    image: "/images/mockup-video.png",
    caption:
      "Commercial 30 detik dengan standar broadcast — dari script, shooting, hingga editing dan motion graphics.",
  },
  // --- Website (4) ---
  {
    title: "Landing Page Full-Stack",
    category: "website",
    image: "/images/mockup-web-laptop.png",
    caption:
      "Landing page full-stack dengan copywriting terstruktur, SEO on-page, dan performa loading yang cepat.",
  },
  {
    title: "Company Profile Website",
    category: "website",
    image: "/images/port-company.png",
    caption:
      "Website company profile yang membangun kredibilitas bisnis Anda — lengkap dengan halaman layanan, portofolio, dan kontak.",
  },
  {
    title: "E-Commerce UMKM",
    category: "website",
    image: "/images/mockup-ecommerce.png",
    caption:
      "Toko online UMKM dengan katalog produk, keranjang belanja, dan alur checkout yang sederhana — siap menerima pesanan.",
  },
  {
    title: "Custom Dashboard App",
    category: "website",
    image: "/images/mockup-app.png",
    caption:
      "Dashboard web app custom untuk visualisasi data dan operasional bisnis — dibangun mengikuti alur kerja tim Anda.",
  },
];

const CATEGORY_LABEL: Record<PortfolioCategory, string> = {
  desain: "Desain",
  video: "Video",
  website: "Website",
};

type FilterId = "all" | PortfolioCategory;

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "desain", label: "Desain" },
  { id: "video", label: "Video" },
  { id: "website", label: "Website" },
];

const GALERY_SIZES = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw";

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

export function PortfolioPage() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);

  const filteredItems =
    filter === "all" ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter((item) => item.category === filter);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-10 lg:px-8">
      {/* ===== HEADER ===== */}
      <header>
        <FadeIn>
          <Badge variant="outline" className="border-primary/50 px-2.5 py-1 text-primary">
            Contoh karya
          </Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Portofolio Karya
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Contoh presentasi karya &amp; mockup produksi AlexPicture — desain grafis, video komersial,
            hingga website full-stack.
          </p>
        </FadeIn>
      </header>

      {/* ===== FILTER CHIPS ===== */}
      <FadeIn className="mt-6">
        <div role="group" aria-label="Filter kategori portofolio" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={cn(
                "inline-flex h-11 items-center rounded-full border px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                filter === f.id
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground" aria-live="polite">
          Menampilkan {filteredItems.length} dari {PORTFOLIO_ITEMS.length} karya
        </p>
      </FadeIn>

      {/* ===== GRID GALERI ===== */}
      <section aria-label="Galeri portofolio" className="mt-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.title}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {item.category === "video" ? (
                  // Kartu video → tautan WhatsApp (minta contoh video)
                  <a
                    href={quickChatUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block overflow-hidden rounded-xl border bg-card shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`${item.title} — minta contoh video melalui WhatsApp`}
                  >
                    <Img
                      src={item.image}
                      alt={item.title}
                      ratio="4/3"
                      sizes={GALERY_SIZES}
                      className="rounded-xl"
                      imgClassName="transition-transform duration-300 ease-out group-hover:scale-105"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow">
                      {CATEGORY_LABEL[item.category]}
                    </span>
                    <span className="absolute inset-0 flex items-center justify-center" aria-hidden>
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/95 text-primary-foreground shadow-lg ring-4 ring-black/10 transition-transform duration-300 group-hover:scale-110">
                        <Play className="h-5 w-5 fill-current" />
                      </span>
                    </span>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="mt-0.5 text-xs text-white/85">Minta contoh video via WA</p>
                    </div>
                  </a>
                ) : (
                  // Kartu desain/website → lightbox
                  <button
                    type="button"
                    onClick={() => setActiveItem(item)}
                    className="group relative block w-full overflow-hidden rounded-xl border bg-card text-left shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Perbesar karya: ${item.title}`}
                  >
                    <Img
                      src={item.image}
                      alt={item.title}
                      ratio="4/3"
                      sizes={GALERY_SIZES}
                      className="rounded-xl"
                      imgClassName="transition-transform duration-300 ease-out group-hover:scale-105"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow">
                      {CATEGORY_LABEL[item.category]}
                    </span>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                    </div>
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section aria-labelledby="portfolio-cta-title" className="mt-10 sm:mt-14">
        <FadeIn>
          <Card className="border-primary/30 bg-primary/5 shadow-sm">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:justify-between sm:p-8 sm:text-left">
              <div className="max-w-xl">
                <h2 id="portfolio-cta-title" className="text-lg font-bold text-foreground sm:text-xl">
                  Mau hasil seperti ini?
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Semua contoh di atas diproduksi oleh tim yang sama yang akan mengerjakan pesanan Anda.
                  Mulai dari satu layanan di katalog.
                </p>
              </div>
              <Button asChild className="h-11 px-5">
                <Link to="/katalog" ariaLabel="Mulai dari katalog layanan AlexPicture">
                  Mulai dari Katalog
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      </section>

      {/* ===== LIGHTBOX ===== */}
      <Dialog
        open={activeItem !== null}
        onOpenChange={(open) => {
          if (!open) setActiveItem(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          {activeItem && (
            <>
              <DialogHeader className="text-left">
                <DialogTitle>{activeItem.title}</DialogTitle>
                <DialogDescription>{activeItem.caption}</DialogDescription>
              </DialogHeader>
              <Img
                src={activeItem.image}
                alt={activeItem.title}
                ratio="4/3"
                sizes="(max-width: 640px) 90vw, 608px"
                className="rounded-lg"
              />
              <DialogFooter className="mt-1">
                <DialogClose asChild>
                  <Button variant="outline" className="h-11 px-6">
                    Tutup
                  </Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

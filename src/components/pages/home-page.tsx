"use client";

// ============================================================
// HALAMAN BERANDA (#/) — AlexPicture Marketplace (PRD §6.4)
// Urutan: USP Bar → Hero 60/40 → Kategori → Deals → Pilihan
// Editor → Interstitial → Untuk Kamu → Baru → CTA akhir.
// ============================================================

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeftRight, ArrowRight, BadgePercent, Clapperboard, Crown, Globe,
  MessageCircle, Palette, Puzzle, RefreshCcw, ShieldCheck, ShoppingCart, Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Countdown } from "@/components/shared/countdown";
import { Img } from "@/components/shared/img";
import { ProductCard } from "@/components/shared/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BUNDLE_DEALS, CATALOG, CATEGORIES, NEW_SLUGS, POPULAR_SLUGS,
  computeBundle, formatIDR, getByCategory, getCategory, getItem,
  type BundleDeal, type CatalogItem, type CategoryId,
} from "@/lib/catalog";
import { getViewScores, useCartStore, useMounted, useWishlistStore, type CartItem } from "@/lib/cart-store";
import { Link, navigate } from "@/lib/router";
import { quickChatUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

// ---------- Konstanta & data turunan (murni, tanpa hook) ----------

const CATEGORY_ICONS: Record<CategoryId, React.ComponentType<{ className?: string }>> = {
  desain: Palette, video: Clapperboard, website: Globe, addon: Puzzle, retainer: Crown,
};
const CATEGORY_IDS: string[] = CATEGORIES.map((c) => c.id);

const POPULAR_ITEMS: CatalogItem[] = POPULAR_SLUGS.map(getItem).filter((i): i is CatalogItem => i !== undefined);
const NEW_ITEMS: CatalogItem[] = NEW_SLUGS.map(getItem).filter((i): i is CatalogItem => i !== undefined);

const USP_ITEMS = [
  { icon: BadgePercent, title: "Harga Transparan", desc: "Harga tampil jelas sejak awal" },
  { icon: RefreshCcw, title: "Revisi Terstruktur", desc: "Kuota revisi jelas tiap layanan" },
  { icon: Zap, title: "Respons Cepat", desc: "Chat dibalas di jam kerja" },
  { icon: ShieldCheck, title: "Garansi Deliverable", desc: "Hasil sesuai daftar, atau diperbaiki" },
] as const;

/** Preset animasi masuk saat scroll — subtil (≤300ms). */
const FADE_UP = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
};

/** Peringkat popularitas (0 = terpopuler) untuk pengurutan rekomendasi. */
function popularRank(slug: string): number {
  const idx = POPULAR_SLUGS.indexOf(slug);
  return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
}

/** Wadah seksi standar beranda. */
function Section({ label, className, children }: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={label} className={cn("mx-auto w-full max-w-7xl px-4 lg:px-8", className)}>
      {children}
    </section>
  );
}

// ---------- 1. USP BAR — 4 kartu kepercayaan di atas lipatan ----------

function UspBar() {
  return (
    <Section label="Keunggulan AlexPicture" className="pt-4 sm:pt-6">
      <ul className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        {USP_ITEMS.map((u) => (
          <li key={u.title}>
            <div className="flex h-full items-start gap-2.5 rounded-xl border bg-card p-3 shadow-sm sm:items-center sm:gap-3 sm:p-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <u.icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-bold leading-tight text-foreground sm:text-sm">{u.title}</span>
                <span className="mt-0.5 hidden text-xs leading-snug text-muted-foreground sm:block">{u.desc}</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

// ---------- 2. HERO SPLIT 60/40 — latar gelap stone-900 ----------

/** Kartu kecil mengambang di atas gambar hero (harga dari master data). */
function HeroFloatingCard({ slug, className, delay }: {
  slug: string;
  className?: string;
  delay: number;
}) {
  const item = getItem(slug);
  if (!item) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={cn("absolute z-10", className)}
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center gap-2.5 rounded-xl border border-stone-200/70 bg-white/95 p-2.5 shadow-xl backdrop-blur-sm dark:border-stone-700/70 dark:bg-stone-900/95"
      >
        <Img src={item.image} alt={item.name} ratio="1/1" className="h-11 w-11 shrink-0 rounded-lg" sizes="44px" />
        <span className="min-w-0">
          <span className="block max-w-44 truncate text-xs font-semibold text-stone-900 dark:text-stone-100">
            {item.name}
          </span>
          <span className="block text-sm font-bold tabular-nums text-primary">{formatIDR(item.price)}</span>
        </span>
      </motion.div>
    </motion.div>
  );
}

function HeroSection() {
  return (
    <section aria-label="Pengantar AlexPicture" className="mt-4 w-full bg-stone-900 sm:mt-6">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:py-14 lg:grid-cols-[3fr_2fr] lg:gap-12 lg:py-16 lg:px-8">
        {/* Kolom teks (60%) */}
        <div className="min-w-0">
          <p className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-400">
            Marketplace Jasa Kreatif
          </p>
          <h1 className="mt-4 text-balance text-3xl font-extrabold leading-[1.12] tracking-tight text-stone-50 sm:text-4xl lg:text-5xl">
            Semua Kebutuhan Kreatif Bisnismu, dalam Satu Marketplace.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone-300 sm:text-base">
            Harga transparan tanpa negosiasi tersembunyi, deliverable tertulis jelas sejak awal,
            dan checkout langsung via WhatsApp — dari desain feed sampai website full-stack.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 px-6 text-base font-bold">
              <Link to="/katalog" ariaLabel="Jelajahi seluruh katalog layanan">
                Jelajahi Katalog <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 border-stone-600 bg-transparent px-6 text-base font-semibold text-stone-100 hover:bg-stone-800 hover:text-white dark:border-stone-600 dark:bg-transparent dark:text-stone-100 dark:hover:bg-stone-800">
              <Link to="/langganan" ariaLabel="Lihat paket retainer bulanan">
                Lihat Paket Retainer
              </Link>
            </Button>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Fakta singkat AlexPicture">
            {[`${CATALOG.length} layanan`, `${CATEGORIES.length} kategori`, "Garansi revisi", "Respons cepat"].map((chip) => (
              <li key={chip} className="rounded-full border border-stone-700 bg-stone-800/70 px-3 py-1 text-[11px] font-medium text-stone-300">
                {chip}
              </li>
            ))}
          </ul>
        </div>

        {/* Kolom visual (40%) */}
        <div className="relative pb-6 pt-5 lg:pb-7 lg:pt-6">
          <Img
            src="/images/hero-collage.png"
            alt="Kolase contoh karya desain, video, dan website produksi AlexPicture"
            ratio="4/3" priority sizes="(max-width: 1024px) 100vw, 40vw"
            className="rounded-2xl border border-stone-700/60 shadow-2xl"
          />
          <HeroFloatingCard slug="logo-starter" delay={0.35} className="bottom-0 left-2 sm:left-4" />
          <HeroFloatingCard slug="landing-page-fullstack" delay={0.55} className="right-2 top-0 sm:right-4" />
        </div>
      </div>
    </section>
  );
}

// ---------- 3. BELANJA PER KATEGORI — scroll horizontal mobile ----------

function CategorySection() {
  return (
    <Section label="Belanja per kategori" className="py-10 sm:py-12">
      <SectionHeading
        title="Belanja per Kategori"
        subtitle="Lima lini produksi untuk seluruh kebutuhan digital bisnismu"
        href="/katalog"
      />
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:gap-4 md:overflow-visible md:pb-0">
        {CATEGORIES.map((cat, i) => {
          const Icon = CATEGORY_ICONS[cat.id];
          const count = getByCategory(cat.id).length;
          return (
            <motion.div
              key={cat.id} {...FADE_UP}
              transition={{ duration: 0.26, ease: "easeOut", delay: i * 0.05 }}
              className="min-w-[160px] flex-1 md:min-w-0"
            >
              <Link to={`/katalog?kategori=${cat.id}`} ariaLabel={`Lihat ${count} layanan kategori ${cat.name}`} className="group block h-full">
                <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="relative">
                    <Img
                      src={cat.image} alt={`Kategori ${cat.name}`} ratio="4/3"
                      sizes="(max-width: 768px) 45vw, 20vw"
                      imgClassName="transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                    <span className="absolute bottom-2 left-2 grid h-9 w-9 place-items-center rounded-lg bg-stone-900/80 text-amber-400 shadow-md backdrop-blur-sm">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-3">
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary">{cat.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{cat.blurb}</p>
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-primary">{count} layanan</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

// ---------- 4. DEALS HARI INI — zona merah lembut + countdown mingguan ----------

function BundleCard({ bundle, index }: { bundle: BundleDeal; index: number }) {
  const { lines, total } = computeBundle(bundle);

  function ambilPaket() {
    const res = useCartStore.getState().addMany(bundle.items);
    if (res.added > 0) {
      toast.success("Paket ditambahkan ke keranjang", {
        description: `${bundle.name} — ${res.added} layanan dalam satu kali order.`,
        action: { label: "Lihat Keranjang", onClick: () => navigate("/keranjang") },
      });
    } else {
      toast.info("Semua item paket ini sudah ada di keranjang", {
        action: { label: "Lihat Keranjang", onClick: () => navigate("/keranjang") },
      });
    }
  }

  return (
    <motion.div {...FADE_UP} transition={{ duration: 0.28, ease: "easeOut", delay: index * 0.06 }} className="h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-red-200/70 bg-card shadow-sm dark:border-red-900/40">
        <div className="relative">
          <Img
            src={bundle.image} alt={`Paket bundling ${bundle.name}`} ratio="4/3"
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
          />
          <Badge className="absolute left-2 top-2 rounded-md bg-amber-500 px-2 py-0.5 text-[11px] font-bold text-stone-950 shadow-sm">
            Paket Bundling
          </Badge>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-base font-bold leading-snug text-foreground">{bundle.name}</h3>
          <ul className="mt-2.5 space-y-1.5">
            {lines.map((l) => (
              <li key={l.slug} className="flex items-baseline justify-between gap-2 text-xs">
                <span className="min-w-0">
                  <span className="font-bold tabular-nums text-primary">{l.qty}&times;</span>{" "}
                  <span className="text-foreground/90">{l.name}</span>
                </span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {l.subtotal > 0 ? formatIDR(l.subtotal) : "—"}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{bundle.desc}</p>
          <div className="mt-auto pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Total semua kebutuhan dalam satu kali order
            </p>
            <p className="text-xl font-extrabold tabular-nums text-foreground sm:text-2xl">{formatIDR(total)}</p>
            <Button className="mt-3 h-11 w-full font-bold" onClick={ambilPaket}>
              <ShoppingCart className="h-4 w-4" aria-hidden /> Ambil Paket
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DealsSection() {
  return (
    <Section label="Deals hari ini" className="py-10 sm:py-12">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 sm:mb-6">
        <SectionHeading
          title="Deals Hari Ini"
          subtitle="Paket bundling pilihan — lengkapi kebutuhanmu dalam satu kali order"
          className="mb-0 sm:mb-0"
        />
        <div className="flex items-center gap-2 sm:gap-3">
          <Badge className="rounded-md bg-red-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            Limited time
          </Badge>
          <Countdown />
        </div>
      </div>
      <div className="rounded-2xl border border-red-200/50 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BUNDLE_DEALS.map((b, i) => (
            <BundleCard key={b.slug} bundle={b} index={i} />
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-red-800/80 dark:text-red-300/80">
          Daftar paket bundling berganti setiap Senin pukul 00.00 WIB.
        </p>
      </div>
    </Section>
  );
}

// ---------- 5. PILIHAN EDITOR — 8 layanan unggulan ----------

function FeaturedSection() {
  return (
    <Section label="Pilihan editor" className="py-10 sm:py-12">
      <SectionHeading title="Pilihan Editor" subtitle="Layanan terlaris & nilai terbaik" href="/katalog" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {POPULAR_ITEMS.map((item, i) => (
          <motion.div key={item.slug} {...FADE_UP} transition={{ duration: 0.26, ease: "easeOut", delay: (i % 4) * 0.05 }}>
            <ProductCard item={item} variant="full" />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ---------- 6. PROMO INTERSTITIAL — 2 kartu besar (ungu & teal) ----------

function PromoSection() {
  return (
    <Section label="Penawaran lainnya" className="py-10 sm:py-12">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Kartu A — retainer */}
        <motion.div {...FADE_UP} transition={{ duration: 0.28, ease: "easeOut" }}>
          <div className="flex h-full flex-col rounded-2xl border border-purple-200/60 bg-purple-50 p-5 dark:border-purple-900/50 dark:bg-purple-950/40 sm:p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-purple-600/10 text-purple-700 dark:text-purple-300">
              <Crown className="h-5 w-5" aria-hidden />
            </span>
            <h3 className="mt-4 text-lg font-bold text-purple-950 dark:text-purple-100 sm:text-xl">
              Produksi Konten Setiap Bulan
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-purple-900/80 dark:text-purple-200/80">
              Kuota desain, video, dan copywriting terisi rutin lewat paket retainer — tanpa rekrut
              tim in-house, tanpa drama manajemen proyek.
            </p>
            <div className="mt-auto pt-5">
              <Button asChild variant="outline" className="h-11 border-purple-300 bg-white/80 font-semibold text-purple-900 hover:bg-white hover:text-purple-800 dark:border-purple-800 dark:bg-purple-950/60 dark:text-purple-100 dark:hover:bg-purple-900/60">
                <Link to="/langganan" ariaLabel="Lihat paket retainer bulanan">
                  Lihat Paket Retainer <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Kartu B — migrasi */}
        <motion.div {...FADE_UP} transition={{ duration: 0.28, ease: "easeOut", delay: 0.08 }}>
          <div className="flex h-full flex-col rounded-2xl border border-teal-200/60 bg-teal-50 p-5 dark:border-teal-900/50 dark:bg-teal-950/40 sm:p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-600/10 text-teal-700 dark:text-teal-300">
              <ArrowLeftRight className="h-5 w-5" aria-hidden />
            </span>
            <h3 className="mt-4 text-lg font-bold text-teal-950 dark:text-teal-100 sm:text-xl">
              Punya Website Lama?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-teal-900/80 dark:text-teal-200/80">
              Pindahkan seluruh konten dan struktur situs lama ke platform baru — dikerjakan penuh
              oleh tim kami, data Anda tetap aman.
            </p>
            <div className="mt-auto pt-5">
              <Button asChild variant="outline" className="h-11 border-teal-300 bg-white/80 font-semibold text-teal-900 hover:bg-white hover:text-teal-800 dark:border-teal-800 dark:bg-teal-950/60 dark:text-teal-100 dark:hover:bg-teal-900/60">
                <Link to="/produk/addon-migrasi-konten" ariaLabel="Lihat layanan migrasi konten">
                  Lihat Layanan Migrasi <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

// ---------- 7. UNTUK KAMU — rekomendasi rule-based (PRD §11.4) ----------
// Skor kategori: wishlist ×3 + keranjang ×3 + view kategori ×1.

interface ForYouInput {
  wishlistSlugs: string[];
  cartItems: CartItem[];
  viewScores: Record<string, number>;
}

interface ForYouResult {
  items: CatalogItem[];
  subtitle: string;
}

function computeForYou({ wishlistSlugs, cartItems, viewScores }: ForYouInput): ForYouResult {
  const cartWish: Record<string, number> = {};
  const views: Record<string, number> = {};
  const bump = (store: Record<string, number>, cat: string, n: number) => {
    store[cat] = (store[cat] ?? 0) + n;
  };

  for (const s of wishlistSlugs) {
    const it = getItem(s);
    if (it) bump(cartWish, it.category, 3);
  }
  for (const c of cartItems) {
    const it = getItem(c.slug);
    if (it) bump(cartWish, it.category, 3);
  }
  for (const [cat, n] of Object.entries(viewScores)) {
    if (typeof n === "number" && n > 0 && CATEGORY_IDS.includes(cat)) bump(views, cat, n);
  }

  const cats = new Set([...Object.keys(cartWish), ...Object.keys(views)]);
  if (cats.size === 0) {
    return { items: POPULAR_ITEMS.slice(0, 4), subtitle: "Layanan populer untuk memulai" };
  }

  // Kategori dominan berdasarkan total skor gabungan
  let topCat: CategoryId = "desain";
  let topScore = -1;
  for (const cat of cats) {
    const score = (cartWish[cat] ?? 0) + (views[cat] ?? 0);
    if (score > topScore) {
      topScore = score;
      topCat = cat as CategoryId;
    }
  }

  const cartSlugs = new Set(cartItems.map((i) => i.slug));
  const pool = getByCategory(topCat)
    .filter((i) => !cartSlugs.has(i.slug))
    .sort((a, b) => popularRank(a.slug) - popularRank(b.slug));
  const picked = pool.slice(0, 4);
  const pickedSlugs = new Set(picked.map((p) => p.slug));

  // Tambalan dari kategori lain (populer dulu) bila kurang dari 4
  for (const slug of POPULAR_SLUGS) {
    if (picked.length >= 4) break;
    if (cartSlugs.has(slug) || pickedSlugs.has(slug)) continue;
    const it = getItem(slug);
    if (it) {
      picked.push(it);
      pickedSlugs.add(slug);
    }
  }
  // Pengaman terakhir: pastikan selalu ada 4 rekomendasi
  for (const it of POPULAR_ITEMS) {
    if (picked.length >= 4) break;
    if (pickedSlugs.has(it.slug)) continue;
    picked.push(it);
    pickedSlugs.add(it.slug);
  }

  const catInfo = getCategory(topCat);
  const subtitle =
    (cartWish[topCat] ?? 0) > 0
      ? "Berdasarkan keranjang & wishlist-mu"
      : `Karena kamu sering melihat layanan ${catInfo?.short ?? catInfo?.name ?? "kami"}`;

  return { items: picked.slice(0, 4), subtitle };
}

function ForYouSection() {
  const mounted = useMounted();
  const wishlistSlugs = useWishlistStore((s) => s.slugs);
  const cartItems = useCartStore((s) => s.items);

  // Personalisasi murni derivasi render (useMemo) — tanpa setState di
  // effect; sebelum mount memakai default agar bebas hydration mismatch.
  const reco = useMemo(
    () =>
      computeForYou({
        wishlistSlugs: mounted ? wishlistSlugs : [],
        cartItems: mounted ? cartItems : [],
        viewScores: mounted ? getViewScores() : {},
      }),
    [mounted, wishlistSlugs, cartItems]
  );

  return (
    <Section label="Rekomendasi untuk kamu" className="py-10 sm:py-12">
      <SectionHeading title="Untuk Kamu" subtitle={reco.subtitle} icon />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {reco.items.map((item, i) => (
          <motion.div key={item.slug} {...FADE_UP} transition={{ duration: 0.26, ease: "easeOut", delay: (i % 4) * 0.05 }}>
            <ProductCard item={item} variant="full" />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ---------- 8. BARU DI ALEXPICTURE — 5 layanan terbaru ----------

function NewArrivalsSection() {
  return (
    <Section label="Layanan terbaru" className="py-10 sm:py-12">
      <SectionHeading
        title="Baru di AlexPicture"
        subtitle="Layanan yang baru saja bergabung di katalog"
        href="/katalog"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {NEW_ITEMS.map((item, i) => (
          <motion.div key={item.slug} {...FADE_UP} transition={{ duration: 0.26, ease: "easeOut", delay: (i % 4) * 0.05 }}>
            <ProductCard item={item} variant="full" />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ---------- 9. CTA STRIP AKHIR — konsultasi gratis via WhatsApp ----------

function FinalCtaSection() {
  return (
    <section aria-label="Konsultasi gratis" className="mt-10 w-full bg-stone-900 sm:mt-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-12 text-center sm:py-16 lg:px-8">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600/15 text-emerald-400">
          <MessageCircle className="h-6 w-6" aria-hidden />
        </span>
        <h2 className="mt-4 text-balance text-2xl font-extrabold tracking-tight text-stone-50 sm:text-3xl">
          Siap mulai? Konsultasi brief pertama gratis.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-300 sm:text-base">
          Ceritakan kebutuhan bisnismu — tim kami bantu memilih layanan yang paling pas, tanpa
          biaya dan tanpa komitmen.
        </p>
        <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button asChild size="lg" className="h-12 bg-emerald-600 px-6 text-base font-bold text-white hover:bg-emerald-700">
            <a href={quickChatUrl()} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" aria-hidden /> Chat WhatsApp Sekarang
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 border-stone-600 bg-transparent px-6 text-base font-semibold text-stone-100 hover:bg-stone-800 hover:text-white dark:border-stone-600 dark:bg-transparent dark:text-stone-100 dark:hover:bg-stone-800">
            <Link to="/portofolio" ariaLabel="Lihat galeri portofolio AlexPicture">
              Lihat Portofolio
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// ---------- HALAMAN BERANDA ----------

export function HomePage() {
  return (
    <div className="w-full">
      <UspBar />
      <HeroSection />
      <CategorySection />
      <DealsSection />
      <FeaturedSection />
      <PromoSection />
      <ForYouSection />
      <NewArrivalsSection />
      <FinalCtaSection />
    </div>
  );
}

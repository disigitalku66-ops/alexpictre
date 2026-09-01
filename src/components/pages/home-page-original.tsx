"use client";

// ============================================================
// HALAMAN BERANDA (#/) — AlexPicture Marketplace (REVISI R4)
// Urutan: USP Bar → Hero 60/40 → Layanan Kreatif (5 kartu) →
// Deals Hari Ini → Pilihan Layanan → 2 Panel Promo → Layanan
// untuk Kebutuhan Anda → Baru → CTA akhir.
// ============================================================

import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BadgePercent,
  Clapperboard,
  Crown,
  Globe,
  Megaphone,
  Palette,
  RefreshCcw,
  ShieldCheck,
  Share2,
  ShoppingCart,
  Sparkles,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Countdown } from "@/components/shared/countdown";
import { Img } from "@/components/shared/img";
import { ProductCard } from "@/components/shared/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BUNDLE_DEALS,
  COLLECTIONS,
  NEW_SLUGS,
  PLANS,
  POPULAR_SLUGS,
  computeBundle,
  formatIDR,
  getByCategory,
  getItem,
  type BundleDeal,
  type CatalogItem,
} from "@/lib/catalog";
import { useCartStore } from "@/lib/cart-store";
import { useBriefStore as useBrief } from "@/lib/brief-store";
import { Link, navigate } from "@/lib/router";
import { quickChatUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  desain: Palette,
  video: Clapperboard,
  website: Globe,
  addon: Megaphone,
  retainer: Crown,
};

const POPULAR_ITEMS: CatalogItem[] = POPULAR_SLUGS.map(getItem).filter((i): i is CatalogItem => i !== undefined);
// Jangan tampilkan addon migrasi konten pada section "Baru".
// Master data katalog tetap utuh; pengecualian hanya berlaku di beranda.
const NEW_ITEMS: CatalogItem[] = NEW_SLUGS.filter((slug) => slug !== "addon-migrasi-konten")
  .map(getItem)
  .filter((i): i is CatalogItem => i !== undefined);

const USP_ITEMS = [
  { icon: BadgePercent, title: "Harga Mulai 10 Ribuan", desc: "Mulai dari Rp10.000" },
  { icon: RefreshCcw, title: "Revisi Jelas", desc: "Batas revisi tercantum" },
  { icon: Zap, title: "Respons di Jam Kerja", desc: "Kami balas di jam kerja" },
  { icon: ShieldCheck, title: "Pesanan Lebih Jelas", desc: "Rincian layanan tercantum" },
] as const;

const HERO_CHIPS = [
  { label: "Desain Grafis", to: "/katalog?kategori=desain" },
  { label: "Website", to: "/katalog?kategori=website" },
  { label: "Video Komersial", to: "/katalog?kategori=video" },
  { label: "Ad Creative", to: "/katalog?koleksi=ad-creative" },
] as const;

const HERO_PORTFOLIO_COLUMNS = [
  ["/images/mockup-poster.png", "/images/mockup-logo.png", "/images/mockup-feed.png", "/images/mockup-banner.png", "/images/port-company.png"],
  ["/images/mockup-web-laptop.png", "/images/mockup-ecommerce.png", "/images/mockup-app.png", "/images/mockup-menu.png", "/images/cat-web.png"],
  ["/images/mockup-video.png", "/images/mockup-story.png", "/images/mockup-iklan.png", "/images/port-ugc.png", "/images/cat-video.png"],
] as const;

const FADE_UP = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
};

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

function HeroPortfolioReel() {
  return (
    <div
      className="relative h-[390px] overflow-hidden rounded-2xl border border-stone-700/60 bg-stone-950 shadow-2xl sm:h-[450px]"
      aria-label="Contoh hasil kerja AlexPicture"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-stone-950 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-stone-950 to-transparent" />
      <div className="grid h-full grid-cols-3 gap-2 p-2">
        {HERO_PORTFOLIO_COLUMNS.map((column, columnIndex) => {
          const directionDown = columnIndex % 2 === 0;
          const items = [...column, ...column];
          return (
            <div key={columnIndex} className="relative overflow-hidden rounded-xl">
              <motion.div
                className="flex flex-col gap-2"
                initial={{ y: directionDown ? "-50%" : "0%" }}
                animate={{ y: directionDown ? ["-50%", "0%"] : ["0%", "-50%"] }}
                transition={{
                  duration: 12 + columnIndex * 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                }}
                style={{ willChange: "transform" }}
              >
                {items.map((src, i) => (
                  <div key={`${src}-${i}`} className="shrink-0 overflow-hidden rounded-xl border border-stone-700/50 bg-stone-900">
                    <Img
                      src={src}
                      alt="Contoh hasil kerja AlexPicture"
                      ratio="4/5"
                      sizes="(max-width: 1024px) 30vw, 13vw"
                      imgClassName="transition-transform duration-500 hover:scale-[1.03]"
                    />
                  </div>
                ))}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section aria-label="Pengantar AlexPicture" className="mt-4 w-full bg-stone-900 sm:mt-6">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:py-14 lg:grid-cols-[3fr_2fr] lg:gap-12 lg:py-16 lg:px-8">
        <div className="min-w-0">
          <p className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-400">
            Selamat Datang di AlexPicture
          </p>
          <h1 className="mt-4 text-balance text-3xl font-extrabold leading-[1.12] tracking-tight text-stone-50 sm:text-4xl lg:text-5xl">
            Jasa Desain, Website &amp; Video untuk Bisnis Anda
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone-300 sm:text-base">
            Tidak perlu mencari jasa desain, video, dan website di tempat berbeda. Di AlexPicture, berbagai kebutuhan kreatif bisnis Anda bisa dikerjakan dalam satu tempat.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 px-6 text-base font-bold">
              <Link to="/katalog" ariaLabel="Lihat seluruh layanan kami">
                Lihat Layanan <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 border-stone-600 bg-transparent px-6 text-base font-semibold text-stone-100 hover:bg-stone-800 hover:text-white dark:border-stone-600 dark:bg-transparent dark:text-stone-100 dark:hover:bg-stone-800">
              <Link to="/portofolio" ariaLabel="Lihat galeri portofolio AlexPicture">
                Lihat Portofolio
              </Link>
            </Button>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Pintasan layanan">
            {HERO_CHIPS.map((chip) => (
              <li key={chip.label}>
                <Link
                  to={chip.to}
                  className="inline-flex rounded-full border border-stone-700 bg-stone-800/70 px-3 py-1 text-[11px] font-medium text-stone-300 transition-colors hover:border-amber-500/50 hover:text-amber-400"
                >
                  {chip.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative pb-1 pt-1 lg:pb-2 lg:pt-2">
          <HeroPortfolioReel />
        </div>
      </div>
    </section>
  );
}

interface CategoryCard {
  key: string;
  title: string;
  desc: string;
  image: string;
  to: string;
  cta: string;
  countLabel: string;
}

const AD_CREATIVE = COLLECTIONS[0];

const CATEGORY_CARDS: CategoryCard[] = [
  {
    key: "desain",
    title: "Desain & Branding",
    desc: "Logo, identitas visual, kemasan, dan berbagai kebutuhan desain bisnis.",
    image: "/images/cat-desain.png",
    to: "/katalog?kategori=desain",
    cta: "Lihat Layanan",
    countLabel: `${getByCategory("desain").length} layanan`,
  },
  {
    key: "video",
    title: "Video Komersial",
    desc: "Video untuk promosi produk, iklan, media sosial, atau kebutuhan bisnis lainnya.",
    image: "/images/cat-video.png",
    to: "/katalog?kategori=video",
    cta: "Lihat Layanan",
    countLabel: `${getByCategory("video").length} layanan`,
  },
  {
    key: "website",
    title: "Website & Web App",
    desc: "Landing page, website bisnis, katalog, sampai aplikasi web sesuai kebutuhan.",
    image: "/images/cat-web.png",
    to: "/katalog?kategori=website",
    cta: "Lihat Layanan",
    countLabel: `${getByCategory("website").length} layanan`,
  },
  {
    key: "ad-creative",
    title: "Ad Creative",
    desc: "Materi visual untuk iklan Meta, TikTok, marketplace, dan berbagai kanal promosi.",
    image: "/images/mockup-iklan.png",
    to: "/katalog?koleksi=ad-creative",
    cta: "Lihat Layanan",
    countLabel: `${AD_CREATIVE?.slugs.length ?? 0} layanan`,
  },
  {
    key: "retainer",
    title: "Paket Bulanan",
    desc: "Butuh desain secara rutin? Satu paket untuk berbagai kebutuhan kreatif setiap bulan.",
    image: "/images/cat-langganan.png",
    to: "/langganan",
    cta: "Lihat Paket",
    countLabel: `${PLANS.length} paket`,
  },
];

function CategorySection() {
  return (
    <Section label="Layanan Kreatif" className="py-10 sm:py-12">
      <SectionHeading
        title="Butuh Dibuatkan Apa?"
        subtitle="Desain, video, website, sampai kebutuhan konten bulanan — pilih saja yang paling sesuai."
        href="/katalog"
        actionLabel="Lihat Semua"
      />
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:pb-0 lg:grid-cols-5">
        {CATEGORY_CARDS.map((card, i) => {
          const Icon = CATEGORY_ICONS[card.key] ?? Sparkles;
          return (
            <motion.div
              key={card.key} {...FADE_UP}
              transition={{ duration: 0.26, ease: "easeOut", delay: i * 0.05 }}
              className="min-w-[180px] flex-1 md:min-w-0"
            >
              <Link to={card.to} ariaLabel={`${card.cta} — ${card.title}`} className="group flex h-full flex-col">
                <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="relative">
                    <Img src={card.image} alt={card.title} ratio="4/3" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 30vw, 20vw" imgClassName="transition-transform duration-300 group-hover:scale-[1.04]" />
                    <span className="absolute bottom-2 left-2 grid h-9 w-9 place-items-center rounded-lg bg-stone-900/80 text-amber-400 shadow-md backdrop-blur-sm">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-3">
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary">{card.title}</h3>
                    <p className="mt-1 line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground">{card.desc}</p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{card.countLabel}</span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">{card.cta}<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden /></span>
                    </div>
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

function BundleCard({ bundle, index }: { bundle: BundleDeal; index: number }) {
  const { lines, total } = computeBundle(bundle);
  function ambilPaket() {
    const res = useCartStore.getState().addMany(bundle.items);
    if (res.added > 0) {
      toast.success("Paket ditambahkan ke keranjang", { description: `${bundle.name} — ${res.added} layanan dalam satu kali order.`, action: { label: "Lihat Keranjang", onClick: () => navigate("/keranjang") } });
    } else {
      toast.info("Semua item paket ini sudah ada di keranjang", { action: { label: "Lihat Keranjang", onClick: () => navigate("/keranjang") } });
    }
  }
  return (
    <motion.div {...FADE_UP} transition={{ duration: 0.28, ease: "easeOut", delay: index * 0.06 }} className="h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-red-200/70 bg-card shadow-sm dark:border-red-900/40">
        <div className="relative">
          <Img src={bundle.image} alt={`Paket bundling ${bundle.name}`} ratio="4/3" sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw" />
          <Badge className="absolute left-2 top-2 rounded-md bg-amber-500 px-2 py-0.5 text-[11px] font-bold text-stone-950 shadow-sm">Paket Bundling</Badge>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-base font-bold leading-snug text-foreground">{bundle.name}</h3>
          <ul className="mt-2.5 space-y-1.5">{lines.map((l) => <li key={l.slug} className="flex items-baseline justify-between gap-2 text-xs"><span className="min-w-0"><span className="font-bold tabular-nums text-primary">{l.qty}&times;</span>{" "}<span className="text-foreground/90">{l.name}</span></span><span className="shrink-0 tabular-nums text-muted-foreground">{l.subtotal > 0 ? formatIDR(l.subtotal) : "—"}</span></li>)}</ul>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{bundle.desc}</p>
          <div className="mt-auto pt-4"><p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Total kebutuhan dalam satu kali order</p><p className="text-xl font-extrabold tabular-nums text-foreground sm:text-2xl">{formatIDR(total)}</p><Button className="mt-3 h-11 w-full font-bold" onClick={ambilPaket}><ShoppingCart className="h-4 w-4" aria-hidden /> Ambil Paket</Button></div>
        </div>
      </div>
    </motion.div>
  );
}

function DealsSection() {
  return (
    <Section label="Penawaran saat ini" className="py-10 sm:py-12">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 sm:mb-6">
        <SectionHeading title="Penawaran Saat Ini" subtitle="Paket pilihan untuk menggabungkan beberapa kebutuhan dalam satu pesanan." className="mb-0 sm:mb-0" />
        <div className="flex items-center gap-2 sm:gap-3"><Badge className="rounded-md bg-red-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">Terbatas</Badge><Countdown /></div>
      </div>
      <div className="rounded-2xl border border-red-200/50 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{BUNDLE_DEALS.map((b, i) => <BundleCard key={b.slug} bundle={b} index={i} />)}</div>
        <p className="mt-4 text-center text-xs text-red-800/80 dark:text-red-300/80">Daftar paket diperbarui setiap Senin pukul 00.00 WIB.</p>
      </div>
    </Section>
  );
}

function FeaturedSection() {
  return (
    <Section label="Pilihan layanan" className="py-10 sm:py-12">
      <SectionHeading title="Layanan yang Bisa Langsung Dipesan" subtitle="Pilih layanan, lihat detailnya, lalu lanjutkan pemesanan lewat WhatsApp." href="/katalog" actionLabel="Lihat Semua" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">{POPULAR_ITEMS.map((item, i) => <motion.div key={item.slug} {...FADE_UP} transition={{ duration: 0.26, ease: "easeOut", delay: (i % 4) * 0.05 }}><ProductCard item={item} variant="full" /></motion.div>)}</div>
    </Section>
  );
}

function PromoSection() {
  const showBrief = useBrief((s) => s.show);
  return (
    <Section label="Pilihan lain" className="py-10 sm:py-12">
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div {...FADE_UP} transition={{ duration: 0.28, ease: "easeOut" }}><div className="flex h-full flex-col rounded-2xl border border-amber-200/70 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-950/30 sm:p-6"><span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300"><Sparkles className="h-5 w-5" aria-hidden /></span><h3 className="mt-4 text-lg font-bold text-amber-950 dark:text-amber-100 sm:text-xl">Butuh Produksi Konten Rutin?</h3><p className="mt-2 text-sm leading-relaxed text-amber-900/80 dark:text-amber-200/80">Jika kebutuhan desain dan video muncul setiap bulan, paket bulanan membantu Anda mengaturnya dalam satu layanan.</p><div className="mt-auto pt-5"><Button asChild variant="outline" className="h-11 border-amber-300 bg-white/80 font-semibold text-amber-900 hover:bg-white hover:text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-100 dark:hover:bg-amber-900/60"><Link to="/langganan" ariaLabel="Lihat paket bulanan">Lihat Paket Bulanan <ArrowRight className="h-4 w-4" aria-hidden /></Link></Button></div></div></motion.div>
        <motion.div {...FADE_UP} transition={{ duration: 0.28, ease: "easeOut", delay: 0.08 }}><div className="flex h-full flex-col rounded-2xl border border-emerald-200/70 bg-emerald-50 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/30 sm:p-6"><span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-300"><ArrowUpRight className="h-5 w-5" aria-hidden /></span><h3 className="mt-4 text-lg font-bold text-emerald-950 dark:text-emerald-100 sm:text-xl">Ingin Membuat Website?</h3><p className="mt-2 text-sm leading-relaxed text-emerald-900/80 dark:text-emerald-200/80">Ceritakan kebutuhan Anda. Kami bantu menentukan jenis website, isi, dan layanan yang sesuai.</p><div className="mt-auto pt-5"><Button className="h-11 bg-emerald-600 font-semibold text-white hover:bg-emerald-700" onClick={() => showBrief({ intent: "website" })}>Mulai Konsultasi <ArrowRight className="h-4 w-4" aria-hidden /></Button></div></div></motion.div>
      </div>
    </Section>
  );
}

const NEED_CARDS = [
  { icon: Palette, title: "Ingin memperbaiki tampilan brand?", desc: "Mulai dari logo, identitas visual, hingga materi promosi.", intent: "brand" as const },
  { icon: Share2, title: "Ingin lebih aktif di media sosial?", desc: "Siapkan desain konten yang konsisten dan mudah digunakan.", intent: "social" as const },
  { icon: Globe, title: "Ingin punya website?", desc: "Bangun website yang menjelaskan bisnis Anda dengan jelas.", intent: "website" as const },
  { icon: Megaphone, title: "Ingin mempromosikan produk?", desc: "Gunakan video dan materi iklan yang lebih menarik.", intent: "promo" as const },
];

function NeedSection() {
  const showBrief = useBrief((s) => s.show);
  return (
    <Section label="Kebutuhan bisnis Anda" className="py-10 sm:py-12">
      <SectionHeading title="Mulai dari Kebutuhan Anda" subtitle="Belum tahu layanan yang tepat? Pilih kebutuhan yang paling dekat dengan kondisi bisnis Anda." />
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">{NEED_CARDS.map((card, i) => <motion.div key={card.title} {...FADE_UP} transition={{ duration: 0.26, ease: "easeOut", delay: (i % 4) * 0.05 }} className="h-full"><div className="flex h-full flex-col rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"><span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><card.icon className="h-5 w-5" aria-hidden /></span><h3 className="mt-4 text-base font-bold leading-snug text-foreground">{card.title}</h3><p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{card.desc}</p><Button variant="outline" className="mt-4 h-10 w-full font-semibold" onClick={() => showBrief({ intent: card.intent })}>Konsultasikan</Button></div></motion.div>)}</div>
    </Section>
  );
}

function NewArrivalsSection() {
  return (
    <Section label="Layanan terbaru" className="py-10 sm:py-12">
      <SectionHeading title="Baru di AlexPicture" subtitle="Ada layanan baru yang baru kami tambahkan ke katalog." href="/katalog" actionLabel="Lihat Semua" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">{NEW_ITEMS.map((item, i) => <motion.div key={item.slug} {...FADE_UP} transition={{ duration: 0.26, ease: "easeOut", delay: (i % 4) * 0.05 }}><ProductCard item={item} variant="full" /></motion.div>)}</div>
    </Section>
  );
}

function FinalCtaSection() {
  return (
    <section aria-label="Konsultasi gratis" className="mt-10 w-full bg-stone-900 sm:mt-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-12 text-center sm:py-16 lg:px-8">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#25D366]/15 text-[#25D366]"><WhatsAppIcon className="h-6 w-6" /></span>
        <h2 className="mt-4 text-balance text-2xl font-extrabold tracking-tight text-stone-50 sm:text-3xl">Ada yang Ingin Dibuat?</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-300 sm:text-base">Ceritakan kebutuhan Anda. Kalau belum tahu layanan yang tepat, tidak apa-apa — kami bantu menentukan langkah berikutnya.</p>
        <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"><Button asChild size="lg" className="h-12 bg-[#25D366] px-6 text-base font-bold text-white hover:bg-[#1eb757]"><a href={quickChatUrl()} target="_blank" rel="noopener noreferrer"><WhatsAppIcon className="h-4 w-4" /> Chat WhatsApp Sekarang</a></Button><Button asChild size="lg" variant="outline" className="h-12 border-stone-600 bg-transparent px-6 text-base font-semibold text-stone-100 hover:bg-stone-800 hover:text-white dark:border-stone-600 dark:bg-transparent dark:text-stone-100 dark:hover:bg-stone-800"><Link to="/portofolio" ariaLabel="Lihat galeri portofolio AlexPicture">Lihat Portofolio</Link></Button></div>
        <p className="mt-5 text-xs text-stone-400">Konsultasi awal tanpa biaya.</p>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <div className="w-full">
      <UspBar />
      <HeroSection />
      <CategorySection />
      <DealsSection />
      <FeaturedSection />
      <PromoSection />
      <NeedSection />
      <NewArrivalsSection />
      <FinalCtaSection />
    </div>
  );
}

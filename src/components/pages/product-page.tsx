"use client";

// ============================================================
// HALAMAN DETAIL PRODUK (#/produk/:slug) — AlexPicture Marketplace (Task 4-b)
// Layout desktop 2 kolom: galeri (kiri) + panel pesanan sticky (kanan).
// Di bawahnya (full width): Sering Dibeli Bersama, deskripsi, mini FAQ.
// Mobile: action bar sticky di atas bottom-nav (harga + keranjang + WA).
//
// Kasus khusus yang ditangani:
// - Produk tidak ditemukan → state khusus dengan CTA.
// - C1 landing-page-fullstack → Badge "Full-Stack + Domain & Hosting termasuk".
// - C2 desain-website-landing-page → Alert peringatan "desain saja" + link C1.
// - D6 addon-multi-bahasa → panel harga dinamis 35% × paket website termahal
//   di keranjang (useCartTotals().multilang); tanpa paket website → Alert
//   "harus dipesan bersama paket website" + tombol tambah C1.
// ============================================================

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Check,
  MessageCircle,
  MessageCircleQuestion,
  Minus,
  PackageSearch,
  Plus,
  TriangleAlert,
} from "lucide-react";
import { AddToCartButton } from "@/components/shared/add-to-cart-button";
import { Img } from "@/components/shared/img";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trackCategoryView, useCartStore, useCartTotals } from "@/lib/cart-store";
import {
  BADGE_LABEL,
  CATALOG,
  POPULAR_SLUGS,
  formatIDR,
  getCategory,
  getItem,
  type BadgeId,
  type CatalogItem,
} from "@/lib/catalog";
import { Link, navigate } from "@/lib/router";
import { quickChatUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

// ---------- Konstanta & helper ----------

const BADGE_STYLE: Record<BadgeId, string> = {
  terlaris: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  "best-value": "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  "paling-laris": "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  baru: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  "mulai-dari": "bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
};

/** Add-on pendamping untuk halaman produk bertipe website (PRD §11.5). */
const WEBSITE_FBT_SLUGS = [
  "addon-copywriting",
  "addon-maintenance",
  "addon-multi-bahasa",
  "addon-halaman-cp",
];

function popularRank(slug: string): number {
  const idx = POPULAR_SLUGS.indexOf(slug);
  return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
}

/**
 * "Sering Dibeli Bersama" — 4 item:
 * - item website → 4 add-on pendamping tetap;
 * - lainnya → 4 item sekategori (kecuali dirinya), diprioritaskan yang populer,
 *   lalu ditambal dari POPULAR_SLUGS bila kategori kurang dari 4.
 */
function frequentlyBoughtTogether(item: CatalogItem): CatalogItem[] {
  if (item.type === "website") {
    return WEBSITE_FBT_SLUGS.map((slug) => getItem(slug)).filter(
      (x): x is CatalogItem => x !== undefined
    );
  }
  const sameCategory = CATALOG.filter(
    (i) => i.category === item.category && i.slug !== item.slug
  ).sort((a, b) => popularRank(a.slug) - popularRank(b.slug));
  const picked = sameCategory.slice(0, 4);
  for (const slug of POPULAR_SLUGS) {
    if (picked.length >= 4) break;
    if (slug === item.slug || picked.some((p) => p.slug === slug)) continue;
    const candidate = getItem(slug);
    if (candidate) picked.push(candidate);
  }
  return picked;
}

// ---------- Sub-komponen ----------

function ProductNotFound() {
  return (
    <section
      className="mx-auto max-w-7xl px-4 py-6 sm:py-8 lg:px-8"
      aria-label="Layanan tidak ditemukan"
    >
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed py-16 text-center sm:py-24">
        <PackageSearch className="h-12 w-12 text-primary" aria-hidden />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Layanan tidak ditemukan</h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Produk yang Anda cari tidak tersedia atau sudah dipindahkan. Telusuri katalog untuk
            menemukan layanan lain yang sesuai kebutuhan Anda.
          </p>
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Button asChild className="h-11 px-6">
            <Link to="/">Ke Beranda</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 px-6">
            <Link to="/katalog">Lihat Katalog</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function ProductGallery({
  item,
  activeImage,
  onSelect,
}: {
  item: CatalogItem;
  activeImage: string | null;
  onSelect: (src: string) => void;
}) {
  const mainImage = activeImage ?? item.image;
  return (
    <div>
      <div className="overflow-hidden rounded-xl border bg-stone-100 dark:bg-stone-800/60">
        <Img
          src={mainImage}
          alt={`Contoh karya layanan ${item.name}`}
          ratio="4/3"
          priority
          sizes="(max-width: 1024px) 100vw, 760px"
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Contoh presentasi karya</p>

      {item.gallery.length > 1 && (
        <div
          className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1"
          role="group"
          aria-label="Galeri gambar produk"
        >
          {item.gallery.map((src, index) => {
            const isActive = src === mainImage;
            return (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => onSelect(src)}
                aria-label={`Lihat gambar ${index + 1} dari ${item.gallery.length}`}
                aria-pressed={isActive}
                className={cn(
                  "h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:h-20 sm:w-24",
                  isActive
                    ? "border-primary opacity-100"
                    : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                <Img src={src} alt="" ratio="4/3" className="h-full w-full" sizes="96px" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-3 py-2.5">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}

function FbtCard({ item }: { item: CatalogItem }) {
  const href = `/produk/${item.slug}`;
  return (
    <div className="flex h-full flex-col gap-2.5 rounded-xl border bg-card p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex gap-3">
        <Link to={href} ariaLabel={`Lihat detail ${item.name}`} className="shrink-0">
          <Img src={item.image} alt={item.name} ratio="1/1" className="h-16 w-16 rounded-lg" sizes="64px" />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            to={href}
            className="line-clamp-2 text-xs font-semibold leading-snug text-foreground hover:text-primary sm:text-sm"
          >
            {item.name}
          </Link>
          <p className="mt-1 text-sm font-bold tabular-nums text-foreground">
            {item.price === 0 ? "35% paket web" : formatIDR(item.price)}
          </p>
        </div>
      </div>
      <AddToCartButton slug={item.slug} size="sm" className="mt-auto h-9 w-full text-xs" />
    </div>
  );
}

// ---------- Halaman utama ----------

export function ProductPage({ slug }: { slug: string }) {
  const item = getItem(slug);
  const category = item?.category;

  // Sinyal personalisasi For You (PRD §11.4) — tanpa setState (aman utk lint).
  useEffect(() => {
    if (category) trackCategoryView(category);
  }, [category]);

  if (!item) return <ProductNotFound />;
  return <ProductDetail key={item.slug} item={item} />;
}

function ProductDetail({ item }: { item: CatalogItem }) {
  const category = getCategory(item.category);
  const add = useCartStore((s) => s.add);
  const { multilang } = useCartTotals();

  // Galeri: null = tampilkan gambar utama (item.image).
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Jumlah pesanan — hanya untuk type 'unit' atau add-on dengan maxQty > 1.
  const qtyEligible = item.type === "unit" || (item.type === "addon" && item.maxQty > 1);
  const [qtyInput, setQtyInput] = useState(String(item.minQty));
  const qtyNum = Math.min(
    item.maxQty,
    Math.max(item.minQty, Number.parseInt(qtyInput, 10) || item.minQty)
  );
  const effectiveQty = qtyEligible ? qtyNum : 1;

  function setQty(next: number) {
    setQtyInput(String(Math.min(item.maxQty, Math.max(item.minQty, next))));
  }

  // ---------- Kasus khusus multi-bahasa (harga dinamis 35%) ----------
  const isMultilang = item.slug === "addon-multi-bahasa";
  const hasWebsiteBase = multilang.basePrice != null;
  const basePriceValue = multilang.basePrice ?? 0;
  const dynamicPrice = hasWebsiteBase
    ? multilang.price ?? Math.round(basePriceValue * 0.35)
    : undefined;
  const baseItem = multilang.baseSlug !== undefined ? getItem(multilang.baseSlug) : undefined;

  // ---------- Aksi ----------
  function orderNow() {
    const result = add(item.slug, effectiveQty);
    if (!result.ok && result.reason === "exists") {
      toast.info("Sudah ada di keranjang", {
        description: "Lanjut ke keranjang untuk menyelesaikan pesanan.",
      });
    }
    navigate("/keranjang");
  }

  function addBaseWebsite() {
    const result = add("landing-page-fullstack", 1);
    if (result.ok) {
      toast.success("Landing Page Full-Stack ditambahkan", {
        description: "Harga multi-bahasa kini dihitung dari paket website tersebut.",
        action: { label: "Lihat Keranjang", onClick: () => navigate("/keranjang") },
      });
    } else if (result.reason === "exists") {
      toast.info("Paket sudah ada di keranjang", {
        description: "Harga multi-bahasa dihitung dari paket termahal di keranjang.",
        action: { label: "Lihat Keranjang", onClick: () => navigate("/keranjang") },
      });
    }
  }

  // ---------- Harga untuk action bar mobile ----------
  const unitPrice = isMultilang ? dynamicPrice : item.price;
  const mobileTotal = unitPrice != null ? formatIDR(unitPrice * effectiveQty) : "35% paket web";
  const mobileCaption =
    effectiveQty > 1 && unitPrice != null
      ? `${effectiveQty} × ${formatIDR(unitPrice)}`
      : item.unit;

  const fbtItems = frequentlyBoughtTogether(item);

  return (
    <section
      className="mx-auto max-w-7xl px-4 pt-6 pb-16 sm:pt-8 md:pb-8 lg:px-8"
      aria-label={`Detail layanan ${item.name}`}
    >
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList className="text-xs sm:text-sm">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Beranda</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/katalog">Katalog</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-[10rem] truncate sm:max-w-xs" aria-current="page">
              {item.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-4 lg:grid lg:grid-cols-[1fr_420px] lg:gap-8">
        {/* Kolom kiri: galeri */}
        <div className="min-w-0">
          <ProductGallery item={item} activeImage={activeImage} onSelect={setActiveImage} />
        </div>

        {/* Kolom kanan: panel pesanan (sticky di desktop, di bawah header 150px) */}
        <aside className="mt-8 lg:mt-0" aria-label="Panel pesanan">
          <div className="space-y-5 lg:sticky lg:top-40">
            {/* Baris kategori + badge + kode */}
            <div className="flex flex-wrap items-center gap-2">
              {category && (
                <Link
                  to={`/katalog?kategori=${category.id}`}
                  className="inline-flex h-9 items-center rounded-full border bg-secondary px-3 text-xs font-semibold text-secondary-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  {category.name}
                </Link>
              )}
              {item.badge && (
                <Badge
                  className={cn("rounded-md px-2 py-0.5 text-[11px] font-bold", BADGE_STYLE[item.badge])}
                >
                  {BADGE_LABEL[item.badge]}
                </Badge>
              )}
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Kode {item.code}
              </span>
            </div>

            {/* Nama + harga */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {item.name}
              </h1>
              {isMultilang ? (
                <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
                  <p className="text-xl font-bold leading-tight tracking-tight text-foreground sm:text-2xl">
                    35% × paket website termahal di keranjang
                  </p>
                  <span className="text-sm text-muted-foreground">{item.unit}</span>
                </div>
              ) : (
                <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  {item.badge === "mulai-dari" && (
                    <span className="text-sm font-medium text-muted-foreground">Mulai</span>
                  )}
                  <span className="text-3xl font-extrabold tracking-tight tabular-nums text-foreground sm:text-4xl">
                    {formatIDR(item.price)}
                  </span>
                  <span className="text-sm text-muted-foreground">{item.unit}</span>
                </div>
              )}
            </div>

            {/* Panel harga dinamis multi-bahasa */}
            {isMultilang &&
              (dynamicPrice !== undefined && hasWebsiteBase && baseItem ? (
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 dark:border-primary/40 dark:bg-primary/10">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Harga dinamis
                  </p>
                  <p className="mt-1 text-sm tabular-nums text-foreground">
                    35% × {formatIDR(basePriceValue)} ={" "}
                    <span className="text-base font-bold">{formatIDR(dynamicPrice)}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Dihitung dari paket termahal di keranjang Anda: {baseItem.name}.
                  </p>
                </div>
              ) : (
                <Alert className="border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                  <TriangleAlert className="text-amber-600 dark:text-amber-400" aria-hidden />
                  <AlertTitle className="text-amber-900 dark:text-amber-100">
                    Harus dipesan bersama paket website
                  </AlertTitle>
                  <AlertDescription className="text-amber-800 dark:text-amber-300">
                    <p>
                      Add-on ini harus dipesan bersama paket website agar dapat dikerjakan dan
                      harganya dihitung (35% dari paket utama).
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      onClick={addBaseWebsite}
                      className="mt-2 h-9 border border-amber-400 bg-amber-100 text-amber-900 hover:bg-amber-200 dark:border-amber-700 dark:bg-amber-900/60 dark:text-amber-100 dark:hover:bg-amber-900"
                    >
                      Tambah Landing Page Full-Stack
                    </Button>
                  </AlertDescription>
                </Alert>
              ))}

            {/* C1: badge penegas full-stack */}
            {item.slug === "landing-page-fullstack" && (
              <Badge className="w-fit rounded-md border border-amber-300 bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
                Full-Stack + Domain &amp; Hosting termasuk
              </Badge>
            )}

            {/* C2: peringatan desain saja */}
            {item.slug === "desain-website-landing-page" && (
              <Alert className="border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                <TriangleAlert className="text-amber-600 dark:text-amber-400" aria-hidden />
                <AlertTitle className="text-amber-900 dark:text-amber-100">
                  Desain saja — tanpa development
                </AlertTitle>
                <AlertDescription className="text-amber-800 dark:text-amber-300">
                  <p>
                    Paket ini tidak termasuk development, hosting, dan domain. Butuh website yang
                    langsung tayang?{" "}
                    <Link
                      to="/produk/landing-page-fullstack"
                      className="font-semibold text-amber-900 underline underline-offset-2 hover:text-amber-700 dark:text-amber-200 dark:hover:text-amber-100"
                    >
                      Lihat Landing Page Full-Stack.
                    </Link>
                  </p>
                </AlertDescription>
              </Alert>
            )}

            {/* Deliverables */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground">
                Yang Anda Dapat
              </h2>
              <ul className="mt-2.5 space-y-2">
                {item.deliverables.map((deliverable) => (
                  <li key={deliverable} className="flex items-start gap-2 text-sm text-foreground/90">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                      aria-hidden
                    />
                    <span>{deliverable}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Spesifikasi */}
            <dl className="divide-y overflow-hidden rounded-lg border text-sm" aria-label="Spesifikasi layanan">
              <SpecRow label="Jumlah revisi" value={item.revisions} />
              <SpecRow label="Estimasi pengerjaan" value={item.duration} />
              <SpecRow label="Format file" value={item.fileFormats} />
              <SpecRow label="Satuan" value={item.unit} />
            </dl>

            {/* Selector jumlah */}
            {qtyEligible ? (
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="product-qty" className="text-sm font-medium text-foreground">
                    Jumlah
                  </label>
                  <span className="text-xs text-muted-foreground">
                    Min {item.minQty} · Maks {item.maxQty}
                  </span>
                </div>
                <div className="mt-2 flex h-12 items-center overflow-hidden rounded-lg border">
                  <button
                    type="button"
                    onClick={() => setQty(qtyNum - 1)}
                    disabled={qtyNum <= item.minQty}
                    aria-label="Kurangi jumlah"
                    className="grid h-full w-12 place-items-center text-muted-foreground transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" aria-hidden />
                  </button>
                  <Input
                    id="product-qty"
                    type="number"
                    inputMode="numeric"
                    min={item.minQty}
                    max={item.maxQty}
                    value={qtyInput}
                    onChange={(e) => setQtyInput(e.target.value)}
                    onBlur={() => setQtyInput(String(qtyNum))}
                    className="h-full w-16 rounded-none border-x text-center tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQty(qtyNum + 1)}
                    disabled={qtyNum >= item.maxQty}
                    aria-label="Tambah jumlah"
                    className="grid h-full w-12 place-items-center text-muted-foreground transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>
            ) : (
              <p className="rounded-lg border border-dashed px-3 py-2.5 text-sm text-muted-foreground">
                Tipe layanan: 1 proyek per pesan
              </p>
            )}

            {/* Aksi utama */}
            <div className="space-y-2.5">
              <AddToCartButton
                slug={item.slug}
                qty={effectiveQty}
                label="Tambah ke Keranjang"
                className="h-12 w-full text-sm sm:text-base"
              />
              <Button
                type="button"
                variant="outline"
                onClick={orderNow}
                className="h-12 w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
              >
                <MessageCircle className="h-5 w-5" aria-hidden />
                Pesan Sekarang via WhatsApp
              </Button>
              <p className="flex items-start gap-2 pt-0.5 text-xs text-muted-foreground">
                <MessageCircleQuestion className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>
                  Butuh penyesuaian?{" "}
                  <a
                    href={quickChatUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary underline-offset-2 hover:underline"
                  >
                    Chat dulu gratis.
                  </a>
                </span>
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* ====== Seksi bawah (full width) ====== */}
      <div className="mt-10 space-y-10 sm:mt-12 sm:space-y-12">
        {/* Sering Dibeli Bersama */}
        <section aria-label="Sering dibeli bersama">
          <SectionHeading
            title="Sering Dibeli Bersama"
            subtitle="Lengkapi pesanan Anda dengan layanan pelengkap populer."
          />
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {fbtItems.map((fbt) => (
              <FbtCard key={fbt.slug} item={fbt} />
            ))}
          </div>
        </section>

        {/* Deskripsi panjang */}
        <section aria-label="Tentang layanan ini">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-lg font-bold text-foreground sm:text-xl">
                Tentang Layanan Ini
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                {item.description}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Mini FAQ */}
        <section aria-label="Pertanyaan umum layanan">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-lg font-bold text-foreground sm:text-xl">Pertanyaan Umum</h2>
              <Accordion type="single" collapsible className="mt-1">
                <AccordionItem value="revisi">
                  <AccordionTrigger className="py-3.5 text-sm sm:text-[15px]">
                    Berapa kali revisi?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    Setiap pesanan layanan ini mencakup {item.revisions}. Kebutuhan revisi tambahan
                    dapat dibahas terlebih dahulu melalui WhatsApp.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="format">
                  <AccordionTrigger className="py-3.5 text-sm sm:text-[15px]">
                    Format file yang saya terima?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    Anda menerima hasil akhir dalam bentuk {item.fileFormats}.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="durasi">
                  <AccordionTrigger className="py-3.5 text-sm sm:text-[15px]">
                    Berapa lama pengerjaan?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    Estimasi pengerjaan {item.duration}, dihitung setelah brief dan materi pendukung
                    lengkap diterima.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* ====== Action bar mobile (di atas bottom-nav) ====== */}
      <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-40 border-t bg-background/95 p-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] backdrop-blur supports-[backdrop-filter]:bg-background/90 md:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 shrink-0">
            <p className="text-[11px] leading-tight text-muted-foreground">{mobileCaption}</p>
            <p className="text-base font-extrabold leading-tight tabular-nums text-foreground">
              {mobileTotal}
            </p>
          </div>
          <AddToCartButton
            slug={item.slug}
            qty={effectiveQty}
            className="h-11 min-w-0 flex-1 text-xs"
            aria-label={`Tambah ${item.name} ke keranjang`}
          />
          <Button
            type="button"
            variant="outline"
            onClick={orderNow}
            aria-label="Pesan sekarang via WhatsApp"
            className="h-11 w-11 shrink-0 border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
          >
            <MessageCircle className="h-5 w-5" aria-hidden />
          </Button>
        </div>
      </div>
    </section>
  );
}

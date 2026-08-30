"use client";

// ============================================================
// HALAMAN KATALOG (#/katalog) — AlexPicture Marketplace (Task 4-b)
// Toolbar: pencarian + sort + chips kategori + toggle harga.
// Grid kartu produk (12 awal + muat lebih banyak), empty state,
// breadcrumb, dan pelacakan view kategori untuk personalisasi For You.
//
// Catatan arsitektur state:
// - Query URL (kategori, q) adalah sumber filter AWAL; perubahan filter
//   lokal TIDAK menulis ulang URL (PRD §11.1).
// - Sinkronisasi query → filter dilakukan murni lewat derivasi render:
//   override lokal "ditandai" dengan query string saat ia dibuat, sehingga
//   saat query berubah override lama otomatis diabaikan — tanpa setState
//   di useEffect maupun saat render (patuh react-hooks/set-state-in-effect
//   dan set-state-in-render).
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Search, SearchX } from "lucide-react";
import { ProductCard } from "@/components/shared/product-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { trackCategoryView } from "@/lib/cart-store";
import {
  CATALOG,
  CATEGORIES,
  POPULAR_SLUGS,
  getCollection,
  getCategory,
  type CatalogItem,
  type CategoryId,
} from "@/lib/catalog";
import { Link, useHashRoute } from "@/lib/router";
import { cn } from "@/lib/utils";

// ---------- Konstanta & tipe ----------

const PAGE_SIZE = 12;
const CHEAP_LIMIT = 50000; // toggle "Hanya < Rp50.000"

type SortKey = "populer" | "murah" | "mahal" | "cepat";
type CategoryFilter = CategoryId | "all";

interface CatalogFilters {
  q: string;
  cat: CategoryFilter;
  cheap: boolean;
  sort: SortKey;
  /** ID koleksi cross-category (cth: "ad-creative") — null = nonaktif. */
  collection: string | null;
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "populer", label: "Terpopuler" },
  { value: "murah", label: "Harga Terendah" },
  { value: "mahal", label: "Harga Tertinggi" },
  { value: "cepat", label: "Tercepat Selesai" },
];

/** Konstanta objek kosong stabil — menghindari pembuatan objek baru tiap render. */
const NO_LOCAL: Partial<CatalogFilters> = {};

/** Peringkat popularitas (0 = paling populer); di luar daftar = paling akhir. */
function popularRank(slug: string): number {
  const idx = POPULAR_SLUGS.indexOf(slug);
  return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
}

/**
 * Estimasi durasi → jumlah hari (batas bawah rentang).
 * Contoh: "1 hari kerja" → 1, "2–3 hari kerja" → 2, "1 minggu" → 7,
 * "Kontrak minimal 3 bulan" → 90, "Scope via workshop" → Infinity.
 */
function durationDays(duration: string): number {
  const re = /(\d+)\s*(hari|minggu|bulan)/g;
  const text = duration.toLowerCase();
  let min = Number.POSITIVE_INFINITY;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const value = Number.parseInt(match[1], 10);
    const unit = match[2] === "hari" ? 1 : match[2] === "minggu" ? 7 : 30;
    min = Math.min(min, value * unit);
  }
  return min;
}

/** Harga untuk pengurutan — harga 0 (dinamis multi-bahasa) diletakkan paling akhir. */
function priceForSort(item: CatalogItem): number {
  return item.price > 0 ? item.price : Number.MAX_SAFE_INTEGER;
}

function matchesQuery(item: CatalogItem, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  return (
    item.name.toLowerCase().includes(needle) ||
    item.short.toLowerCase().includes(needle) ||
    item.code.toLowerCase().includes(needle) ||
    item.keywords.some((k) => k.toLowerCase().includes(needle))
  );
}

/** Sort stabil: item dengan peringkat sama mempertahankan urutan katalog. */
function sortCatalog(items: CatalogItem[], sort: SortKey): CatalogItem[] {
  const list = [...items];
  switch (sort) {
    case "murah":
      return list.sort((a, b) => priceForSort(a) - priceForSort(b));
    case "mahal":
      return list.sort((a, b) => priceForSort(b) - priceForSort(a));
    case "cepat":
      return list.sort((a, b) => durationDays(a.duration) - durationDays(b.duration));
    default:
      // Terpopuler: POPULAR_SLUGS dulu (urutan daftar), sisanya mengikuti katalog.
      return list.sort((a, b) => popularRank(a.slug) - popularRank(b.slug));
  }
}

// ---------- Sub-komponen ----------

function CategoryChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-11 shrink-0 items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-input bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function CatalogEmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mt-6 flex flex-col items-center gap-4 rounded-xl border border-dashed py-16 text-center sm:py-20">
      <SearchX className="h-10 w-10 text-muted-foreground" aria-hidden />
      <div>
        <h2 className="text-lg font-semibold text-foreground">Tidak ada layanan yang cocok</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Coba kata kunci lain, ganti kategori, atau matikan filter harga agar lebih banyak hasil
          muncul.
        </p>
      </div>
      <Button variant="outline" className="h-11 px-6" onClick={onReset}>
        <RotateCcw className="h-4 w-4" aria-hidden />
        Reset Filter
      </Button>
    </div>
  );
}

// ---------- Halaman utama ----------

export function CatalogPage() {
  const { query } = useHashRoute();
  const qs = query.toString();

  // Override lokal "berlaku" hanya untuk query saat ia dibuat — saat query
  // berubah (klik kategori dari beranda/header), override lama otomatis
  // diabaikan dan filter kembali mengikuti query, tanpa setState di efek.
  const [local, setLocal] = useState<{ qs: string; data: Partial<CatalogFilters> }>({
    qs: "",
    data: NO_LOCAL,
  });
  const [more, setMore] = useState<{ qs: string; extra: number }>({ qs: "", extra: 0 });

  const activeLocal = local.qs === qs ? local.data : NO_LOCAL;
  const extraVisible = more.qs === qs ? more.extra : 0;

  const filters = useMemo<CatalogFilters>(() => {
    const catParam = query.get("kategori");
    const cat: CategoryFilter =
      catParam !== null && CATEGORIES.some((c) => c.id === catParam)
        ? (catParam as CategoryId)
        : "all";
    const koleksiParam = query.get("koleksi");
    return {
      q: (query.get("q") ?? "").trim(),
      cat,
      cheap: false,
      sort: "populer",
      collection: koleksiParam && getCollection(koleksiParam) ? koleksiParam : null,
      ...activeLocal,
    };
  }, [query, activeLocal]);

  const filtered = useMemo(() => {
    const collectionSlugs = filters.collection ? getCollection(filters.collection)?.slugs : null;
    const items = CATALOG.filter(
      (i) =>
        (!collectionSlugs || collectionSlugs.includes(i.slug)) &&
        (filters.cat === "all" || i.category === filters.cat) &&
        (!filters.cheap || (i.price > 0 && i.price < CHEAP_LIMIT)) &&
        matchesQuery(i, filters.q)
    );
    return sortCatalog(items, filters.sort);
  }, [filters]);

  const visible = Math.min(filtered.length, PAGE_SIZE + extraVisible);
  const remaining = filtered.length - visible;

  function patchFilters(patch: Partial<CatalogFilters>) {
    setLocal({ qs, data: { ...activeLocal, ...patch } });
    setMore({ qs, extra: 0 });
  }

  function resetFilters() {
    setLocal({ qs, data: { q: "", cat: "all", cheap: false, collection: null } });
    setMore({ qs, extra: 0 });
  }

  // Sinyal personalisasi For You (PRD §11.4) — terpicu saat katalog dibuka
  // dengan kategori terpilih (query) maupun saat user memilih chip kategori.
  // Efek ini tidak memanggil setState (aman untuk react-hooks/set-state-in-effect).
  const activeCatId: CategoryId | null = filters.cat !== "all" ? filters.cat : null;
  const activeCategory = activeCatId !== null ? getCategory(activeCatId) : undefined;
  const activeCollection = filters.collection ? getCollection(filters.collection) : undefined;

  useEffect(() => {
    if (activeCatId) trackCategoryView(activeCatId);
  }, [activeCatId]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:py-8 lg:px-8" aria-label="Katalog Layanan">
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
            <BreadcrumbPage aria-current="page">Katalog</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Judul + jumlah hasil */}
      <div className="mt-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Katalog Layanan
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {filtered.length} layanan ditemukan
          {filters.q ? ` untuk kata kunci “${filters.q}”` : ""}
          {activeCollection ? ` di koleksi ${activeCollection.name}` : ""}
          {activeCategory ? ` di kategori ${activeCategory.name}` : ""}
        </p>
      </div>

      {/* Toolbar filter — sticky di bawah header (mobile ±65px, desktop 150px) */}
      <Card className="sticky top-[4.5rem] z-30 mt-4 gap-0 rounded-xl p-3 md:top-40 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              enterKeyHint="search"
              value={filters.q}
              onChange={(e) => patchFilters({ q: e.target.value })}
              placeholder="Cari logo, feed IG, video…"
              aria-label="Cari layanan di katalog"
              className="h-11 pl-9"
            />
          </div>
          <div className="sm:w-52">
            <Select
              value={filters.sort}
              onValueChange={(value) => patchFilters({ sort: value as SortKey })}
            >
              <SelectTrigger aria-label="Urutkan layanan" className="h-11 w-full">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-0.5"
            role="group"
            aria-label="Filter kategori"
          >
            <CategoryChip active={filters.cat === "all" && !filters.collection} onClick={() => patchFilters({ cat: "all", collection: null })}>
              Semua
            </CategoryChip>
            {CATEGORIES.map((category) => (
              <CategoryChip
                key={category.id}
                active={filters.cat === category.id && !filters.collection}
                onClick={() => patchFilters({ cat: category.id, collection: null })}
              >
                {category.name}
              </CategoryChip>
            ))}
          </div>
          <Label
            htmlFor="catalog-cheap-toggle"
            className="min-h-11 w-fit cursor-pointer justify-start gap-3 text-sm font-medium text-muted-foreground sm:shrink-0"
          >
            <Switch
              id="catalog-cheap-toggle"
              checked={filters.cheap}
              onCheckedChange={(checked) => patchFilters({ cheap: checked })}
            />
            {"Hanya < Rp50.000"}
          </Label>
        </div>
      </Card>

      {/* Grid hasil / empty state */}
      {filtered.length === 0 ? (
        <CatalogEmptyState onReset={resetFilters} />
      ) : (
        <div className="mt-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {filtered.slice(0, visible).map((item) => (
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <ProductCard item={item} variant="full" />
              </motion.div>
            ))}
          </div>

          {remaining > 0 && (
            <div className="mt-6 flex flex-col items-center gap-2">
              <p className="text-xs text-muted-foreground">
                Menampilkan {visible} dari {filtered.length} layanan
              </p>
              <Button
                variant="outline"
                className="h-12 px-8"
                onClick={() => setMore({ qs, extra: extraVisible + PAGE_SIZE })}
              >
                Muat lebih banyak
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

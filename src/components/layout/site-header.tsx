"use client";

// ============================================================
// SITE HEADER — AlexPicture Marketplace (revisi R3 / D-R3-01…11)
// Desktop: top bar + logo/search/aksi + nav row dengan MEGA MENU
// "Layanan" (5 kolom bergambar), Katalog, Portofolio, Lacak
// Pesanan, Tentang, Kontak (anchor footer) + pill WhatsApp resmi.
// Mobile: drawer Sheet + bottom nav (terpisah).
// ============================================================

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock,
  Clapperboard,
  Crown,
  Globe,
  Heart,
  Image as ImageIcon,
  Info,
  LayoutGrid,
  Menu,
  Moon,
  Package,
  PackageSearch,
  Palette,
  Phone,
  Puzzle,
  Search,
  ShoppingCart,
  Sun,
  Trash2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Img } from "@/components/shared/img";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { useCartStore, useMounted, useWishlistStore } from "@/lib/cart-store";
import { CATALOG, CATEGORIES, formatIDR, getItem, type CategoryId } from "@/lib/catalog";
import { Link, navigate } from "@/lib/router";
import { SITE } from "@/lib/site";
import { quickChatUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

// ---------- Ikon kategori (peta id → komponen Lucide) ----------
const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  desain: Palette,
  video: Clapperboard,
  website: Globe,
  addon: Puzzle,
  retainer: Crown,
};

function CategoryIcon({ id, className }: { id: string; className?: string }) {
  const Icon = CATEGORY_ICONS[id] || LayoutGrid;
  return <Icon className={className} aria-hidden />;
}

/** Scroll halus ke blok kontak di footer (D-R3-11). */
function scrollToKontak(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  document.getElementById("kontak")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---------- Logo ----------
function Logo() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-1.5 sm:gap-2" ariaLabel="AlexPicture — kembali ke beranda">
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm sm:h-9 sm:w-9">
        <span className="text-sm font-extrabold sm:text-lg">A</span>
      </span>
      <span className="text-base font-extrabold tracking-tight text-foreground sm:text-xl">
        AlexPicture<span className="text-primary">.</span>
      </span>
    </Link>
  );
}

// ---------- Search dengan suggestion ----------
function SearchBox({ className, autoFocus }: { className?: string; autoFocus?: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    return CATALOG.filter(
      (i) =>
        i.name.toLowerCase().includes(term) ||
        i.short.toLowerCase().includes(term) ||
        i.keywords.some((k) => k.includes(term))
    ).slice(0, 6);
  }, [q]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function submit() {
    const term = q.trim();
    if (!term) return;
    setOpen(false);
    navigate(`/katalog?q=${encodeURIComponent(term)}`);
  }

  return (
    <div ref={boxRef} className={cn("relative w-full", className)}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <label htmlFor="global-search" className="sr-only">
          Cari layanan kreatif
        </label>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          id="global-search"
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Cari layanan desain, website, atau video..."
          className="h-10 rounded-full border-stone-300 bg-white pl-9 pr-4 text-sm shadow-sm placeholder:text-stone-400 focus-visible:ring-amber-500/40 dark:border-stone-700 dark:bg-stone-900"
          autoComplete="off"
        />
      </form>

      {open && q.trim().length >= 2 && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border bg-popover shadow-xl">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              Tidak ada hasil untuk &ldquo;{q.trim()}&rdquo; — coba kata lain atau{" "}
              <Link to="/katalog" className="font-semibold text-primary" onClick={() => setOpen(false)}>
                telusuri katalog
              </Link>
              .
            </p>
          ) : (
            <ul className="max-h-96 overflow-y-auto scrollbar-slim py-1">
              {results.map((item) => (
                <li key={item.slug}>
                  <Link
                    to={`/produk/${item.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-accent"
                  >
                    <Img src={item.image} alt="" ratio="1/1" className="h-10 w-10 shrink-0 rounded-lg" sizes="40px" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-foreground">{item.name}</span>
                      <span className="block text-xs text-muted-foreground">{item.unit}</span>
                    </span>
                    <span className="shrink-0 text-sm font-bold tabular-nums text-primary">
                      {item.price === 0 ? "35%" : formatIDR(item.price)}
                    </span>
                  </Link>
                </li>
              ))}
              <li className="border-t bg-stone-50/50 dark:bg-stone-900/50">
                <button
                  type="button"
                  onClick={submit}
                  className="flex w-full items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-primary hover:underline"
                >
                  Lihat semua hasil untuk &ldquo;{q.trim()}&rdquo;
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- MEGA MENU "Layanan" — 5 kolom bergambar ----------
// Tiap kolom: gambar kategori + 4 layanan teratas (urut POPULAR)
// + tautan "Lihat Semua". Koleksi Ad Creative masuk kartu beranda.

/** 4 layanan teratas per kategori (populer dulu, fallback urutan katalog). */
const TOP_BY_CATEGORY: Record<CategoryId, string[]> = (() => {
  const rank = (slug: string) => {
    const order = ["desain-feed-instagram", "logo-starter", "feed-instagram-carousel", "video-ugc-20", "landing-page-fullstack", "materi-iklan-meta", "ecommerce-umkm", "video-company-profile-60"];
    const idx = order.indexOf(slug);
    return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
  };
  const out = {} as Record<CategoryId, string[]>;
  for (const c of CATEGORIES) {
    out[c.id] = CATALOG.filter((i) => i.category === c.id)
      .sort((a, b) => rank(a.slug) - rank(b.slug))
      .slice(0, 4)
      .map((i) => i.slug);
  }
  return out;
})();

function MegaMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent hover:text-primary">
          <LayoutGrid className="h-4 w-4 text-primary" aria-hidden />
          Layanan
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-[min(94vw,980px)] p-0"
      >
        <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((cat) => {
            const items = TOP_BY_CATEGORY[cat.id].map(getItem).filter((i) => i !== undefined);
            const total = CATALOG.filter((i) => i.category === cat.id).length;
            return (
              <div key={cat.id} className="flex flex-col rounded-xl border bg-card/60 p-2">
                <Img
                  src={cat.image}
                  alt={`Kategori ${cat.name}`}
                  ratio="16/9"
                  className="w-full rounded-lg"
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 190px"
                />
                <Link
                  to={`/katalog?kategori=${cat.id}`}
                  className="mt-2 flex items-center gap-1.5 px-1 text-sm font-bold text-foreground hover:text-primary"
                >
                  <CategoryIcon id={cat.id} className="h-3.5 w-3.5 shrink-0 text-primary" />
                  {cat.name}
                </Link>
                <ul className="mt-1.5 flex-1">
                  {items.map((item) => (
                    <li key={item.slug}>
                      <Link
                        to={`/produk/${item.slug}`}
                        className="block truncate rounded-md px-2 py-1.5 text-xs text-foreground/85 hover:bg-accent hover:text-primary"
                        title={item.name}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/katalog?kategori=${cat.id}`}
                  className="mt-1 inline-flex items-center gap-0.5 px-1 pb-1 pt-2 text-xs font-semibold text-primary hover:underline"
                >
                  Lihat Semua ({total})
                  <ChevronRight className="h-3 w-3" aria-hidden />
                </Link>
              </div>
            );
          })}
        </div>
        {/* Strip bawah — bantuan memilih */}
        <div className="flex items-center justify-between gap-3 border-t bg-stone-50/70 px-4 py-2.5 dark:bg-stone-900/70">
          <p className="text-xs text-muted-foreground">
            Tidak yakin harus mulai dari mana? Tim kami bantu memilih.
          </p>
          <a
            href={quickChatUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1eb757]"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
            Chat WhatsApp
          </a>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ---------- Sheet Wishlist ----------
function WishlistSheet() {
  const mounted = useMounted();
  const slugs = useWishlistStore((s) => s.slugs);
  const toggle = useWishlistStore((s) => s.toggle);
  const clearWishlist = useWishlistStore((s) => s.clear);
  const add = useCartStore((s) => s.add);
  const items = useMemo(() => slugs.map(getItem).filter((i) => i !== undefined), [slugs]);
  const count = mounted ? slugs.length : 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 sm:h-10 sm:w-10"
          aria-label={`Wishlist (${count} item)`}
        >
          <Heart className="h-5 w-5" aria-hidden />
          {count > 0 && (
            <Badge className="absolute -right-0.5 -top-0.5 h-5 min-w-5 rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {count}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" aria-hidden />
            Wishlist Saya
            {count > 0 && <Badge className="rounded-full bg-red-500 text-white">{count}</Badge>}
          </SheetTitle>
        </SheetHeader>
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <Heart className="h-12 w-12 text-stone-300 dark:text-stone-700" aria-hidden />
            <p className="text-sm text-muted-foreground">Belum ada layanan yang disimpan. Tekan ikon hati pada produk untuk menyimpannya di sini.</p>
            <Button asChild variant="outline" className="mt-2">
              <Link to="/katalog">Lihat Katalog</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto scrollbar-slim p-4">
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.slug} className="flex gap-3 rounded-xl border bg-card p-3">
                    <Link to={`/produk/${item.slug}`} className="shrink-0">
                      <Img src={item.image} alt={item.name} ratio="1/1" className="h-16 w-16 rounded-lg" sizes="64px" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <Link to={`/produk/${item.slug}`} className="line-clamp-1 text-sm font-semibold text-foreground hover:text-primary">
                        {item.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.unit}</p>
                      <p className="mt-1 text-sm font-bold tabular-nums text-primary">
                        {item.price === 0 ? "35% paket web" : formatIDR(item.price)}
                      </p>
                      <div className="mt-auto flex gap-2 pt-2">
                        <Button
                          size="sm"
                          className="h-8 flex-1 text-xs"
                          onClick={() => {
                            const res = add(item.slug, 1);
                            if (res.ok) toast.success("Berhasil ditambahkan ke keranjang");
                            else toast.info("Sudah ada di keranjang");
                          }}
                        >
                          <ShoppingCart className="h-3.5 w-3.5" aria-hidden /> Ke Keranjang
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                          aria-label={`Hapus ${item.name} dari wishlist`}
                          onClick={() => {
                            toggle(item.slug);
                            toast.info("Dihapus dari wishlist");
                          }}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t p-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-muted-foreground"
                onClick={() => {
                  clearWishlist();
                  toast.info("Wishlist dikosongkan");
                }}
              >
                <Trash2 className="h-4 w-4" aria-hidden /> Kosongkan Wishlist
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ---------- Header utama ----------
export function SiteHeader() {
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();
  const items = useCartStore((s) => s.items);
  const totalQty = mounted ? items.reduce((n, i) => n + i.qty, 0) : 0;
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="hidden bg-stone-900 text-stone-300 dark:bg-black md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 text-xs lg:px-8">
          <p className="truncate">
            <span className="font-semibold text-amber-400">Konsultasi awal tanpa biaya</span> — langsung chat tim kami
          </p>
          <div className="flex shrink-0 items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-400" aria-hidden />
              {SITE.hoursShort}
            </span>
            <Separator orientation="vertical" className="h-3.5 bg-stone-700" />
            <Link to="/faq" className="inline-flex items-center gap-1.5 hover:text-amber-400">
              <CircleHelp className="h-3.5 w-3.5" aria-hidden />
              Bantuan & FAQ
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/85">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex h-14 items-center gap-1.5 sm:h-16 sm:gap-3">
            {/* Mobile: hamburger */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden" aria-label="Buka menu navigasi">
                  <Menu className="h-5 w-5" aria-hidden />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto scrollbar-slim p-0">
                <SheetHeader className="border-b p-4">
                  <SheetTitle className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                      <span className="font-extrabold">A</span>
                    </span>
                    AlexPicture<span className="text-primary">.</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="p-4" aria-label="Menu utama mobile">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Kategori Layanan</p>
                  <ul className="space-y-1">
                    {CATEGORIES.map((c) => (
                      <li key={c.id}>
                        <Link
                          to={`/katalog?kategori=${c.id}`}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent"
                        >
                          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent">
                            <CategoryIcon id={c.id} className="h-4 w-4 text-primary" />
                          </span>
                          {c.name}
                          <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" aria-hidden />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Separator className="my-4" />
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lainnya</p>
                  <ul className="space-y-1">
                    {[
                      { to: "/katalog", label: "Katalog", icon: LayoutGrid },
                      { to: "/portofolio", label: "Portofolio", icon: ImageIcon },
                      { to: "/lacak-pesanan", label: "Lacak Pesanan", icon: PackageSearch },
                      { to: "/faq", label: "FAQ", icon: CircleHelp },
                      { to: "/tentang", label: "Tentang Kami", icon: Info },
                      { to: "/langganan", label: "Paket Bulanan", icon: Package },
                    ].map((l) => (
                      <li key={l.to}>
                        <Link
                          to={l.to}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent"
                        >
                          <l.icon className="h-4 w-4 text-primary" aria-hidden />
                          {l.label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <a
                        href="#kontak"
                        onClick={(e) => {
                          e.preventDefault();
                          setMenuOpen(false);
                          // Tutup drawer dulu, lalu scroll setelah animasi
                          setTimeout(() => {
                            document.getElementById("kontak")?.scrollIntoView({ behavior: "smooth" });
                          }, 250);
                        }}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent"
                      >
                        <span className="grid h-4 w-4 place-items-center">
                          <Phone className="h-4 w-4 text-primary" aria-hidden />
                        </span>
                        Kontak
                      </a>
                    </li>
                  </ul>
                  <Separator className="my-4" />
                  <Button asChild className="w-full bg-[#25D366] text-white hover:bg-[#1eb757]">
                    <a href={quickChatUrl()} target="_blank" rel="noopener noreferrer">
                      <WhatsAppIcon className="h-4 w-4" /> Chat WhatsApp
                    </a>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>

            <Logo />

            {/* Search desktop */}
            <SearchBox className="mx-4 hidden max-w-xl flex-1 md:block" />

            <div className="ml-auto flex items-center gap-1">
              {/* Search mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 md:hidden"
                aria-label="Cari layanan"
                onClick={() => setMobileSearchOpen((v) => !v)}
              >
                <Search className="h-5 w-5" aria-hidden />
              </Button>

              {/* Theme toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 sm:h-10 sm:w-10"
                aria-label={theme === "dark" ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {mounted && theme === "dark" ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}
              </Button>

              <WishlistSheet />

              {/* Cart */}
              <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10" asChild>
                <Link to="/keranjang" ariaLabel={`Keranjang belanja (${totalQty} item)`}>
                  <ShoppingCart className="h-5 w-5" aria-hidden />
                  {totalQty > 0 && (
                    <Badge className="absolute -right-0.5 -top-0.5 h-5 min-w-5 rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {totalQty > 99 ? "99+" : totalQty}
                    </Badge>
                  )}
                </Link>
              </Button>
            </div>
          </div>

          {/* Search mobile */}
          {mobileSearchOpen && (
            <div className="pb-3 md:hidden">
              <SearchBox autoFocus />
            </div>
          )}
        </div>

        {/* Nav row desktop — mega menu + halaman (R3 poin 1) */}
        <nav className="hidden border-t md:block" aria-label="Navigasi utama">
          <div className="mx-auto flex max-w-7xl items-center gap-0.5 px-4 lg:px-8">
            <MegaMenu />
            <Separator orientation="vertical" className="mx-1.5 h-5" />
            <Link
              to="/katalog"
              className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground/90 transition-colors hover:bg-accent hover:text-foreground"
            >
              Katalog
            </Link>
            <Link
              to="/portofolio"
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/90 transition-colors hover:bg-accent hover:text-foreground"
            >
              Portofolio
            </Link>
            <Link
              to="/lacak-pesanan"
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/90 transition-colors hover:bg-accent hover:text-foreground"
            >
              Lacak Pesanan
            </Link>
            <Link
              to="/tentang"
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/90 transition-colors hover:bg-accent hover:text-foreground"
            >
              Tentang
            </Link>
            <a
              href="#kontak"
              onClick={scrollToKontak}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/90 transition-colors hover:bg-accent hover:text-foreground"
            >
              Kontak
            </a>
            <a
              href={quickChatUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#1eb757]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Chat WhatsApp
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

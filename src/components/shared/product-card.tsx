"use client";

import { Clock, Heart, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Img } from "@/components/shared/img";
import { AddToCartButton } from "@/components/shared/add-to-cart-button";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { useBriefStore } from "@/lib/brief-store";
import { useWishlistStore, useMounted } from "@/lib/cart-store";
import { BADGE_LABEL, formatIDR, type CatalogItem } from "@/lib/catalog";
import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";

const BADGE_STYLE: Record<string, string> = {
  terlaris: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  "best-value": "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  "paling-laris": "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  baru: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  "mulai-dari": "bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
};

interface ProductCardProps {
  item: CatalogItem;
  variant?: "full" | "compact";
  className?: string;
}

/** Kartu produk marketplace — dua varian (PRD §6.4). */
export function ProductCard({ item, variant = "full", className }: ProductCardProps) {
  const mounted = useMounted();
  const wishlistSlugs = useWishlistStore((s) => s.slugs);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlisted = mounted && wishlistSlugs.includes(item.slug);

  const href = `/produk/${item.slug}`;

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
        className
      )}
    >
      {/* Gambar + badge + wishlist */}
      <div className="relative">
        <Link to={href} ariaLabel={`Lihat detail ${item.name}`} className="block">
          <Img
            src={item.image}
            alt={item.name}
            ratio="4/3"
            className="transition-transform duration-300 group-hover:scale-[1.03]"
            imgClassName="group-hover:scale-[1.04] transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>
        {item.badge && (
          <Badge className={cn("absolute left-2 top-2 rounded-md px-2 py-0.5 text-[11px] font-bold", BADGE_STYLE[item.badge])}>
            {BADGE_LABEL[item.badge]}
          </Badge>
        )}
        <Button
          variant="secondary"
          size="icon"
          aria-label={wishlisted ? `Hapus ${item.name} dari wishlist` : `Tambah ${item.name} ke wishlist`}
          aria-pressed={wishlisted}
          className="absolute right-2 top-2 h-9 w-9 rounded-full bg-white/90 shadow-sm backdrop-blur hover:bg-white dark:bg-stone-900/90 dark:hover:bg-stone-900"
          onClick={(e) => {
            e.preventDefault();
            const nowOn = toggleWishlist(item.slug);
            if (nowOn) toastWishlist(true);
            else toastWishlist(false);
          }}
        >
          <Heart className={cn("h-4 w-4", wishlisted ? "fill-red-500 text-red-500" : "text-stone-600 dark:text-stone-300")} aria-hidden />
        </Button>
      </div>

      {/* Konten */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <Link to={href} className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {item.code} · {item.category === "website" ? "Website" : item.category === "retainer" ? "Langganan" : item.category === "addon" ? "Add-on" : item.category === "video" ? "Video" : "Desain"}
          </p>
          <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold leading-snug text-foreground group-hover:text-primary sm:text-[15px]">
            {item.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-baseline gap-1.5">
          {item.badge === "mulai-dari" && <span className="text-xs text-muted-foreground">Mulai</span>}
          <span className="text-base font-bold tabular-nums text-foreground sm:text-lg">
            {item.price === 0 ? "35% paket web" : formatIDR(item.price)}
          </span>
          <span className="text-[11px] text-muted-foreground">{item.unit}</span>
        </div>

        {variant === "full" && (
          <>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" aria-hidden />
                {item.duration}
              </span>
              <span className="inline-flex items-center gap-1">
                <RefreshCcw className="h-3 w-3" aria-hidden />
                {item.revisions}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{item.short}</p>
            <div className="mt-3 flex-1" />
            <div className="flex items-center gap-2">
              <AddToCartButton slug={item.slug} className="h-9 flex-1 text-xs sm:h-10 sm:text-sm" size="sm" />
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-10 shrink-0 border-emerald-300 p-0 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-900 dark:text-emerald-400 dark:hover:bg-emerald-950 sm:h-10 sm:w-11"
                aria-label={`Tanya cepat ${item.name} via WhatsApp`}
                title="Tanya cepat via WhatsApp"
                onClick={(e) => {
                  e.preventDefault();
                  useBriefStore.getState().show({ slug: item.slug });
                }}
              >
                <WhatsAppIcon className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Toast helper kecil agar tidak menambah dependensi di beberapa tempat
function toastWishlist(on: boolean) {
  import("sonner").then(({ toast }) => {
    if (on) toast.success("Ditambahkan ke wishlist");
    else toast.info("Dihapus dari wishlist");
  });
}

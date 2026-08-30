"use client";

import { House, LayoutGrid, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { useCartStore, useMounted } from "@/lib/cart-store";
import { Link } from "@/lib/router";
import { quickChatUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/**
 * Bottom navigation mobile (PRD §6.2) — 4 tombol:
 * Beranda, Katalog, Keranjang (badge), WhatsApp.
 * Safe-area iOS dihormati.
 */
export function BottomNav() {
  const mounted = useMounted();
  const items = useCartStore((s) => s.items);
  const totalQty = mounted ? items.reduce((n, i) => n + i.qty, 0) : 0;

  return (
    <nav
      aria-label="Navigasi bawah"
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid h-16 grid-cols-4">
        <NavTab to="/" icon={House} label="Beranda" />
        <NavTab to="/katalog" icon={LayoutGrid} label="Katalog" />
        <NavTab to="/keranjang" icon={ShoppingCart} label="Keranjang" badge={totalQty} />
        <a
          href={quickChatUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-[#25D366]"
        >
          <WhatsAppIcon className="h-5 w-5" />
          <span className="text-[11px] font-medium">WhatsApp</span>
        </a>
      </div>
    </nav>
  );
}

function NavTab({
  to,
  icon: Icon,
  label,
  badge,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: number;
}) {
  return (
    <Link
      to={to}
      className="relative flex min-h-11 flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary"
      ariaLabel={badge !== undefined ? `${label} (${badge} item)` : label}
    >
      <span className="relative">
        <Icon className="h-5 w-5" aria-hidden />
        {badge !== undefined && badge > 0 && (
          <Badge className="absolute -right-2.5 -top-2 h-4.5 min-w-4.5 rounded-full bg-primary px-1 text-[9px] font-bold leading-none text-primary-foreground">
            {badge > 99 ? "99+" : badge}
          </Badge>
        )}
      </span>
      <span className="text-[11px] font-medium">{label}</span>
    </Link>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

/** Hitung waktu menuju Senin 00.00 WIB berikutnya (reset mingguan PRD §11.2). */
export function nextMondayWIB(now = new Date()): number {
  const WIB_OFFSET = 7 * 3600 * 1000;
  const wib = new Date(now.getTime() + WIB_OFFSET);
  const day = wib.getUTCDay(); // 0=Minggu .. 1=Senin
  const daysUntilMonday = day === 1 ? 7 : (8 - day) % 7;
  const targetUtcMs = Date.UTC(wib.getUTCFullYear(), wib.getUTCMonth(), wib.getUTCDate() + daysUntilMonday, 0, 0, 0);
  return targetUtcMs - WIB_OFFSET;
}

function useCountdown() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, nextMondayWIB() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return remaining;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

interface CountdownProps {
  className?: string;
  variant?: "light" | "dark"; // dark = di dalam zona merah
}

/** Countdown mingguan (reset Senin 00.00 WIB) untuk Today's Deals. */
export function Countdown({ className, variant = "light" }: CountdownProps) {
  const remaining = useCountdown();

  if (remaining === null) {
    return <div className={cn("h-9 w-48 animate-pulse rounded-lg bg-stone-200/60", className)} aria-hidden />;
  }

  const d = Math.floor(remaining / 86400000);
  const h = Math.floor((remaining % 86400000) / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);

  const cell =
    variant === "dark"
      ? "bg-white/15 text-white backdrop-blur-sm"
      : "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300";
  const label = variant === "dark" ? "text-white/70" : "text-red-600/90 dark:text-red-300/80";

  return (
    <div className={cn("flex items-center gap-2", className)} role="timer" aria-label="Waktu tersisa promo minggu ini">
      <Flame className={cn("h-4 w-4", variant === "dark" ? "text-amber-300" : "text-red-600")} aria-hidden />
      <span className={cn("mr-1 text-xs font-semibold uppercase tracking-wide", label)}>Berakhir dalam</span>
      {d > 0 && (
        <div className="flex flex-col items-center">
          <span className={cn("min-w-8 rounded-md px-1.5 py-0.5 text-center text-sm font-bold tabular-nums", cell)}>
            {pad(d)}
          </span>
          <span className={cn("mt-0.5 text-[9px] font-medium", label)}>hari</span>
        </div>
      )}
      <div className="flex flex-col items-center">
        <span className={cn("min-w-8 rounded-md px-1.5 py-0.5 text-center text-sm font-bold tabular-nums", cell)}>
          {pad(h)}
        </span>
        <span className={cn("mt-0.5 text-[9px] font-medium", label)}>jam</span>
      </div>
      <div className="flex flex-col items-center">
        <span className={cn("min-w-8 rounded-md px-1.5 py-0.5 text-center text-sm font-bold tabular-nums", cell)}>
          {pad(m)}
        </span>
        <span className={cn("mt-0.5 text-[9px] font-medium", label)}>mnt</span>
      </div>
      <div className="flex flex-col items-center">
        <span className={cn("min-w-8 rounded-md px-1.5 py-0.5 text-center text-sm font-bold tabular-nums", cell)}>
          {pad(s)}
        </span>
        <span className={cn("mt-0.5 text-[9px] font-medium", label)}>dtk</span>
      </div>
    </div>
  );
}

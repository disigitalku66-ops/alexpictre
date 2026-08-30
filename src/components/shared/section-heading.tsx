"use client";

import { ChevronRight, Sparkles } from "lucide-react";
import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  href?: string; // jika ada → tampil tombol "Lihat semua"
  actionLabel?: string;
  icon?: boolean; // tampilkan sparkle kecil di depan judul
  className?: string;
  dark?: boolean; // untuk section berlatar gelap
}

/** Kepala seksi standar marketplace — judul + aksi "Lihat semua". */
export function SectionHeading({
  title,
  subtitle,
  href,
  actionLabel = "Lihat semua",
  icon = false,
  className,
  dark = false,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-4 flex items-end justify-between gap-4 sm:mb-6", className)}>
      <div className="min-w-0">
        <h2
          className={cn(
            "flex items-center gap-2 text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl",
            dark ? "text-stone-50" : "text-foreground"
          )}
        >
          {icon && <Sparkles className="h-5 w-5 shrink-0 text-primary" aria-hidden />}
          <span className="text-balance">{title}</span>
        </h2>
        {subtitle && (
          <p className={cn("mt-1 text-sm sm:text-base", dark ? "text-stone-400" : "text-muted-foreground")}>{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          to={href}
          className={cn(
            "group inline-flex shrink-0 items-center gap-1 text-sm font-semibold",
            dark ? "text-amber-400 hover:text-amber-300" : "text-primary hover:text-primary/80"
          )}
        >
          {actionLabel}
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}

"use client";

// ============================================================
// HASH ROUTER — SPA multi-halaman dalam satu route Next.js "/"
// (PRD v3.0 §5 — keputusan arsitektur D2)
// URL berbentuk #/katalog, #/produk/logo-starter, #/katalog?q=x
// ============================================================

import { useCallback, useEffect, useState } from "react";
import type { ReactNode, MouseEventHandler } from "react";
import { cn } from "@/lib/utils";

export interface RouteState {
  path: string; // "/katalog"
  query: URLSearchParams;
}

function parseHash(hash: string): RouteState {
  const raw = hash.replace(/^#/, "") || "/";
  const [path, query] = raw.split("?");
  return {
    path: path.startsWith("/") ? path : `/${path}`,
    query: new URLSearchParams(query || ""),
  };
}

/** Baca route saat ini; SSR-safe (default "/"). */
export function useHashRoute(): RouteState & { navigate: (to: string) => void } {
  const [state, setState] = useState<RouteState>({ path: "/", query: new URLSearchParams() });

  useEffect(() => {
    const sync = () => setState(parseHash(window.location.hash));
    sync(); // sinkronkan setelah mount (hindari hydration mismatch)
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const navigate = useCallback((to: string) => {
    const target = to.startsWith("#") ? to : `#${to.startsWith("/") ? to : `/${to}`}`;
    if (window.location.hash === target) return;
    window.location.hash = target;
  }, []);

  return { ...state, navigate };
}

/** Navigasi programatik dari luar komponen React. */
export function navigate(to: string) {
  const target = to.startsWith("#") ? to : `#${to.startsWith("/") ? to : `/${to}`}`;
  window.location.hash = target;
}

interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  ariaLabel?: string;
  title?: string;
}

/** Tautan internal SPA — <a href="#/..."> native (SEO & aksesibel). */
export function Link({ to, children, className, onClick, ariaLabel, title }: LinkProps) {
  const href = to.startsWith("#") ? to : `#${to.startsWith("/") ? to : `/${to}`}`;
  return (
    <a href={href} className={cn(className)} onClick={onClick} aria-label={ariaLabel} title={title}>
      {children}
    </a>
  );
}

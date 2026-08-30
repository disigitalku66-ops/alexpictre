"use client";

import { Clock, Mail, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { CATEGORIES } from "@/lib/catalog";
import { Link } from "@/lib/router";
import { SITE } from "@/lib/site";
import { quickChatUrl } from "@/lib/whatsapp";

const EXPLORE_LINKS = [
  { to: "/", label: "Beranda" },
  { to: "/katalog", label: "Katalog" },
  { to: "/langganan", label: "Paket Retainer" },
  { to: "/portofolio", label: "Portofolio" },
  { to: "/lacak-pesanan", label: "Lacak Pesanan" },
  { to: "/faq", label: "FAQ" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-stone-900 text-stone-300">
      {/* Strip kepercayaan */}
      <div className="border-b border-stone-800">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-6 sm:grid-cols-3 lg:px-8">
          {[
            { title: "Harga Transparan", desc: "Semua harga tampil jelas — tanpa biaya tersembunyi." },
            { title: "Garansi Deliverable", desc: "Setiap order disertai daftar hasil yang jelas." },
            { title: "Transaksi via WhatsApp", desc: "Checkout aman — data hanya dikirim ke WA resmi." },
          ].map((t) => (
            <div key={t.title} className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
              <div>
                <p className="text-sm font-semibold text-stone-100">{t.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-stone-400">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kolom utama */}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Kolom 1: brand */}
        <div className="col-span-2 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-lg font-extrabold">A</span>
            </span>
            <span className="text-xl font-extrabold tracking-tight text-stone-50">
              AlexPicture<span className="text-amber-400">.</span>
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-stone-400">
            {SITE.tagline} — harga transparan ala marketplace, kualitas & pelayanan ala agensi.
          </p>
          <div className="mt-4 space-y-2.5 text-sm">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden />
              <span>{SITE.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-amber-400" aria-hidden />
              {SITE.hours}
            </p>
          </div>
        </div>

        {/* Kolom 2: Jelajahi */}
        <nav aria-label="Tautan jelajahi">
          <h3 className="text-sm font-bold uppercase tracking-wide text-stone-100">Jelajahi</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {EXPLORE_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-stone-400 transition-colors hover:text-amber-400">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Kolom 3: Layanan */}
        <nav aria-label="Tautan layanan">
          <h3 className="text-sm font-bold uppercase tracking-wide text-stone-100">Layanan</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link to={`/katalog?kategori=${c.id}`} className="text-stone-400 transition-colors hover:text-amber-400">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Kolom 4: Kontak */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-stone-100">Hubungi Kami</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a
                href={quickChatUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-stone-400 transition-colors hover:text-amber-400"
              >
                <MessageCircle className="h-4 w-4 text-emerald-500" aria-hidden />
                {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 text-stone-400 transition-colors hover:text-amber-400">
                <Mail className="h-4 w-4 text-amber-400" aria-hidden />
                {SITE.email}
              </a>
            </li>
          </ul>
          <div className="mt-4 rounded-lg border border-stone-800 bg-stone-950/60 p-3">
            <p className="text-xs font-semibold text-stone-200">Pembayaran Transfer Bank</p>
            <p className="mt-1 text-xs leading-relaxed text-stone-400">
              {SITE.bank.name} · {SITE.bank.account}
              <br />
              a.n. {SITE.bank.holder}
            </p>
          </div>
        </div>
      </div>

      {/* Baris bawah */}
      <div className="border-t border-stone-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 pb-24 text-xs text-stone-500 sm:flex-row lg:px-8 md:pb-4">
          <p>© {new Date().getFullYear()} AlexPicture. Dibuat dengan standar industri di Cirebon.</p>
          <div className="flex items-center gap-4">
            <Link to="/kebijakan-privasi" className="transition-colors hover:text-amber-400">
              Kebijakan Privasi
            </Link>
            <Link to="/syarat-ketentuan" className="transition-colors hover:text-amber-400">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

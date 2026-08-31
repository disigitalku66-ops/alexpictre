"use client";

// ============================================================
// APP SHELL — SPA hash-routing dalam satu route Next.js "/" (PRD §5)
// Struktur: SiteHeader + <main> (view switch + transisi) +
// NewsletterStrip + SiteFooter + BottomNav (mobile).
// Footer sticky via min-h-screen flex flex-col + mt-auto.
// ============================================================

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PackageSearch } from "lucide-react";
import { BottomNav } from "@/components/layout/bottom-nav";
import { NewsletterStrip } from "@/components/layout/newsletter";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { QuickBriefSheet } from "@/components/shared/quick-brief-sheet";
import { AboutPage } from "@/components/pages/about-page";
import { CartPage } from "@/components/pages/cart-page";
import { CatalogPage } from "@/components/pages/catalog-page";
import { FaqPage } from "@/components/pages/faq-page";
import { HomePage } from "@/components/pages/home-page";
import { PortfolioPage } from "@/components/pages/portfolio-page";
import { PrivacyPage } from "@/components/pages/privacy-page";
import { ProductPage } from "@/components/pages/product-page";
import { RetainerPage } from "@/components/pages/retainer-page";
import { TermsPage } from "@/components/pages/terms-page";
import { ThankYouPage } from "@/components/pages/thankyou-page";
import { TrackOrderPage } from "@/components/pages/track-order-page";
import { Button } from "@/components/ui/button";
import { Link, useHashRoute } from "@/lib/router";

const META: Record<string, { title: string; description: string }> = {
  "/": {
    title: "AlexPicture — Desain, Website & Video untuk Bisnis",
    description:
      "Buat kebutuhan desain, website, landing page, dan video komersial bisnis Anda lebih siap digunakan. Pilih layanan, lihat hasilnya, lalu pesan sesuai kebutuhan.",
  },
  "/katalog": {
    title: "Katalog Layanan Kreatif",
    description: "Temukan layanan desain, video, website, add-on, dan paket bulanan dengan rincian layanan dan harga yang jelas.",
  },
  "/langganan": {
    title: "Paket Bulanan — Produksi Konten Rutin",
    description: "Paket produksi bulanan untuk kebutuhan desain dan video yang dikerjakan secara rutin tanpa perlu membangun tim sendiri.",
  },
  "/keranjang": {
    title: "Keranjang & Pesanan",
    description: "Periksa layanan yang Anda pilih, lengkapi brief, lalu lanjutkan pesanan melalui WhatsApp.",
  },
  "/portofolio": {
    title: "Portofolio AlexPicture",
    description: "Lihat contoh pekerjaan desain, video komersial, website, dan materi promosi AlexPicture.",
  },
  "/tentang": {
    title: "Tentang AlexPicture",
    description: "Kenali AlexPicture dan layanan kreatif yang kami sediakan untuk membantu kebutuhan bisnis Anda.",
  },
  "/faq": {
    title: "FAQ — Pertanyaan yang Sering Ditanyakan",
    description: "Jawaban tentang cara pesan, pembayaran, revisi, waktu pengerjaan, dan paket bulanan AlexPicture.",
  },
  "/kebijakan-privasi": {
    title: "Kebijakan Privasi",
    description: "Informasi tentang data yang diproses AlexPicture dan bagaimana data tersebut digunakan.",
  },
  "/syarat-ketentuan": {
    title: "Syarat & Ketentuan",
    description: "Ketentuan pemesanan, pembayaran, revisi, penggunaan aset, dan penyelesaian layanan AlexPicture.",
  },
  "/terima-kasih": {
    title: "Terima Kasih — Pesanan Diterima",
    description: "Pesanan Anda sudah dicatat. Simpan Order ID untuk memudahkan pengecekan pesanan.",
  },
  "/lacak-pesanan": {
    title: "Lacak Pesanan",
    description: "Periksa status pesanan menggunakan Order ID Anda.",
  },
};

export default function Page() {
  const { path } = useHashRoute();

  // Scroll ke atas saat pindah halaman (bukan saat query berubah)
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [path]);

  // Meta dinamis per view (tradeoff hash-routing — PRD §17.1)
  useEffect(() => {
    const meta = META[path];
    if (meta) {
      document.title = meta.title;
      const desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute("content", meta.description);
    }
  }, [path]);

  let view: React.ReactNode;
  if (path === "/") view = <HomePage />;
  else if (path === "/katalog") view = <CatalogPage />;
  else if (path.startsWith("/produk/")) {
    const slug = decodeURIComponent(path.replace("/produk/", ""));
    view = <ProductPage slug={slug} />;
  } else if (path === "/langganan") view = <RetainerPage />;
  else if (path === "/keranjang") view = <CartPage />;
  else if (path === "/terima-kasih") view = <ThankYouPage />;
  else if (path === "/lacak-pesanan") view = <TrackOrderPage />;
  else if (path === "/portofolio") view = <PortfolioPage />;
  else if (path === "/tentang") view = <AboutPage />;
  else if (path === "/faq") view = <FaqPage />;
  else if (path === "/kebijakan-privasi") view = <PrivacyPage />;
  else if (path === "/syarat-ketentuan") view = <TermsPage />;
  else
    view = (
      <section className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-24 text-center lg:px-8">
        <PackageSearch className="h-12 w-12 text-primary" aria-hidden />
        <h1 className="text-2xl font-bold">Halaman tidak ditemukan</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Halaman yang Anda cari tidak tersedia. Kembali ke beranda atau lihat katalog layanan.
        </p>
        <div className="mt-2 flex gap-3">
          <Button asChild>
            <Link to="/">Ke Beranda</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/katalog">Lihat Katalog</Link>
          </Button>
        </div>
      </section>
    );

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pb-20 md:pb-0" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={path}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {view}
          </motion.div>
        </AnimatePresence>
      </main>
      <NewsletterStrip />
      <SiteFooter />
      <BottomNav />
      <QuickBriefSheet />
    </div>
  );
}

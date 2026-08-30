"use client";

import { motion } from "framer-motion";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import type { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SITE } from "@/lib/site";
import { Link } from "@/lib/router";
import { quickChatUrl } from "@/lib/whatsapp";

// ============================================================
// HALAMAN FAQ (#/faq) — 10 pertanyaan umum + JSON-LD FAQPage
// (PRD v3.0 §6.7). Konten jawaban dipakai bersama oleh
// accordion UI dan structured data (schema.org).
// ============================================================

interface FaqEntry {
  q: string;
  a: string;
  link?: { label: string; to: string };
}

const FAQS: FaqEntry[] = [
  {
    q: "Bagaimana cara memesan layanan?",
    a: "Pilih layanan yang Anda butuhkan di katalog, tambahkan ke keranjang, isi brief singkat, lalu checkout via WhatsApp. Tim kami akan membalas pesan Anda untuk konfirmasi detail pesanan.",
  },
  {
    q: "Metode pembayaran apa saja yang tersedia?",
    a: `Pembayaran dilakukan melalui transfer ${SITE.bank.name} a.n. ${SITE.bank.holder}. Detail rekening dikirim bersama invoice setelah deal. Umumnya berlaku pembayaran DP terlebih dahulu, kemudian pelunasan.`,
  },
  {
    q: "Berapa kali revisi yang saya dapat?",
    a: "Tergantung layanannya — umumnya 2x revisi, layanan Logo Starter mendapat 3x, dan paket retainer hingga tak terbatas sesuai ketentuan paket. Rincian revisi tertera pada setiap halaman produk.",
  },
  {
    q: "Berapa lama pengerjaan layanan?",
    a: "Estimasi pengerjaan tertera pada setiap layanan, mulai dari 1 hari hingga 1 minggu. Butuh lebih cepat? Chat kami untuk membahas opsi prioritas.",
  },
  {
    q: "Format file apa yang saya terima?",
    a: "JPG, PNG, PDF, SVG, MP4, atau sitemap sesuai jenis layanan. File editable (Canva/GitHub) juga tersedia untuk layanan tertentu.",
  },
  {
    q: "Bagaimana sistem kontrak retainer?",
    a: "Kontrak minimal 3 bulan untuk paket Starter dan Growth, atau 6 bulan untuk paket Pro, dengan invoice bulanan. Anda dapat berhenti saat masa kontrak berakhir.",
  },
  {
    q: "Apakah bisa refund?",
    a: "Untuk layanan digital, refund dihitung pro-rata atas pekerjaan yang belum dikerjakan. Detail lengkapnya dapat dilihat di halaman",
    link: { label: "Syarat & Ketentuan", to: "/syarat-ketentuan" },
  },
  {
    q: "Bisa request kebutuhan custom di luar katalog?",
    a: "Bisa. Layanan Custom App dimulai dari workshop discovery untuk memetakan kebutuhan Anda. Untuk kebutuhan unik lainnya, silakan chat langsung dengan tim kami.",
  },
  {
    q: "Apakah brief saya dirahasiakan?",
    a: "Ya. Brief hanya kami gunakan untuk memproses pesanan Anda dan tidak dibagikan kepada pihak ketiga mana pun.",
  },
  {
    q: "Bagaimana cara pengiriman aset final?",
    a: "Aset final dikirim melalui WhatsApp atau email dalam bentuk tautan unduhan (Google Drive), disertai file langsung bila ukurannya memungkinkan.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.link ? `${f.a} ${f.link.label}.` : f.a,
    },
  })),
};

function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.28, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

export function FaqPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-10 lg:px-8">
      {/* JSON-LD FAQPage untuk rich result (schema.org) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-3xl">
        {/* ===== HEADER ===== */}
        <header>
          <FadeIn>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Pusat Bantuan</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Pertanyaan Umum
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Jawaban atas pertanyaan yang paling sering ditanyakan sebelum memesan — mulai dari cara
              order, pembayaran, revisi, hingga kontrak retainer.
            </p>
          </FadeIn>
        </header>

        {/* ===== ACCORDION 10 Q&A ===== */}
        <section aria-label="Daftar pertanyaan umum" className="mt-8">
          <FadeIn delay={0.06}>
            <Card className="shadow-sm">
              <Accordion type="single" collapsible defaultValue="faq-0" className="px-4 sm:px-6">
                {FAQS.map((f, i) => (
                  <AccordionItem key={f.q} value={`faq-${i}`}>
                    <AccordionTrigger className="py-4 text-left text-sm font-semibold hover:no-underline sm:text-base">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {f.a}{" "}
                      {f.link && (
                        <Link
                          to={f.link.to}
                          className="font-semibold text-primary underline-offset-4 hover:underline"
                        >
                          {f.link.label}
                        </Link>
                      )}
                      {f.link && "."}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </FadeIn>
        </section>

        {/* ===== CTA ===== */}
        <section aria-labelledby="faq-cta-title" className="mt-10">
          <FadeIn>
            <Card className="border-primary/30 bg-primary/5 shadow-sm">
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <h2 id="faq-cta-title" className="text-lg font-bold text-foreground">
                  Masih ada pertanyaan?
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                  Tanyakan langsung ke tim kami — dibalas pada jam operasional {SITE.hoursShort}.
                </p>
                <Button
                  asChild
                  className="h-11 bg-[#25D366] px-5 text-white hover:bg-[#1eb757]"
                >
                  <a
                    href={quickChatUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Tanyakan pertanyaan Anda melalui WhatsApp"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Tanya via WhatsApp
                  </a>
                </Button>
              </CardContent>
            </Card>
          </FadeIn>
        </section>
      </div>
    </div>
  );
}

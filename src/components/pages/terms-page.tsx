"use client";

import { motion } from "framer-motion";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/lib/router";
import { SITE } from "@/lib/site";
import { quickChatUrl } from "@/lib/whatsapp";

// ============================================================
// SYARAT & KETENTUAN (#/syarat-ketentuan) — halaman legal
// tunduk hukum Republik Indonesia. Format legal max-w-3xl.
// ============================================================

interface LegalBlock {
  title: string;
  paragraphs?: ReactNode[];
  bullets?: ReactNode[];
}

const TERMS_SECTIONS: LegalBlock[] = [
  {
    title: "Ketentuan Umum",
    paragraphs: [
      <>
        Dengan mengakses atau menggunakan situs {SITE.fullName} serta layanan AlexPicture, Anda
        menyatakan telah membaca, memahami, dan menyetujui Syarat &amp; Ketentuan ini. Apabila Anda
        tidak menyetujui sebagian atau seluruh ketentuan, mohon untuk tidak menggunakan layanan kami.
      </>,
    ],
  },
  {
    title: "Pemesanan & Proses",
    paragraphs: [
      <>
        Pesanan yang dibuat melalui website berfungsi sebagai lead atau permintaan penawaran.
        Kesepakatan final — mencakup lingkup pekerjaan, harga, dan jadwal — terjadi melalui
        konfirmasi di WhatsApp bersama tim kami.
      </>,
      <>
        Setiap pesanan yang telah dikonfirmasi menerima <strong className="text-foreground">Order ID</strong>{" "}
        yang menjadi referensi tunggal untuk komunikasi, pembayaran, dan pengerjaan.
      </>,
    ],
  },
  {
    title: "Pembayaran",
    bullets: [
      <>Down payment (DP) umumnya sebesar 50% untuk proyek bernilai di atas Rp 500.000.</>,
      <>Pelunasan dilakukan sebelum serah terima aset final.</>,
      <>
        Pembayaran melalui transfer {SITE.bank.name} a.n. {SITE.bank.holder}; detail rekening
        dikirim bersama invoice.
      </>,
      <>Bukti transfer wajib dikonfirmasi kepada tim kami agar pesanan mulai atau lanjut dikerjakan.</>,
    ],
  },
  {
    title: "Pengerjaan & Revisi",
    paragraphs: [
      <>
        Estimasi pengerjaan dihitung sejak brief lengkap diterima dan DP dibayarkan. Revisi mengikuti
        kuota masing-masing layanan sebagaimana tertera pada halaman produk. Permintaan revisi di luar
        scope awal — misalnya perubahan konsep atau penambahan deliverable — dihitung dan ditagih
        terpisah.
      </>,
    ],
  },
  {
    title: "Lisensi Aset",
    paragraphs: [
      <>
        Aset final menjadi milik penuh klien setelah pelunasan dilakukan. AlexPicture tetap berhak
        menampilkan hasil karya sebagai portofolio, kecuali klien secara eksplisit meminta
        perjanjian kerahasiaan (NDA).
      </>,
    ],
  },
  {
    title: "Pembatalan & Refund",
    bullets: [
      <>Pembatalan dapat dilakukan kapan saja sebelum atau selama pengerjaan.</>,
      <>Refund dihitung pro-rata atas pekerjaan yang belum dikerjakan.</>,
      <>DP dikurangkan dengan nilai pekerjaan yang telah berjalan.</>,
      <>Barang digital yang telah diserahkan tidak dapat dikembalikan.</>,
    ],
  },
  {
    title: "Keterlambatan Klien",
    paragraphs: [
      <>
        Deadline pengerjaan bergeser secara otomatis apabila aset pendukung, balasan brief, atau
        konfirmasi dari klien diterima melewati jadwal yang telah disepakati.
      </>,
    ],
  },
  {
    title: "Force Majeure",
    paragraphs: [
      <>
        Kami tidak bertanggung jawab atas keterlambatan atau kegagalan pemenuhan layanan yang
        disebabkan oleh keadaan kahar (force majeure) — termasuk namun tidak terbatas pada bencana
        alam, gangguan jaringan atau listrik berkepanjangan, kerusuhan, dan kebijakan pemerintah.
        Dalam kondisi tersebut, kami akan menginformasikan perkembangan serta alternatif solusinya.
      </>,
    ],
  },
  {
    title: "Perubahan Layanan & Harga",
    paragraphs: [
      <>
        Jenis layanan, spesifikasi, dan harga dapat berubah sewaktu-waktu tanpa pemberitahuan
        sebelumnya. Harga yang mengikat transaksi Anda adalah harga yang tertera pada saat pesanan
        dibuat.
      </>,
    ],
  },
  {
    title: "Hukum yang Berlaku & Penyelesaian Sengketa",
    paragraphs: [
      <>
        Syarat &amp; Ketentuan ini tunduk pada dan ditafsirkan sesuai hukum Republik Indonesia.
        Segala sengketa yang timbul akan diupayakan penyelesaiannya terlebih dahulu melalui
        musyawarah untuk mufakat; apabila tidak tercapai, penyelesaian dilakukan melalui jalur hukum
        yang berlaku.
      </>,
    ],
  },
];

export function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10 lg:px-8">
      {/* ===== HEADER ===== */}
      <header>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Legal</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Syarat &amp; Ketentuan
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {SITE.fullName} · Berlaku efektif sejak tahun 2026
          </p>
        </motion.div>
      </header>

      {/* ===== ISI ===== */}
      <article className="mt-8 space-y-8">
        {TERMS_SECTIONS.map((block, i) => (
          <motion.section
            key={block.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            aria-labelledby={`terms-section-${i}`}
          >
            <h2 id={`terms-section-${i}`} className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
              {i + 1}. {block.title}
            </h2>
            {block.paragraphs?.map((p, idx) => (
              <p key={idx} className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {p}
              </p>
            ))}
            {block.bullets && (
              <ul className="mt-3 space-y-2">
                {block.bullets.map((b, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground sm:text-base"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.section>
        ))}
      </article>

      {/* ===== FOOTER LINK ===== */}
      <motion.footer
        className="mt-10"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        <Card className="border-primary/30 bg-primary/5 shadow-sm">
          <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold text-foreground">Dokumen &amp; kontak terkait</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Baca juga{" "}
                <Link
                  to="/kebijakan-privasi"
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Kebijakan Privasi
                </Link>{" "}
                kami.
              </p>
            </div>
            <Button
              asChild
              className="h-10 bg-[#25D366] px-5 text-white hover:bg-[#1eb757]"
            >
              <a
                href={quickChatUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Hubungi AlexPicture melalui WhatsApp"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Hubungi Kami
              </a>
            </Button>
          </CardContent>
        </Card>
      </motion.footer>
    </div>
  );
}

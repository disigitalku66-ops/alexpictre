"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/lib/router";
import { SITE } from "@/lib/site";
import { quickChatUrl } from "@/lib/whatsapp";

// ============================================================
// KEBIJAKAN PRIVASI (#/kebijakan-privasi) — halaman legal
// selaras UU No. 27 Tahun 2022 (PDP). Format legal max-w-3xl.
// ============================================================

interface LegalBlock {
  title: string;
  paragraphs?: ReactNode[];
  bullets?: ReactNode[];
}

const PRIVACY_SECTIONS: LegalBlock[] = [
  {
    title: "Pendahuluan",
    paragraphs: [
      <>
        {SITE.fullName} ("AlexPicture", "kami") berkomitmen melindungi privasi setiap pengunjung dan
        klien. Kebijakan Privasi ini menjelaskan data apa yang kami proses, untuk tujuan apa, serta
        bagaimana Anda dapat mengendalikannya.
      </>,
      <>Kebijakan ini berlaku efektif sejak tahun 2026 dan mencakup seluruh fitur situs, termasuk katalog, keranjang, checkout, serta pelacakan pesanan.</>,
      <>
        Pengendali data pribadi: <strong className="text-foreground">AlexPicture</strong>,{" "}
        {SITE.address}.
      </>,
    ],
  },
  {
    title: "Data yang Kami Proses",
    bullets: [
      <>
        <strong className="text-foreground">Nama lengkap dan nama brand</strong> — hanya diminta saat
        Anda mengisi form checkout.
      </>,
      <>
        <strong className="text-foreground">Catatan brief pesanan</strong> — teks yang Anda tuliskan
        untuk menjelaskan kebutuhan kreatif Anda.
      </>,
      <>
        <strong className="text-foreground">Data teknis umum</strong> — misalnya jenis browser dan
        halaman yang dikunjungi, dalam bentuk statistik agregat tanpa identitas individu.
      </>,
    ],
  },
  {
    title: "Tujuan Pemrosesan",
    bullets: [
      <>Memproses dan menindaklanjuti pesanan layanan yang Anda buat.</>,
      <>Berkomunikasi dengan Anda terkait pesanan melalui WhatsApp.</>,
      <>Meningkatkan kualitas layanan, keamanan situs, dan konten informasi kami.</>,
    ],
  },
  {
    title: "Dasar Hukum",
    paragraphs: [
      <>
        Kami memproses data pribadi berdasarkan persetujuan Anda serta pelaksanaan kontrak
        (pemenuhan pesanan layanan), sebagaimana diatur dalam Undang-Undang Nomor 27 Tahun 2022
        tentang Pelindungan Data Pribadi (UU PDP). Dengan mengisi form checkout, Anda menyetujui
        pemrosesan data sebatas keperluan tersebut.
      </>,
    ],
  },
  {
    title: "Penyimpanan Lokal di Perangkat Anda",
    paragraphs: [
      <>
        Keranjang belanja, wishlist, dan riwayat pesanan Anda tersimpan di penyimpanan lokal
        (localStorage) pada perangkat Anda sendiri — bukan di server kami. Data tersebut bersifat
        non-sensitif dan berfungsi mempermudah penggunaan situs.
      </>,
    ],
    bullets: [
      <>Kosongkan keranjang melalui halaman Keranjang.</>,
      <>Hapus entri riwayat pesanan dari perangkat Anda.</>,
      <>Bersihkan data situs melalui menu pengaturan browser (clear browsing data).</>,
    ],
  },
  {
    title: "Berbagi Data",
    paragraphs: [
      <>
        Kami tidak menjual, menyewakan, atau memperdagangkan data pribadi Anda kepada pihak mana pun.
        Data yang Anda kirimkan melalui form checkout hanya diteruskan ke WhatsApp resmi AlexPicture
        semata, sebagai bagian dari proses konfirmasi pesanan.
      </>,
    ],
  },
  {
    title: "Cookie & Analytics",
    paragraphs: [
      <>
        Situs ini menggunakan cookie teknis agar fitur dasar dapat berjalan dengan baik. Statistik
        kunjungan kami amati dalam bentuk agregat — misalnya jumlah kunjungan per halaman — tanpa
        pelacakan individu lintas situs.
      </>,
    ],
  },
  {
    title: "Hak Anda",
    paragraphs: [
      <>Sesuai UU PDP, Anda berhak untuk:</>,
    ],
    bullets: [
      <>Mengakses data pribadi Anda yang kami proses.</>,
      <>Meminta koreksi atas data yang tidak akurat.</>,
      <>Meminta penghapusan data pribadi Anda.</>,
      <>Menarik persetujuan pemrosesan data kapan saja.</>,
    ],
  },
  {
    title: "Keamanan",
    paragraphs: [
      <>
        Situs dilayani melalui koneksi terenkripsi (HTTPS) dan akses terhadap data pesanan dibatasi
        hanya kepada tim yang memproses pesanan. Kami menyimpan data selama diperlukan untuk
        pemenuhan pesanan dan kewajiban administratif, kemudian menghapusnya.
      </>,
    ],
  },
  {
    title: "Perubahan Kebijakan & Kontak",
    paragraphs: [
      <>
        Kebijakan Privasi ini dapat kami perbarui dari waktu ke waktu; versi terbaru selalu tersedia
        di halaman ini. Untuk pertanyaan seputar privasi atau permintaan terkait data pribadi Anda,
        hubungi kami melalui email{" "}
        <a
          href={`mailto:${SITE.email}`}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {SITE.email}
        </a>{" "}
        atau WhatsApp{" "}
        <a
          href={quickChatUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {SITE.phoneDisplay}
        </a>
        . Permintaan Anda kami tanggapi maksimal 14 hari kerja.
      </>,
    ],
  },
];

export function PrivacyPage() {
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
            Kebijakan Privasi
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {SITE.fullName} · Berlaku efektif sejak tahun 2026
          </p>
        </motion.div>
      </header>

      {/* ===== ISI ===== */}
      <article className="mt-8 space-y-8">
        {PRIVACY_SECTIONS.map((block, i) => (
          <motion.section
            key={block.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            aria-labelledby={`privacy-section-${i}`}
          >
            <h2 id={`privacy-section-${i}`} className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
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

      {/* ===== CTA KECIL ===== */}
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
                  to="/syarat-ketentuan"
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Syarat &amp; Ketentuan
                </Link>{" "}
                kami.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" className="h-10">
                <a href={`mailto:${SITE.email}`} aria-label={`Kirim email ke ${SITE.email}`}>
                  <Mail className="h-4 w-4" aria-hidden />
                  Email
                </a>
              </Button>
              <Button
                asChild
                className="h-10 bg-[#25D366] text-white hover:bg-[#1eb757]"
              >
                <a
                  href={quickChatUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Hubungi AlexPicture melalui WhatsApp"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.footer>
    </div>
  );
}

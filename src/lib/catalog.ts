// ============================================================
// ALEXPICTURE MARKETPLACE — MASTER DATA KATALOG
// Single Source of Truth (PRD v3.0 §7) — JANGAN mengubah harga
// tanpa persetujuan dokumen bisnis resmi.
// Modul ini murni data (tanpa dependensi React) sehingga aman
// dipakai bersama oleh komponen klien DAN API route (server-side
// pricing, anti-tampering).
// ============================================================

export type CategoryId = "desain" | "video" | "website" | "addon" | "retainer";
export type ItemType = "unit" | "website" | "addon" | "plan";
export type BadgeId = "terlaris" | "best-value" | "baru" | "mulai-dari" | "paling-laris";

export interface Category {
  id: CategoryId;
  name: string;
  short: string;
  blurb: string;
  icon: string; // nama ikon Lucide (dipetakan di komponen)
  image: string;
}

export interface CatalogItem {
  slug: string;
  code: string; // A1..A9, B1..B5, C1..C6, D1..D6, E1..E3
  name: string;
  category: CategoryId;
  type: ItemType;
  price: number; // Rupiah; 0 untuk multi-bahasa (dinamis 35%)
  unit: string; // satuan: "per foto", "per slide", dst.
  short: string; // deskripsi singkat kartu produk
  description: string; // deskripsi panjang PDP
  deliverables: string[];
  revisions: string;
  duration: string;
  fileFormats: string;
  badge?: BadgeId;
  minQty: number;
  maxQty: number;
  image: string;
  gallery: string[];
  keywords: string[];
}

export const BADGE_LABEL: Record<BadgeId, string> = {
  terlaris: "Terlaris",
  "best-value": "Best Value",
  baru: "Baru",
  "mulai-dari": "Mulai dari",
  "paling-laris": "Paling Laris",
};

export const CATEGORIES: Category[] = [
  {
    id: "desain",
    name: "Desain & Branding",
    short: "Desain",
    blurb: "Feed IG, carousel, poster, logo, foto produk, materi iklan — siap pakai.",
    icon: "Palette",
    image: "/images/cat-desain.png",
  },
  {
    id: "video",
    name: "Video Komersial",
    short: "Video",
    blurb: "UGC, TV ad, company profile — produksi cepat standar industri.",
    icon: "Clapperboard",
    image: "/images/cat-video.png",
  },
  {
    id: "website",
    name: "Website & Web Apps",
    short: "Website",
    blurb: "Landing page full-stack, e-commerce, custom app bergaransi.",
    icon: "Globe",
    image: "/images/cat-web.png",
  },
  {
    id: "addon",
    name: "Add-on",
    short: "Add-on",
    blurb: "Copywriting, maintenance, migrasi, multi-bahasa.",
    icon: "Puzzle",
    image: "/images/cat-addon.png",
  },
  {
    id: "retainer",
    name: "Paket Bulanan",
    short: "Langganan",
    blurb: "Kuota produksi konten bulanan — tanpa rekrut tim in-house.",
    icon: "Crown",
    image: "/images/cat-langganan.png",
  },
];

const IMG = {
  feed: "/images/mockup-feed.png",
  carousel: "/images/mockup-carousel.png",
  story: "/images/mockup-story.png",
  poster: "/images/mockup-poster.png",
  logo: "/images/mockup-logo.png",
  menu: "/images/mockup-menu.png",
  video: "/images/mockup-video.png",
  webLaptop: "/images/mockup-web-laptop.png",
  ecommerce: "/images/mockup-ecommerce.png",
  portCompany: "/images/port-company.png",
  portUgc: "/images/port-ugc.png",
  foto: "/images/mockup-foto.png",
  iklan: "/images/mockup-iklan.png",
  banner: "/images/mockup-banner.png",
  app: "/images/mockup-app.png",
  catDesain: "/images/cat-desain.png",
  catVideo: "/images/cat-video.png",
  catWeb: "/images/cat-web.png",
  catAddon: "/images/cat-addon.png",
  catRetainer: "/images/cat-langganan.png",
};

export const CATALOG: CatalogItem[] = [
  // ============ A. DESAIN GRAFIS & ASET VISUAL ============
  {
    slug: "foto-produk",
    code: "A1",
    name: "Foto Produk",
    category: "desain",
    type: "unit",
    price: 10000,
    unit: "per foto",
    short: "Foto produk profesional siap marketplace & katalog digital.",
    description:
      "Foto produk bersih dan menarik yang meningkatkan kepercayaan pembeli di marketplace dan katalog digital anda. Setiap foto melewati retouching dasar agar warna, tekstur, dan detail produk tampil maksimal — siap dipakai untuk Tokopedia, Shopee, Instagram, maupun materi cetak.",
    deliverables: [
      "1 foto siap pakai (hasil edit premium)",
      "Background bersih / sesuai brief",
      "File JPG resolusi tinggi",
      "Retouch dasar warna & pencahayaan",
    ],
    revisions: "2x revisi",
    duration: "1 hari kerja",
    fileFormats: "JPG (resolusi tinggi)",
    minQty: 1,
    maxQty: 99,
    image: IMG.foto,
    gallery: [IMG.foto, IMG.catDesain],
    keywords: ["foto", "produk", "product", "fotografi", "katalog", "marketplace", "ecommerce"],
  },
  {
    slug: "desain-feed-instagram",
    code: "A2",
    name: "Desain Feed Instagram",
    category: "desain",
    type: "unit",
    price: 10000,
    unit: "per slide",
    short: "Slide feed estetik & konsisten dengan identitas brand.",
    description:
      "Desain feed Instagram yang estetik, konsisten, dan selaras dengan identitas visual brand anda. Cocok untuk feed harian, konten edukasi, promo, hingga personal branding — dengan komposisi, tipografi, dan palet warna profesional.",
    deliverables: ["1 slide statis siap posting", "Template warna & gaya konsisten brand", "File JPG/PNG resolusi tinggi"],
    revisions: "2x revisi",
    duration: "1 hari kerja",
    fileFormats: "JPG / PNG (1080×1350 atau 1080×1080)",
    badge: "terlaris",
    minQty: 1,
    maxQty: 99,
    image: IMG.feed,
    gallery: [IMG.feed, IMG.catDesain],
    keywords: ["feed", "instagram", "ig", "desain", "konten", "sosmed", "social media"],
  },
  {
    slug: "feed-instagram-carousel",
    code: "A3",
    name: "Feed Instagram Carousel",
    category: "desain",
    type: "unit",
    price: 20000,
    unit: "per set (6 slide)",
    short: "Set 6 slide konsisten + caption siap posting.",
    description:
      "Carousel adalah format dengan engagement tertinggi di Instagram. Paket ini mencakup 6 slide yang saling terhubung dengan alur cerita (hook → isi → CTA) plus copywriting caption siap posting — tinggal schedule dan publish.",
    deliverables: ["6 slide desain konsisten dalam satu alur cerita", "Copywriting caption siap posting", "File JPG/PNG resolusi tinggi"],
    revisions: "2x revisi",
    duration: "1 hari kerja",
    fileFormats: "JPG / PNG (1080×1350)",
    badge: "terlaris",
    minQty: 1,
    maxQty: 20,
    image: IMG.carousel,
    gallery: [IMG.carousel, IMG.feed],
    keywords: ["carousel", "feed", "instagram", "slider", "konten", "caption", "ig"],
  },
  {
    slug: "story-reels-cover",
    code: "A4",
    name: "Desain Story & Reels Cover",
    category: "desain",
    type: "unit",
    price: 20000,
    unit: "per desain",
    short: "Desain 1080×1920 penuh daya tarik untuk story & cover reels.",
    description:
      "Desain story dan cover reels format vertikal 1080×1920 px yang berhenti di-scroll. Gunakan untuk highlight cerita, promo 24 jam, atau cover reels yang bikin penasaran — dilengkapi komposisi visual yang kuat dan CTA jelas.",
    deliverables: ["1 desain 1080×1920 px", "Varian dengan & tanpa teks (bila relevan)", "File JPG/PNG resolusi tinggi"],
    revisions: "2x revisi",
    duration: "1 hari kerja",
    fileFormats: "JPG / PNG (1080×1920)",
    minQty: 1,
    maxQty: 99,
    image: IMG.story,
    gallery: [IMG.story, IMG.catDesain],
    keywords: ["story", "reels", "cover", "instagram", "vertikal", "highlight"],
  },
  {
    slug: "materi-iklan-meta",
    code: "A5",
    name: "Materi Iklan Meta Ads",
    category: "desain",
    type: "unit",
    price: 50000,
    unit: "per set",
    short: "3 varian visual + 3 headline siap A/B testing FB/IG Ads.",
    description:
      "Set materi iklan Facebook & Instagram Ads yang dirancang untuk performa: 3 varian visual dengan angle berbeda plus 3 varian headline untuk A/B testing. Dilengkapi spesifikasi teknis sesuai ketentuan Meta Ads agar iklan langsung tayang tanpa revisi berulang.",
    deliverables: ["3 varian visual iklan (angle berbeda)", "3 varian headline untuk A/B testing", "File sesuai spesifikasi Meta Ads"],
    revisions: "2x revisi",
    duration: "2–3 hari kerja",
    fileFormats: "JPG / PNG (1:1 dan 4:5)",
    badge: "best-value",
    minQty: 1,
    maxQty: 20,
    image: IMG.iklan,
    gallery: [IMG.iklan, IMG.catDesain],
    keywords: ["iklan", "meta", "ads", "facebook", "instagram", "adv", "promosi", "ab testing"],
  },
  {
    slug: "poster-flyer-promo",
    code: "A6",
    name: "Poster / Flyer Promo",
    category: "desain",
    type: "unit",
    price: 15000,
    unit: "per desain",
    short: "A4 siap cetak CMYK 300 DPI + versi digital + file Canva.",
    description:
      "Poster dan flyer promo dengan standar cetak profesional: CMYK 300 DPI dengan bleed 3 mm agar hasil cetak presisi tanpa area terpotong. Termasuk versi PNG untuk kebutuhan digital dan sumber editable di Canva agar anda bisa update harga sendiri kapan pun.",
    deliverables: ["A4 siap cetak (CMYK 300 DPI, bleed 3 mm)", "Versi digital PNG", "Sumber editable Canva"],
    revisions: "2x revisi",
    duration: "1 hari kerja",
    fileFormats: "PDF cetak + PNG + Canva",
    minQty: 1,
    maxQty: 99,
    image: IMG.poster,
    gallery: [IMG.poster, IMG.catDesain],
    keywords: ["poster", "flyer", "cetak", "print", "promo", "umkm", "cmyk", "canva"],
  },
  {
    slug: "banner-spanduk",
    code: "A7",
    name: "Banner / Spanduk",
    category: "desain",
    type: "unit",
    price: 20000,
    unit: "per desain",
    short: "Desain banner ukuran custom siap digital printing + Canva.",
    description:
      "Desain banner dan spanduk dengan ukuran custom sesuai kebutuhan — grand opening, promo, event, hingga backdrop panggung. Dibuat dengan resolusi tepat untuk digital printing agar teks tetap tajam dari jarak jauh, plus sumber editable Canva.",
    deliverables: ["1 desain ukuran custom siap cetak", "File resolusi digital printing", "Versi PNG + sumber editable Canva"],
    revisions: "2x revisi",
    duration: "1 hari kerja",
    fileFormats: "PDF / JPG + PNG + Canva",
    minQty: 1,
    maxQty: 99,
    image: IMG.banner,
    gallery: [IMG.banner, IMG.catDesain],
    keywords: ["banner", "spanduk", "baliho", "cetak", "grand opening", "event", "promo"],
  },
  {
    slug: "logo-starter",
    code: "A8",
    name: "Logo Starter",
    category: "desain",
    type: "unit",
    price: 20000,
    unit: "per logo",
    short: "Logo profesional 3 format + 3 varian + 3x revisi.",
    description:
      "Logo adalah wajah pertama bisnis anda. Paket Logo Starter menghasilkan 1 konsep logo final dalam 3 format file (PNG, SVG, PDF) dengan 3 varian layout (horizontal, vertikal, monokrom) — siap dipakai di semua media dari profil Instagram hingga papan nama toko.",
    deliverables: [
      "1 konsep logo final",
      "3 format file: PNG, SVG, PDF",
      "3 varian: horizontal, vertikal, monokrom",
      "Panduan pemakaian singkat",
    ],
    revisions: "3x revisi",
    duration: "4–5 hari kerja",
    fileFormats: "PNG + SVG + PDF",
    minQty: 1,
    maxQty: 5,
    image: IMG.logo,
    gallery: [IMG.logo, IMG.catDesain],
    keywords: ["logo", "branding", "identitas", "brand", "maskot", "monogram"],
  },
  {
    slug: "menu-katalog-digital",
    code: "A9",
    name: "Menu / Katalog Digital",
    category: "desain",
    type: "unit",
    price: 25000,
    unit: "per halaman",
    short: "Layout menu resto & katalog produk yang bikin lapar mata.",
    description:
      "Desain menu restoran dan katalog produk dengan layout profesional yang memandu mata pembeli ke produk dengan margin terbaik. Komposisi foto, harga, dan deskripsi disusun strategis untuk menaikkan average order — per halaman.",
    deliverables: ["1 halaman menu/katalog digital", "Layout foto + harga + deskripsi", "File PDF & JPG siap cetak/digital"],
    revisions: "2x revisi",
    duration: "1 hari kerja",
    fileFormats: "PDF + JPG",
    minQty: 1,
    maxQty: 30,
    image: IMG.menu,
    gallery: [IMG.menu, IMG.catDesain],
    keywords: ["menu", "katalog", "resto", "restoran", "kafe", "harga", "produk"],
  },

  // ============ B. VIDEO KOMERSIAL & PRODUKSI ============
  {
    slug: "video-ugc-20",
    code: "B1",
    name: "Video UGC 20 Detik",
    category: "video",
    type: "unit",
    price: 25000,
    unit: "per video",
    short: "Video pendek gaya UGC 20 detik — organic & relatable.",
    description:
      "Video pendek bergaya UGC (User Generated Content) 20 detik yang terasa organic dan relatable — format dengan performa tertinggi untuk pemasaran produk di TikTok dan Reels. Ditulis, digambar, dan diedit dengan hook kuat di 3 detik pertama.",
    deliverables: ["1 video 20 detik siap posting", "Hook 3 detik pertama", "File MP4 (Reels/TikTok)"],
    revisions: "1x revisi",
    duration: "1 hari kerja",
    fileFormats: "MP4 (1080×1920)",
    badge: "terlaris",
    minQty: 1,
    maxQty: 30,
    image: IMG.portUgc,
    gallery: [IMG.portUgc, IMG.catVideo],
    keywords: ["ugc", "video", "pendek", "tiktok", "reels", "shorts", "20 detik"],
  },
  {
    slug: "video-ugc-30",
    code: "B2",
    name: "Video UGC 30 Detik",
    category: "video",
    type: "unit",
    price: 35000,
    unit: "per video",
    short: "Video UGC 30 detik dengan ruang cerita lebih panjang.",
    description:
      "Versi 30 detik dari format UGC yang terbukti konversinya — ruang cerita lebih panjang untuk menampilkan masalah, solusi, dan bukti produk. Ideal untuk produk dengan fitur yang butuh demonstrasi singkat.",
    deliverables: ["1 video 30 detik siap posting", "Alur masalah → solusi → CTA", "File MP4 (Reels/TikTok)"],
    revisions: "1x revisi",
    duration: "1 hari kerja",
    fileFormats: "MP4 (1080×1920)",
    minQty: 1,
    maxQty: 30,
    image: IMG.portUgc,
    gallery: [IMG.portUgc, IMG.catVideo],
    keywords: ["ugc", "video", "pendek", "tiktok", "reels", "30 detik"],
  },
  {
    slug: "video-tv-ad-30",
    code: "B3",
    name: "Video Iklan TV 30 Detik",
    category: "video",
    type: "unit",
    price: 45000,
    unit: "per video",
    short: "Iklan bergaya TV commercial 30 detik — sinematik & memorable.",
    description:
      "Video iklan bergaya TV commercial dengan pendekatan sinematik: storytelling, motion graphics, dan sound design yang memorable. Cocok untuk kampanye brand, digital ads premium, hingga videotron.",
    deliverables: ["1 video iklan 30 detik", "Motion graphics & sound design", "File MP4 berbagai rasio (16:9 / 9:16 / 1:1)"],
    revisions: "1x revisi",
    duration: "2 hari kerja",
    fileFormats: "MP4 (multi-rasio)",
    minQty: 1,
    maxQty: 20,
    image: IMG.video,
    gallery: [IMG.video, IMG.catVideo],
    keywords: ["iklan", "tv", "tv ad", "commercial", "video", "sinematik", "iklan tv"],
  },
  {
    slug: "video-tv-ad-40",
    code: "B4",
    name: "Video Iklan TV 40 Detik",
    category: "video",
    type: "unit",
    price: 50000,
    unit: "per video",
    short: "TV commercial 40 detik untuk narasi brand lebih dalam.",
    description:
      "Format TV commercial 40 detik dengan ruang narasi lebih dalam — sempurna untuk menampilkan perjalanan brand, testimoni singkat, atau demonstrasi produk yang lebih utuh dengan finishing sinematik.",
    deliverables: ["1 video iklan 40 detik", "Motion graphics & sound design", "File MP4 berbagai rasio (16:9 / 9:16 / 1:1)"],
    revisions: "1x revisi",
    duration: "2 hari kerja",
    fileFormats: "MP4 (multi-rasio)",
    minQty: 1,
    maxQty: 20,
    image: IMG.video,
    gallery: [IMG.video, IMG.catVideo],
    keywords: ["iklan", "tv", "tv ad", "commercial", "video", "40 detik"],
  },
  {
    slug: "video-company-profile-60",
    code: "B5",
    name: "Video Company Profile 60 Detik",
    category: "video",
    type: "unit",
    price: 100000,
    unit: "per video",
    short: "Company profile 60 detik yang membuat bisnis tampak besar.",
    description:
      "Video company profile 60 detik dengan standar produksi profesional: scripting, voice over, motion graphics, dan scoring — mengemas nilai, layanan, dan kredibilitas bisnis anda dalam satu video yang siap dipajang di website, presentasi, dan media sosial.",
    deliverables: ["1 video company profile 60 detik", "Scripting + voice over", "Motion graphics & scoring", "File MP4 (16:9) + versi sosial"],
    revisions: "1x revisi",
    duration: "2 hari kerja",
    fileFormats: "MP4 (16:9 + 9:16)",
    minQty: 1,
    maxQty: 10,
    image: IMG.video,
    gallery: [IMG.video, IMG.portCompany],
    keywords: ["company profile", "video", "profil perusahaan", "bisnis", "korporat", "60 detik"],
  },

  // ============ C. WEBSITE PROFESIONAL & WEB APPS CUSTOM ============
  {
    slug: "landing-page-fullstack",
    code: "C1",
    name: "Landing Page Full-Stack",
    category: "website",
    type: "website",
    price: 700000,
    unit: "per website",
    short: "3 halaman, 15 seksi, CMS, domain .com + hosting + database — semua termasuk.",
    description:
      "Landing page full-stack lengkap untuk kampanye dan bisnis anda: 3 halaman (Landing, Thank You, Akses) hingga 15 seksi, plus dashboard CMS agar anda bisa update konten sendiri. Domain .com, hosting, dan database sudah termasuk — website tayang dalam 1 minggu.",
    deliverables: [
      "3 halaman (Landing + Thank You + Access)",
      "Hingga 15 seksi konten",
      "Dashboard + CMS sederhana",
      "Form leads terintegrasi WhatsApp",
      "Email otomatis",
      "Sistem pembayaran Lynk.id",
      "Domain .com + hosting + database (Supabase)",
      "SEO dasar + Meta Pixel",
    ],
    revisions: "2x revisi",
    duration: "1 minggu",
    fileFormats: "Website live (domain + hosting termasuk)",
    badge: "terlaris",
    minQty: 1,
    maxQty: 1,
    image: IMG.webLaptop,
    gallery: [IMG.webLaptop, IMG.catWeb, IMG.ecommerce],
    keywords: ["landing page", "website", "full stack", "fullstack", "cms", "domain", "hosting", "lynk"],
  },
  {
    slug: "desain-website-landing-page",
    code: "C2",
    name: "Jasa Desain Website Landing Page",
    category: "website",
    type: "website",
    price: 100000,
    unit: "per desain",
    short: "Desain UI landing page saja — tanpa development & hosting.",
    description:
      "Hanya butuh desain? Paket ini menghasilkan desain UI landing page berkualitas tinggi dalam bentuk source code desain (siap diimplementasikan developer anda sendiri). Catatan penting: ini DESAIN SAJA — tidak termasuk development, hosting, maupun domain. Butuh versi yang langsung tayang? Pilih Landing Page Full-Stack.",
    deliverables: ["Desain UI landing page", "Source code desain (GitHub/GitLab)", "Panduan komponen singkat"],
    revisions: "2x revisi",
    duration: "2 hari kerja",
    fileFormats: "Source code desain (repo)",
    minQty: 1,
    maxQty: 1,
    image: IMG.catWeb,
    gallery: [IMG.catWeb, IMG.webLaptop],
    keywords: ["desain website", "ui", "desain landing", "mockup", "figma", "tanpa koding"],
  },
  {
    slug: "company-profile-website",
    code: "C3",
    name: "Company Profile Website",
    category: "website",
    type: "website",
    price: 700000,
    unit: "per website",
    short: "Website 5–7 halaman + CMS + blog + domain & hosting termasuk.",
    description:
      "Website company profile profesional 5–7 halaman (Home, Tentang, Layanan, Portofolio, Kontak, dll) yang membangun kredibilitas bisnis anda di mata klien korporat. Termasuk CMS sederhana, blog, setup Google Business Profile, serta domain .com + hosting + database Supabase.",
    deliverables: [
      "5–7 halaman (Home, Tentang, Layanan, Portofolio, Kontak)",
      "CMS sederhana + blog",
      "Setup Google Business Profile",
      "Domain .com + hosting + database (Supabase)",
      "SEO dasar",
    ],
    revisions: "2x revisi",
    duration: "1 minggu",
    fileFormats: "Website live (domain + hosting termasuk)",
    minQty: 1,
    maxQty: 1,
    image: IMG.portCompany,
    gallery: [IMG.portCompany, IMG.catWeb, IMG.webLaptop],
    keywords: ["company profile", "website", "profil perusahaan", "bisnis", "corporate", "blog"],
  },
  {
    slug: "ecommerce-umkm",
    code: "C4",
    name: "E-Commerce UMKM",
    category: "website",
    type: "website",
    price: 1500000,
    unit: "per website",
    short: "Toko online full-stack 10 produk + checkout WhatsApp.",
    description:
      "Toko online full-stack untuk UMKM: katalog hingga 10 produk, keranjang belanja, dan checkout via WhatsApp — model yang paling cepat tayang dan mudah dikelola. Note: tidak termasuk biaya VPS/hosting & domain (dibantu setup terpisah bila diperlukan).",
    deliverables: [
      "Full-stack e-commerce",
      "Katalog hingga 10 produk",
      "Keranjang belanja",
      "Checkout WhatsApp",
      "Panel kelola produk",
    ],
    revisions: "2x revisi",
    duration: "1 minggu",
    fileFormats: "Source code + deployment guide",
    badge: "best-value",
    minQty: 1,
    maxQty: 1,
    image: IMG.ecommerce,
    gallery: [IMG.ecommerce, IMG.catWeb],
    keywords: ["toko online", "ecommerce", "e-commerce", "umkm", "toko", "jualan", "online shop"],
  },
  {
    slug: "ecommerce-pro",
    code: "C5",
    name: "E-Commerce Pro",
    category: "website",
    type: "website",
    price: 2500000,
    unit: "per website",
    short: "Payment gateway, varian produk, multi-admin, laporan penjualan.",
    description:
      "Toko online kelas profesional dengan seluruh fitur untuk skala: payment gateway Midtrans/Xendit, varian produk (ukuran/warna), ongkir otomatis, kupon diskon, multi-admin, laporan penjualan, dan email otomatis. Note: tidak termasuk biaya VPS/hosting & domain.",
    deliverables: [
      "Semua fitur E-Commerce UMKM",
      "Payment gateway (Midtrans/Xendit)",
      "Varian produk",
      "Ongkir otomatis",
      "Kupon diskon",
      "Multi-admin",
      "Laporan penjualan",
      "Email otomatis",
    ],
    revisions: "2x revisi",
    duration: "1 minggu",
    fileFormats: "Source code + deployment guide",
    badge: "baru",
    minQty: 1,
    maxQty: 1,
    image: IMG.ecommerce,
    gallery: [IMG.ecommerce, IMG.catWeb],
    keywords: ["toko online", "ecommerce pro", "midtrans", "xendit", "payment gateway", "toko"],
  },
  {
    slug: "custom-app",
    code: "C6",
    name: "Custom Web App",
    category: "website",
    type: "website",
    price: 5000000,
    unit: "mulai dari",
    short: "POS, booking, LMS, dashboard internal — sesuai kebutuhan, garansi 3 bulan.",
    description:
      "Web application custom sesuai kebutuhan bisnis anda — mulai dari POS (Point of Sale), sistem booking, LMS (Learning Management System), hingga dashboard internal. Dimulai dengan discovery workshop untuk memetakan scope, dilengkapi dokumentasi teknis dan garansi bug 3 bulan. Harga final menyesuaikan scope hasil workshop.",
    deliverables: [
      "Sistem sesuai kebutuhan (POS / booking / LMS / dashboard)",
      "Discovery workshop",
      "Dokumentasi teknis",
      "Garansi bug 3 bulan",
    ],
    revisions: "Sesuai kontrak scope",
    duration: "Scope via workshop",
    fileFormats: "Source code + dokumentasi",
    badge: "mulai-dari",
    minQty: 1,
    maxQty: 1,
    image: IMG.app,
    gallery: [IMG.app, IMG.catWeb],
    keywords: ["custom app", "aplikasi", "pos", "booking", "lms", "dashboard", "sistem", "custom"],
  },

  // ============ D. ADD-ON ============
  {
    slug: "addon-halaman-cp",
    code: "D1",
    name: "Halaman Tambahan Company Profile",
    category: "addon",
    type: "addon",
    price: 100000,
    unit: "per halaman",
    short: "Tambah halaman baru untuk website company profile anda.",
    description:
      "Perlu halaman tambahan di luar paket website? Add-on ini menambahkan 1 halaman custom (mis. galeri, karier, paket harga, detail layanan) dengan gaya konsisten dengan website anda yang sudah ada — per halaman.",
    deliverables: ["1 halaman custom baru", "Desain konsisten website eksisting", "Terhubung navigasi"],
    revisions: "2x revisi",
    duration: "1–2 hari kerja",
    fileFormats: "Terintegrasi website",
    minQty: 1,
    maxQty: 20,
    image: IMG.catAddon,
    gallery: [IMG.catAddon, IMG.portCompany],
    keywords: ["halaman", "tambahan", "add on", "addon", "company profile", "website"],
  },
  {
    slug: "addon-copywriting",
    code: "D2",
    name: "Copywriting Profesional",
    category: "addon",
    type: "addon",
    price: 50000,
    unit: "per halaman",
    short: "Naskah persuasif yang menjual — per halaman.",
    description:
      "Copywriting profesional untuk halaman website anda: headline yang mencuri perhatian, struktur argumen yang menghapus keraguan, dan CTA yang mendorong tindakan — ditulis dengan riset audiens dan prinsip persuasi teruji. Per halaman.",
    deliverables: ["Naskah 1 halaman website", "Riset audiens & angle", "2 alternatif headline"],
    revisions: "2x revisi",
    duration: "1–2 hari kerja",
    fileFormats: "Dokumen naskah (siap tempel)",
    minQty: 1,
    maxQty: 20,
    image: IMG.catAddon,
    gallery: [IMG.catAddon],
    keywords: ["copywriting", "naskah", "teks", "artikel", "website", "penulis"],
  },
  {
    slug: "addon-foto-produk-20",
    code: "D3",
    name: "Paket Foto Produk 20 PCS",
    category: "addon",
    type: "addon",
    price: 200000,
    unit: "per 20 foto",
    short: "20 foto produk sekali jepret — hemat 30%.",
    description:
      "Paket hemat foto produk: 20 foto dalam satu sesi produksi dengan konsistensi gaya pencahayaan dan styling — cocok untuk katalog produk lengkap sekaligus stok konten sebulan. Hemat dibanding harga satuan.",
    deliverables: ["20 foto produk hasil edit", "Konsistensi gaya satu sesi", "File JPG resolusi tinggi"],
    revisions: "2x revisi",
    duration: "2–3 hari kerja",
    fileFormats: "JPG (resolusi tinggi)",
    minQty: 1,
    maxQty: 1,
    image: IMG.foto,
    gallery: [IMG.foto, IMG.catAddon],
    keywords: ["foto produk", "paket", "20", "foto", "katalog", "hemat"],
  },
  {
    slug: "addon-maintenance",
    code: "D4",
    name: "Maintenance Website",
    category: "addon",
    type: "addon",
    price: 350000,
    unit: "per bulan",
    short: "Update konten, backup, & keamanan website — per bulan.",
    description:
      "Serahkan perawatan website ke ahlinya: update konten minor, backup berkala, monitoring keamanan, dan perbaikan kecil — website anda selalu prima tanpa perlu mikir. Diaktifkan per bulan, bisa dihentikan kapan pun.",
    deliverables: ["Update konten minor", "Backup berkala", "Monitoring keamanan", "Laporan bulanan ringkas"],
    revisions: "Termasuk perbaikan minor",
    duration: "Aktif 1 bulan",
    fileFormats: "Layanan berkelanjutan",
    minQty: 1,
    maxQty: 1,
    image: IMG.catAddon,
    gallery: [IMG.catAddon],
    keywords: ["maintenance", "perawatan", "update", "backup", "keamanan", "website"],
  },
  {
    slug: "addon-migrasi-konten",
    code: "D5",
    name: "Migrasi Konten",
    category: "addon",
    type: "addon",
    price: 600000,
    unit: "per proyek",
    short: "Pindahkan seluruh konten website lama ke platform baru.",
    description:
      "Pindahkan seluruh konten website lama anda — halaman, artikel, gambar, hingga struktur menu — ke platform baru tanpa kehilangan data dan tanpa drama. Termasuk pengecekan link mati dan redirect setup agar SEO tidak drop.",
    deliverables: ["Migrasi konten lengkap", "Pengecekan link mati", "Setup redirect", "Verifikasi tampilan"],
    revisions: "1x revisi",
    duration: "3–5 hari kerja",
    fileFormats: "Sesuai platform target",
    badge: "baru",
    minQty: 1,
    maxQty: 1,
    image: IMG.catAddon,
    gallery: [IMG.catAddon],
    keywords: ["migrasi", "pindah", "konten", "website lama", "transfer"],
  },
  {
    slug: "addon-multi-bahasa",
    code: "D6",
    name: "Multi-Bahasa (ID/EN)",
    category: "addon",
    type: "addon",
    price: 0, // dinamis: 35% × paket website termahal di keranjang
    unit: "per proyek",
    short: "Website dua bahasa Indonesia & Inggris — 35% dari paket utama.",
    description:
      "Buka pasar global dengan website dua bahasa (Indonesia & Inggris). Add-on ini menambahkan versi penuh bahasa Inggris pada paket website anda, termasuk penyesuaian struktur kalimat yang natural — bukan terjemahan kaku. Harga: 35% dari paket website termahal di keranjang anda, dan wajib dipesan bersama paket website.",
    deliverables: ["Versi penuh bahasa Inggris (ID/EN)", "Switcher bahasa", "Terjemahan natural (bukan kaku)"],
    revisions: "2x revisi",
    duration: "+2–3 hari dari paket utama",
    fileFormats: "Terintegrasi website",
    badge: "baru",
    minQty: 1,
    maxQty: 1,
    image: IMG.catAddon,
    gallery: [IMG.catAddon],
    keywords: ["multi bahasa", "inggris", "english", "dua bahasa", "translasi", "internasional"],
  },

  // ============ E. PAKET RETAINER BULANAN ============
  {
    slug: "retainer-starter",
    code: "E1",
    name: "Retainer Starter",
    category: "retainer",
    type: "plan",
    price: 750000,
    unit: "per bulan",
    short: "12 desain + 2 video/bulan untuk mulai konsisten tampil.",
    description:
      "Paket retainer pemula untuk brand yang ingin mulai hadir konsisten: 12 desain statis, 2 video pendek 15 detik, dan caption untuk semua desain — setiap bulan, dengan kontrak minimal 3 bulan. Respons maksimal 24 jam kerja.",
    deliverables: [
      "12 desain statis / bulan",
      "2 video pendek 15 dtk / bulan",
      "Caption semua desain",
      "2x revisi per item",
      "Respons < 24 jam kerja",
    ],
    revisions: "2x revisi per item",
    duration: "Kontrak minimal 3 bulan",
    fileFormats: "JPG/PNG/MP4",
    minQty: 1,
    maxQty: 1,
    image: IMG.catRetainer,
    gallery: [IMG.catRetainer, IMG.catDesain],
    keywords: ["retainer", "langganan", "starter", "paket bulanan", "konten"],
  },
  {
    slug: "retainer-growth",
    code: "E2",
    name: "Retainer Growth",
    category: "retainer",
    type: "plan",
    price: 1500000,
    unit: "per bulan",
    short: "24 desain + 6 video + Meta Ads — untuk tumbuh agresif.",
    description:
      "Paket pertumbuhan untuk brand yang agresif naik kelas: 24 desain, 6 video pendek, 1 set materi iklan Meta, content calendar bulanan, plus grup WhatsApp khusus dan laporan ringkas — dengan SLA respons 8 jam kerja dan kontrak minimal 3 bulan.",
    deliverables: [
      "24 desain statis / bulan",
      "6 video pendek 15–30 dtk / bulan",
      "Caption + content calendar bulanan",
      "1 set materi iklan Meta / bulan",
      "3x revisi per item",
      "Respons 8 jam kerja",
      "Grup WhatsApp khusus",
      "Laporan ringkas bulanan",
    ],
    revisions: "3x revisi per item",
    duration: "Kontrak minimal 3 bulan",
    fileFormats: "JPG/PNG/MP4",
    badge: "paling-laris",
    minQty: 1,
    maxQty: 1,
    image: IMG.catRetainer,
    gallery: [IMG.catRetainer, IMG.catDesain],
    keywords: ["retainer", "langganan", "growth", "paket bulanan", "meta ads", "konten"],
  },
  {
    slug: "retainer-pro",
    code: "E3",
    name: "Retainer Pro",
    category: "retainer",
    type: "plan",
    price: 3500000,
    unit: "per bulan",
    short: "40 desain + 12 video + 3 set iklan — tim produksi penuh.",
    description:
      "Tim produksi konten penuh tanpa rekrut in-house: 40 desain, 12 video hingga 60 detik, 3 set materi iklan Meta, foto produk bulanan, strategi konten lengkap dengan review mingguan, revisi tak terbatas dalam 7 hari, PIC khusus dengan call bulanan — SLA respons di bawah 3 jam kerja, kontrak minimal 6 bulan.",
    deliverables: [
      "40 desain statis / bulan",
      "12 video (hingga 60 dtk) / bulan",
      "Caption + strategi konten + calendar + review mingguan",
      "3 set materi iklan Meta / bulan",
      "Foto produk 20 pcs / bulan",
      "Revisi tak terbatas (dalam 7 hari)",
      "Respons < 3 jam kerja",
      "Grup WA PIC khusus + call bulanan",
      "Laporan lengkap + rekomendasi",
    ],
    revisions: "Tak terbatas (dalam 7 hari)",
    duration: "Kontrak minimal 6 bulan",
    fileFormats: "JPG/PNG/MP4",
    minQty: 1,
    maxQty: 1,
    image: IMG.catRetainer,
    gallery: [IMG.catRetainer, IMG.catDesain],
    keywords: ["retainer", "langganan", "pro", "paket bulanan", "tim produksi", "premium"],
  },
];

export const PLANS = CATALOG.filter((i) => i.type === "plan");

// ============ KOLEKSI CROSS-CATEGORY (R3 / D-R3-07) ============
// Kurasi lintas kategori — bukan kategori baru, hanya pintu masok
// tematik (cth: Ad Creative = iklan Meta + video iklan).

export interface Collection {
  id: string;
  name: string;
  blurb: string;
  image: string;
  slugs: string[];
}

export const COLLECTIONS: Collection[] = [
  {
    id: "ad-creative",
    name: "Ad Creative",
    blurb: "Materi visual iklan yang dirancang untuk menarik perhatian dan menyampaikan pesan dengan cepat.",
    image: "/images/mockup-iklan.png",
    slugs: ["materi-iklan-meta", "video-ugc-20", "video-ugc-30", "video-tv-ad-30", "video-tv-ad-40"],
  },
];

export function getCollection(id: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.id === id);
}

// Slug produk populer global (fallback rekomendasi For You — PRD §11.4)
export const POPULAR_SLUGS = [
  "desain-feed-instagram",
  "logo-starter",
  "feed-instagram-carousel",
  "video-ugc-20",
  "landing-page-fullstack",
  "materi-iklan-meta",
  "ecommerce-umkm",
  "video-company-profile-60",
];

// Slug item "Baru" (badge emerald — New Arrivals)
export const NEW_SLUGS = ["ecommerce-pro", "custom-app", "addon-migrasi-konten", "addon-multi-bahasa", "video-tv-ad-40"];

// ============ BUNDLE PROMO (Today's Deals — PRD §11.3, fallback Q1: TANPA diskon) ============
export interface BundleDeal {
  slug: string;
  name: string;
  desc: string;
  image: string;
  items: { slug: string; qty: number }[];
}

export const BUNDLE_DEALS: BundleDeal[] = [
  {
    slug: "starter-branding-kit",
    name: "Starter Branding Kit",
    desc: "Logo Starter + Feed Carousel + Story Cover — fondasi identitas brand dalam satu order.",
    image: IMG.logo,
    items: [
      { slug: "logo-starter", qty: 1 },
      { slug: "feed-instagram-carousel", qty: 1 },
      { slug: "story-reels-cover", qty: 1 },
    ],
  },
  {
    slug: "social-media-launch-pack",
    name: "Social Media Launch Pack",
    desc: "6 Feed IG + 3 Story Cover + 1 Video UGC 20 dtk — bekal launching produk di sosial media.",
    image: IMG.feed,
    items: [
      { slug: "desain-feed-instagram", qty: 6 },
      { slug: "story-reels-cover", qty: 3 },
      { slug: "video-ugc-20", qty: 1 },
    ],
  },
  {
    slug: "umkm-go-digital",
    name: "UMKM Go Digital",
    desc: "Company Profile Website + 12 Feed IG + Maintenance 1 bulan — hadir digital secara total.",
    image: IMG.portCompany,
    items: [
      { slug: "company-profile-website", qty: 1 },
      { slug: "desain-feed-instagram", qty: 12 },
      { slug: "addon-maintenance", qty: 1 },
    ],
  },
];

// ============ HELPERS ============

export function getItem(slug: string): CatalogItem | undefined {
  return CATALOG.find((i) => i.slug === slug);
}

export function getByCategory(cat: CategoryId): CatalogItem[] {
  return CATALOG.filter((i) => i.category === cat);
}

export function getCategory(cat: CategoryId): Category | undefined {
  return CATEGORIES.find((c) => c.id === cat);
}

const idr = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function formatIDR(n: number): string {
  return idr.format(n); // "Rp 20.000"
}

// ---------- Perhitungan keranjang (server & client) — PRD §8 ----------

export interface CartLineInput {
  slug: string;
  qty: number;
}

export interface PricedLine {
  slug: string;
  code: string;
  name: string;
  type: ItemType;
  unit: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
}

export interface CartTotals {
  lines: PricedLine[];
  total: number;
  multilang: {
    present: boolean;
    valid: boolean;
    baseSlug?: string;
    basePrice?: number;
    price?: number; // 35% × basePrice
  };
  invalidSlugs: string[]; // slug tak dikenal (server: tolak; client: skip)
}

const WEBSITE_SLUGS = CATALOG.filter((i) => i.type === "website").map((i) => i.slug);

/**
 * Menghitung total keranjang dari master data.
 * Aturan multi-bahasa (PRD §8.4): 35% × paket website termahal di keranjang.
 * Jika multi-bahasa ada tanpa paket website → valid = false (checkout diblokir).
 */
export function computeCart(items: CartLineInput[]): CartTotals {
  const invalidSlugs: string[] = [];
  const lines: PricedLine[] = [];

  for (const it of items) {
    const item = getItem(it.slug);
    if (!item) {
      invalidSlugs.push(it.slug);
      continue;
    }
    const qty = Math.max(1, Math.min(item.maxQty, Math.round(it.qty) || 1));
    lines.push({
      slug: item.slug,
      code: item.code,
      name: item.name,
      type: item.type,
      unit: item.unit,
      qty,
      unitPrice: item.price,
      subtotal: item.price > 0 ? item.price * qty : 0,
    });
  }

  // Aturan multi-bahasa
  const hasMultilang = lines.some((l) => l.slug === "addon-multi-bahasa");
  const websiteLines = lines.filter((l) => WEBSITE_SLUGS.includes(l.slug));
  const baseLine = websiteLines.length > 0 ? websiteLines.reduce((a, b) => (a.unitPrice > b.unitPrice ? a : b)) : undefined;

  const multilang = {
    present: hasMultilang,
    valid: hasMultilang ? !!baseLine : true,
    baseSlug: baseLine?.slug,
    basePrice: baseLine?.unitPrice,
    price: hasMultilang && baseLine ? Math.round(baseLine.unitPrice * 0.35) : undefined,
  };

  if (hasMultilang && baseLine) {
    const ml = lines.find((l) => l.slug === "addon-multi-bahasa");
    if (ml) {
      ml.unitPrice = multilang.price!;
      ml.subtotal = multilang.price!;
    }
  }

  const total = lines
    .filter((l) => !(l.slug === "addon-multi-bahasa" && !baseLine))
    .reduce((sum, l) => sum + l.subtotal, 0);

  return { lines, total, multilang, invalidSlugs };
}

export interface BundleSummary {
  lines: PricedLine[];
  total: number;
}

export function computeBundle(bundle: BundleDeal): BundleSummary {
  const { lines, total } = computeCart(bundle.items);
  return { lines, total };
}

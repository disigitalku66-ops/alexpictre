# PRD — AlexPicture Marketplace
### Platform E-Commerce Layanan Kreatif Berstandar Industri

| Metadata | Nilai |
|---|---|
| Versi Dokumen | 3.0.0 (Enterprise Marketplace Edition — Revision & Diagram Release) |
| Status | Approved for AI Build Execution |
| Target Platform | Web Desktop & Mobile-First (PWA Standard) |
| Stack Teknologi | Next.js 16 (App Router) · TypeScript 5 · Tailwind CSS 4 · shadcn/ui (New York) · Lucide Icons · Zustand · Prisma |
| Deployment | GitHub (disigitalku66-ops/alexpictre) → Vercel · Database: Supabase PostgreSQL |
| Dokumen Definitif | **docs/PRD-AlexPicture-Marketplace-v3.0.pdf** (40 halaman, 23 bab, 24 tabel, 6 diagram) |
| Tanggal Disusun | 30 Agustus 2026 (revisi mayor v3.0) |

> **Status v3.0**: Dokumen PDF di atas adalah versi otoritatif dan lengkap. Markdown ini adalah
> cermin ringkas untuk kontrak build. Ringkasan perubahan v3.0: integrasi referensi desain
> marketplace modern (gambar upload user) — beranda 11 seksi (Shop by Category, Today's Deals
> Limited Time, Featured Products, For You, New Arrivals, USP bar, interstitial, newsletter),
> dua varian kartu produk + taksonomi badge (amber=kurasi, merah=insentif harga), **Bab baru
> Pembayaran/Riwayat/Pelacakan (model dual-rail)** dengan halaman baru **#/lacak-pesanan** dan
> fitur **Pesanan Saya** (tanpa login), pipeline status pesanan 7 tahap + kolom paymentStatus,
> rekomendasi For You berbasis aturan, serta 6 diagram alur ter-embed.

---

## DAFTAR ISI
1. [Ringkasan Eksekutif & Visi Produk](#1-ringkasan-eksekutif--visi-produk)
2. [Analisis Pasar, Persona & Positioning](#2-analisis-pasar-persona--positioning)
3. [Tujuan Bisnis & Success Metrics (KPI)](#3-tujuan-bisnis--success-metrics-kpi)
4. [Scope Proyek](#4-scope-proyek)
5. [Arsitektur Informasi & Routing](#5-arsitektur-informasi--routing)
6. [Spesifikasi Halaman (Page-by-Page)](#6-spesifikasi-halaman-page-by-page)
7. [Master Data Katalog (Single Source of Truth)](#7-master-data-katalog-single-source-of-truth)
8. [Sistem Keranjang Modular & Logika Harga](#8-sistem-keranjang-modular--logika-harga)
9. [Form Brief Klien (Spesifikasi)](#9-form-brief-klien-spesifikasi)
10. [WhatsApp Gateway (Spesifikasi Teknis)](#10-whatsapp-gateway-spesifikasi-teknis)
11. [Sistem Promosi (Flash Sale, Bundling, Badge)](#11-sistem-promosi-flash-sale-bundling-badge)
12. [Arsitektur Data & Skema Database](#12-arsitektur-data--skema-database)
13. [Spesifikasi API](#13-spesifikasi-api)
14. [Design System](#14-design-system)
15. [Responsive & Mobile UX Specification](#15-responsive--mobile-ux-specification)
16. [PWA Requirements](#16-pwa-requirements)
17. [SEO, Structured Data & Analytics](#17-seo-structured-data--analytics)
18. [Keamanan, Compliance & Privasi](#18-keamanan-compliance--privasi)
19. [Deployment Runbook (GitHub → Supabase → Vercel)](#19-deployment-runbook-github--supabase--vercel)
20. [Acceptance Criteria](#20-acceptance-criteria)
21. [Risiko & Mitigasi](#21-risiko--mitigasi)
22. [Keputusan Desain Terkunci & Pertanyaan Terbuka](#22-keputusan-desain-terkunci--pertanyaan-terbuka)
23. [Roadmap Pasca-MVP](#23-roadmap-pasca-mvp)
24. [Lampiran: Data Bisnis & Aset](#24-lampiran-data-bisnis--aset)

---

## 1. RINGKASAN EKSEKUTIF & VISI PRODUK

### 1.1 Deskripsi
AlexPicture Marketplace adalah platform e-commerce layanan digital berbasis web yang memasarkan jasa kreatif profesional: **Desain Grafis, Video Komersial, Jasa Pembuatan Website Full-Stack & Web Apps Custom, Add-on, dan Paket Berlangganan Bulanan (Retainer)**.

Pengalaman pengguna mengadopsi standar marketplace modern (ala Tokopedia/Shopee untuk mobile, dashboard korporat elegan untuk desktop). Seluruh transaksi diarahkan mulus ke **WhatsApp Official** melalui **Form Brief Klien Terstruktur**.

### 1.2 Prinsip Produk
1. **Zero-Friction Checkout** — Tanpa akun, tanpa login, tanpa pembayaran online. Keranjang → Brief → WhatsApp. Selesai.
2. **Kepercayaan Dulu** — Harga transparan, deliverable eksplisit, estimasi jelas, tanpa biaya tersembunyi.
3. **Persepsi Agensi Profesional** — Seluruh produksi memakai otomasi cerdas di balik layar, TAPI istilah "AI" **tidak pernah** diekspos sebagai label produk ke klien akhir.
4. **Mobile-First Native Feel** — Bottom navigation bar + PWA = pengalaman seperti aplikasi native.
5. **Tidak Ada Data Sensitif di Klien** — Keranjang hanya menyimpan ID produk & kuantitas (non-sensitif) di localStorage.

### 1.3 Model Bisnis
- **Penjualan satuan** (design/video/website/add-on) → konversi via WhatsApp.
- **Retainer bulanan** (Starter/Growth/Pro) → kontrak min. 3–6 bulan, closing via WhatsApp.
- **Cross-sell & upsell** via add-on, bundling, dan rekomendasi produk terkait.

---

## 2. ANALISIS PASAR, PERSONA & POSITIONING

### 2.1 Target Segmen
| Persona | Profil | Kebutuhan Utama | Jalur Konversi |
|---|---|---|---|
| **P1 — Pebisnis UMKM** | Usia 25–45, pemilik usaha F&B/fashion/jasa lokal, mobile-heavy, native pengguna WhatsApp | Desain feed, poster promo, video UGC murah & cepat | Tambah ke keranjang → brief singkat → WA |
| **P2 — Founder Startup / Marketing Manager** | Budget menengah, butuh branding + iklan performa konsisten | Materi iklan Meta, retainer bulanan, company profile | Bandingkan paket langganan → WA |
| **P3 — Bisnis Established / Korporat** | Butuh sistem digital serius, peduli SLA & dokumentasi | Landing page full-stack, e-commerce, custom app, multi-bahasa | Detail teknis lengkap → brief mendalam → WA |

### 2.2 Positioning
> "Mitra produksi kreatif berstandar industri — harga transparan ala marketplace, kualitas & pelayanan ala agensi."

Differentiator yang dikomunikasikan di UI:
- Harga & deliverable **ditampilkan eksplisit** (tidak "hubungi untuk harga").
- Estimasi waktu pengerjaan jelas per item.
- Garansi revisi terstruktur per produk.
- Respons cepat (SLA per paket retainer).

---

## 3. TUJUAN BISNIS & SUCCESS METRICS (KPI)

| KPI | Target MVP | Cara Ukur |
|---|---|---|
| WA Click-Through Rate (klik tombol checkout/WA) | ≥ 8% dari sesi | Event tracking + log Lead di DB |
| Cart-to-Checkout completion | ≥ 40% | Log Lead vs event add-to-cart |
| Average Order Value (AOV) | ≥ Rp 150.000 | Log Lead (total item) |
| Response time lead pertama | < 15 menit (jam kerja) | Proses internal |
| Lighthouse Performance (Mobile) | ≥ 90 | Audit saat build |
| Lighthouse SEO/Accessibility/Best Practices | ≥ 90 | Audit saat build |

---

## 4. SCOPE PROYEK

### 4.1 In-Scope (MVP — Build Ini)
- SPA hash-routing 11 "halaman": Beranda, Katalog, Detail Produk (dinamis per slug), Langganan, Keranjang & Checkout, Portofolio, Tentang, FAQ, Kebijakan Privasi, Syarat & Ketentuan, Terima Kasih.
- Header desktop lengkap (Top Bar + Main Header + Mega Menu) & Mobile Bottom Navigation.
- Keranjang modular multi-jenis produk + kalkulasi real-time.
- Form Brief Klien + WhatsApp Gateway via API route (total dihitung **server-side**).
- Lead logging ke database (Supabase) dengan order code unik.
- PWA installable (manifest + ikon + meta).
- SEO dasar + JSON-LD (Organization, LocalBusiness, WebSite, FAQPage).
- Aset visual (hero, ilustrasi kategori, mockup portofolio) digenerate saat build.
- Deployment: GitHub (replace konten repo) + Vercel + Supabase.

### 4.2 Out-of-Scope (MVP — ditunda ke Phase 2)
- Pembayaran online langsung di website (Midtrans/Xendit untuk klien AlexPicture sendiri).
- Login/registrasi akun klien.
- Admin dashboard lead (MVP: lead tercatat di DB & bisa dilihat via Supabase Studio).
- Blog/artikel SEO.
- Sistem voucher diskon server-side.
- Offline mode PWA penuh (service worker caching).
- Multi-bahasa UI website ini sendiri.

---

## 5. ARSITEKTUR INFORMASI & ROUTING

### 5.1 Keputusan Arsitektur (TERKUNCI)
**SPA hash-routing dalam satu route Next.js (`/`)**. Blueprint user menyebut "arsitektur multipage **atau** SPA dengan navigasi multi-halaman mulus" → dipilih SPA hash-routing karena:
- Navigasi antar halaman mulus tanpa reload (sesuai blueprint).
- URL tetap shareable & tombol back browser berfungsi (`#/produk/logo-starter`).
- Identik 100% antara preview sandbox dan produksi Vercel.
- Semua konten "halaman" dikodekan sebagai view-component yang di-switch oleh router store Zustand.

> Catatan tradeoff: hash-routing membatasi SEO per-halaman. Mitigasi: meta dinamis via JS + JSON-LD lengkap + sitemap untuk root. Migrasi ke route fisik Next.js dicatat di Roadmap Phase 2.

### 5.2 Peta Route (Hash)
| Hash Route | Halaman | Padanan Blueprint |
|---|---|---|
| `#/` | Beranda | index.html |
| `#/katalog` | Katalog + Filter/Sorting/Search | catalog.html |
| `#/produk/:slug` | Detail Produk (PDP) | product-detail.html |
| `#/langganan` | Paket Retainer Bulanan | subscriptions.html |
| `#/keranjang` | Keranjang + Form Brief + Checkout | cart-checkout.html |
| `#/portofolio` | Galeri Karya | *(baru — usulan)* |
| `#/tentang` | Tentang Kami | *(baru — usulan)* |
| `#/faq` | FAQ | *(baru — usulan)* |
| `#/kebijakan-privasi` | Kebijakan Privasi (UU PDP) | *(baru — wajib hukum)* |
| `#/syarat-ketentuan` | Syarat & Ketentuan + Refund | *(baru — wajib hukum)* |
| `#/terima-kasih` | Post-Checkout (order code + info pembayaran) | *(baru — usulan)* |
| `#/lacak-pesanan` | Lacak Pesanan (Order ID + nama brand, tanpa login) | *(baru v3.0 — order history)* |

### 5.3 Struktur View (High-Level)
- `AppShell` (sticky header + konten + footer + bottom-nav mobile)
- View switch di-render lazy per halaman (code-splitting per view untuk performa).

---

## 6. SPESIFIKASI HALAMAN (PAGE-BY-PAGE)

### 6.1 Global — Header Desktop
1. **Top Bar** (tipis, background dark): teks promo (mis. "Gratis konsultasi brief pertama — chat sekarang"), link "Bantuan & FAQ", "Jam Operasional: Sen–Sab 08.00–20.00 WIB".
2. **Main Header** (sticky, putih/permukaan terang): Logo "AlexPicture." (wordmark, titik amber) → klik kembali ke `#/`; **Global Search Bar** (live suggestion dropdown: nama produk + kategori + keyword, enter → `#/katalog?q=...`); ikon **Wishlist** (badge count); ikon **Keranjang** (badge kuantitas dinamis, klik → drawer keranjang cepat / halaman keranjang).
3. **Mega Menu** (dropdown hover/click, panel lebar dengan grid kartu kategori):
   - **Desain & Branding** (icon: Palette) — subgrup: *Social Media* (Feed, Carousel, Story/Reels Cover), *Cetak* (Poster/Flyer, Banner/Spanduk, Menu/Katalog Digital), *Identitas & Produk* (Logo Starter, Foto Produk, Materi Iklan Meta).
   - **Video Komersial** (icon: Clapperboard) — UGC 20/30 dtk, TV AD 30/40 dtk, Company Profile.
   - **Web Development** (icon: Globe) — Landing Page, Desain Website, Company Profile, E-Commerce UMKM, E-Commerce Pro, Custom App + banner mini "Add-on".
   - **Langganan Bulanan** (icon: Crown) — Starter/Growth/Pro + CTA "Bandingkan Paket".
   - Tautan langsung: **Portofolio**, **Tentang**, **FAQ**.

### 6.2 Global — Mobile Bottom Navigation (fixed bottom-0)
| Tombol | Ikon | Perilaku |
|---|---|---|
| Beranda | House | `#/` |
| Katalog | LayoutGrid | `#/katalog` |
| Keranjang | ShoppingCart + badge count | `#/keranjang` |
| WhatsApp | MessageCircle | Buka `wa.me/6288272876066` (tab baru) |
- Safe-area inset iOS dihormati (`pb-[env(safe-area-inset-bottom)]`).
- Konten utama diberi padding-bottom agar tidak tertutup nav.

### 6.3 Global — Footer (sticky-to-bottom via `min-h-screen flex flex-col` + `mt-auto`)
- Kolom 1: Logo + tagline singkat + alamat + jam operasional.
- Kolom 2: Jelajahi (Beranda, Katalog, Langganan, Portofolio, FAQ).
- Kolom 3: Layanan (kategori utama → `#/katalog?kategori=...`).
- Kolom 4: Hubungi Kami (WhatsApp, email, alamat) + catatan pembayaran transfer bank (Mandiri a.n. Ana Solehata).
- Baris bawah: © tahun AlexPicture · Kebijakan Privasi · Syarat & Ketentuan.
- Footer **tidak menutupi** bottom-nav mobile (footer berada di atas bottom-nav dalam flow dokumen).

### 6.4 Halaman Beranda (`#/`) — 11 Seksi (Revisi v3.0, Berdasarkan Referensi)
Urutan seksi (atas → bawah) — lihat wireframe Gambar 3–4 pada PDF:
1. **Top Bar + Header + Nav Kategori** — top bar promo; header logo/search/wishlist/keranjang; chip nav dengan "Deals Hari Ini" (label Limited time).
2. **USP Bar** — 4 kartu kepercayaan: Harga Transparan, Revisi Terstruktur, Respons Cepat, Garansi Deliverable (di atas lipatan).
3. **Hero Split 60/40** — headline + CTA ganda + kolase mockup karya.
4. **Shop by Category** — grid 5 kartu ikon (scroll horizontal di mobile).
5. **Today's Deals (Limited Time)** — zona merah lembut + countdown mingguan (reset Senin 00.00 WIB) + 3 kartu bundle dengan badge persen + harga coret (dual discount visualization).
6. **Featured Products (Terlaris)** — kartu penuh: badge kurasi amber + tombol wishlist + harga + estimasi + CTA "+ Keranjang" langsung di kartu.
7. **Promo Interstitial** — 2 kartu: Paket Langganan (ungu lembut) & Trade-in Migrasi Website Lama (teal lembut).
8. **For You** — 4 rekomendasi berbasis aturan (sinyal: wishlist/keranjang > kategori dilihat > popularitas global).
9. **New Arrivals** — kartu penuh varian hijau dengan badge "Baru".
10. **Newsletter** — form email 1 baris di atas footer (non-intrusive, janji 1 email/bulan).
11. **Footer** — 4 kolom + strip kepercayaan + tautan hukum.

**Dua varian kartu produk** (dari referensi): kartu kompak (Deals → klik-lanjut PDP) vs kartu penuh
(Featured/New Arrivals/Katalog → tombol tambah-keranjang langsung).
**Taksonomi badge**: amber = kurasi editorial (Terlaris/Best Value/Baru/Paling Laris); merah = insentif
harga (persen bundle); abu = "Mulai dari" (C6).

### 6.5 Halaman Katalog (`#/katalog`)
- **Toolbar**: search input (sinkron dengan header), dropdown Sort (Terpopuler, Harga Terendah, Harga Tertinggi, Tercepat Selesai), chip filter kategori (Semua, Desain & Branding, Video, Website, Add-on), toggle "Hanya < Rp50.000" (quick filter).
- **Grid kartu produk**: gambar/ilustrasi kategori, kategori label kecil, nama, harga (format Rp Indonesia), estimasi waktu, revisi, tombol "+ Keranjang" + tombol wishlist (ikon hati), klik kartu → PDP.
- **Empty state** saat filter tidak match (ilustrasi + tombol reset).
- Pagination client-side atau infinite scroll (12–16 kartu per halaman).

### 6.6 Halaman Detail Produk (`#/produk/:slug`)
Layout 2 kolom desktop (galeri kiri, info kanan), stack mobile:
- **Kiri**: galeri visual (contoh mockup deliverable + close-up), thumbnails.
- **Kanan (sticky di desktop)**:
  - Kategori & badge (Terlaris / Best Value / Baru).
  - Nama produk, harga besar (Rp format Indonesia).
  - **Deliverable list** (centang hijau): semua item spesifik dari master data.
  - **Spesifikasi tabel**: Jumlah revisi · Estimasi pengerjaan · Format file.
  - Selector kuantitas (+/−).
  - Tombol: "Tambah ke Keranjang" (solid) + "Pesan Sekarang via WhatsApp" (outline — pintasan: langsung ke keranjang dengan item ini terpilih & scroll ke form brief).
  - Info kecil: "Butuh penyesuaian? Chat dulu gratis."
- **Bawah**: "Frequently Bought Together" (add-on terkait untuk paket website; produk sejenis untuk desain/video), deskripsi panjang, FAQ mini per produk.
- **Mobile**: sticky bottom action bar (harga + tombol tambah/pesan) di atas bottom-nav.

### 6.7 Halaman Langganan (`#/langganan`)
- Header: "Paket Retainer Bulanan — Produksi konten tanpa rekrut tim in-house".
- **3 kartu plan** (data persis §7.E): Starter / **Growth (badge "Paling Laris")** / Pro (badge "Untuk Brand Serius").
- Setiap kartu: harga/bulan, kontrak min., daftar kuota (desain/bulan, video/bulan dengan durasi, copywriting, materi iklan, foto produk), revisi, SLA respons, kanal komunikasi, laporan. CTA "Pilih Paket" → tambah ke keranjang (satu plan aktif).
- **Tabel perbandingan lengkap** di bawah kartu (desktop) / accordion (mobile).
- Catatan kecil: "Harga belum termasuk budget iklan · Kontrak minimal sesuai paket".

### 6.8 Halaman Keranjang & Checkout (`#/keranjang`)
Dua estado:
- **Kosong**: ilustrasi + CTA "Jelajahi Katalog".
- **Terisi**:
  - Daftar item: thumbnail, nama, satuan (per foto/per slide/per halaman/set), harga satuan, kontrol qty, hapus, subtotal.
  - Validasi & peringatan dinamis (mis. add-on multi-bahasa butuh paket website → banner info + tombol tambah paket).
  - **Ringkasan**: subtotal, indikator promo bundle otomatis (jika aktif), total besar real-time.
  - **Form Brief Klien** (lihat §9) — berada di halaman yang sama (sesuai blueprint: "di dalam modal/halaman keranjang"), dibungkus card berjudul "Brief Klien".
  - Tombol besar: "Checkout via WhatsApp" → proses §10.
  - Kepercayaan: lock icon "Data Anda hanya dikirim via WhatsApp — tidak disimpan di website".

### 6.9 Halaman Portofolio (`#/portofolio`) — BARU
- Filter chip: Semua, Desain, Video, Website.
- Masonry/grid galeri mockup karya (aset digenerate saat build) + lightbox.
- Kartu video: thumbnail + overlay play → CTA "Minta contoh video via WA".
- CTA bawah: "Mau hasil seperti ini? Mulai dari katalog."

### 6.10 Halaman Tentang (`#/tentang`) — BARU
- Cerita singkat brand, nilai (Cepat, Transparan, Standar Industri), alur kerja 4 langkah (Brief → Produksi → Revisi → Delivery & Serah Terima), info legal lengkap (alamat, jam, kontak), visual studio (generated, non-persona).

### 6.11 Halaman FAQ (`#/faq`) — BARU
Accordion 10 Q&A: cara order, metode pembayaran (transfer Mandiri), kebijakan revisi, estimasi & rush order, format file yang diterima, kontrak retainer, refund/cancel, request custom, kerahasiaan brief klien, cara kirim aset. (+ markup FAQPage JSON-LD.)

### 6.12 Halaman Hukum (`#/kebijakan-privasi`, `#/syarat-ketentuan`) — BARU
- **Kebijakan Privasi**: kompatibel UU PDP No. 27/2022 — data apa yang diproses (nama, brand, catatan brief), tujuan (penanganan pesanan), tidak ada penyimpanan sensitif di browser selain isi keranjang non-sensitif, cookie/analytics, hak subjek data (akses/koreksi/hapus via email/WhatsApp).
- **Syarat & Ketentuan**: proses pemesanan, pembayaran (DP/pelunasan transfer bank), jadwal revisi, lisensi aset, kebijakan refund barang digital (pro-rata pekerjaan), force majeure.

### 6.13 Halaman Terima Kasih (`#/terima-kasih`) — BARU
- Order code besar (mis. `APM-250115-4821`) + ringkasan item.
- Langkah selanjutnya: tim membalas di WhatsApp (jam kerja Sen–Sab 08.00–20.00 WIB).
- Info pembayaran: Bank Mandiri 1340028200532 a.n. Ana Solehata + catatan "konfirmasi setelah invoice dikirim via WA".
- CTA: "Kembali ke Beranda" / "Lihat Portofolio".

---

## 7. MASTER DATA KATALOG (SINGLE SOURCE OF TRUTH)

> Semua harga, deliverable, dan estimasi di bawah ini adalah **satu-satunya acuan** implementasi (origin: dokumen bisnis resmi AlexPicture v2.0.0). Perubahan hanya lewat dokumen ini.

### 7.A — Desain Grafis & Aset Visual
| # | Produk | Slug | Harga | Satuan | Deliverable | Revisi | Estimasi |
|---|---|---|---|---|---|---|---|
| A1 | Foto Produk | `foto-produk` | Rp 10.000 | per foto | 1 foto siap pakai | 2x | 1 hari |
| A2 | Desain Feed Instagram | `desain-feed-instagram` | Rp 10.000 | per slide | 1 slide statis | 2x | 1 hari |
| A3 | Feed Instagram Carousel | `feed-instagram-carousel` | Rp 20.000 | per set | 6 slide konsisten + caption siap posting | 2x | 1 hari |
| A4 | Desain Story / Reels Cover | `story-reels-cover` | Rp 20.000 | per desain | 1 desain 1080×1920 px | 2x | 1 hari |
| A5 | Materi Iklan Meta | `materi-iklan-meta` | Rp 50.000 | per set | 3 varian visual + 3 varian headline (A/B testing) | 2x | 2–3 hari |
| A6 | Poster / Flyer Promo | `poster-flyer-promo` | Rp 15.000 | per desain | A4 siap cetak CMYK 300 DPI bleed 3mm + PNG digital + sumber editable Canva | 2x | 1 hari |
| A7 | Banner / Spanduk | `banner-spanduk` | Rp 20.000 | per desain | Ukuran custom siap cetak digital printing + PNG + sumber editable Canva | 2x | 1 hari |
| A8 | Logo Starter | `logo-starter` | Rp 20.000 | per logo | 1 konsep final; 3 format (PNG/SVG/PDF); versi horizontal + vertikal + monokrom | 3x | 4–5 hari |
| A9 | Menu / Katalog Digital | `menu-katalog-digital` | Rp 25.000 | per halaman | 1 halaman menu/katalog digital | 2x | 1 hari |

### 7.B — Video Komersial & Produksi
| # | Produk | Slug | Harga | Durasi | Revisi | Estimasi |
|---|---|---|---|---|---|---|
| B1 | Video Pendek UGC | `video-ugc-20` | Rp 25.000 | 20 detik | 1x | 1 hari |
| B2 | Video Pendek UGC | `video-ugc-30` | Rp 35.000 | 30 detik | 1x | 1 hari |
| B3 | Video Pendek Iklan TV AD | `video-tv-ad-30` | Rp 45.000 | 30 detik | 1x | 2 hari |
| B4 | Video Pendek Iklan TV AD | `video-tv-ad-40` | Rp 50.000 | 40 detik | 1x | 2 hari |
| B5 | Video Company Profile | `video-company-profile-60` | Rp 100.000 | 60 detik | 1x | 2 hari |

### 7.C — Website Profesional & Web Apps Custom
| # | Produk | Slug | Harga | Termasuk | Durasi | Catatan |
|---|---|---|---|---|---|---|
| C1 | Landing Page Full-Stack | `landing-page-fullstack` | Rp 700.000 | 3 halaman (Landing + Thank You + Access), hingga 15 seksi, dashboard + CMS, form leads → WhatsApp, email otomatis, sistem pembayaran Lynk.id, domain .com + hosting (Vercel/Netlify) + database (Supabase), SEO dasar, Meta Pixel | 1 minggu | Label: "Full-Stack + Domain & Hosting" |
| C2 | Jasa Desain Website Landing Page | `desain-website-landing-page` | Rp 100.000 | Source code desain (GitHub/GitLab) | 2 hari | Label tegas: "Desain saja — tanpa development/hosting" |
| C3 | Company Profile Website | `company-profile-website` | Rp 700.000 | 5–7 halaman (Home, Tentang, Layanan, Portofolio, Kontak), CMS sederhana, blog, setup Google Business Profile, domain .com + hosting + database Supabase, SEO dasar | 1 minggu | — |
| C4 | E-Commerce UMKM | `ecommerce-umkm` | Rp 1.500.000 | Full-stack, katalog hingga 10 produk, keranjang, checkout WhatsApp | 1 minggu | Tidak termasuk VPS/Hosting & Domain |
| C5 | E-Commerce Pro | `ecommerce-pro` | Rp 2.500.000 | Katalog hingga 10 produk, varian produk, payment gateway (Midtrans/Xendit), ongkir otomatis, kupon diskon, multi-admin, laporan penjualan, email otomatis, integrasi sistem cerdas | 1 minggu | Tidak termasuk VPS/Hosting & Domain |
| C6 | Custom App | `custom-app` | Mulai Rp 5.000.000 | Sistem sesuai kebutuhan (POS, booking, LMS, dashboard internal), discovery workshop, dokumentasi teknis, garansi bug 3 bulan | Scope via workshop | Harga tampil "Mulai dari" |

### 7.D — Add-on (umumnya menempel paket website)
| # | Item | Slug | Harga | Satuan |
|---|---|---|---|---|
| D1 | Halaman tambahan Company Profile | `addon-halaman-cp` | Rp 100.000 | per halaman |
| D2 | Copywriting profesional | `addon-copywriting` | Rp 50.000 | per halaman |
| D3 | Paket foto produk tambahan | `addon-foto-produk-20` | Rp 200.000 | per 20 foto |
| D4 | Maintenance bulanan | `addon-maintenance` | Rp 350.000 | per bulan |
| D5 | Migrasi konten website lama | `addon-migrasi-konten` | Rp 600.000 | per proyek |
| D6 | Multi-bahasa (ID/EN) | `addon-multi-bahasa` | 35% × paket utama | per proyek — lihat §8.4 |

### 7.E — Paket Retainer Bulanan
| Fitur | **Starter** | **Growth** ⭐ | **Pro** |
|---|---|---|---|
| Harga/bulan | Rp 750.000 | Rp 1.500.000 | Rp 3.500.000 |
| Kontrak minimal | 3 bulan | 3 bulan | 6 bulan |
| Desain statis | 12/bulan | 24/bulan | 40/bulan |
| Video pendek | 2 video (15 dtk)/bln | 6 video (15–30 dtk)/bln | 12 video (hingga 60 dtk)/bln |
| Copywriting | Caption semua desain | Caption + Content Calendar bulanan | Caption + strategi konten + calendar + review mingguan |
| Materi Iklan Meta | — | 1 set/bulan | 3 set/bulan |
| Foto produk | — | — | 1x/bulan (20 foto) |
| Revisi per item | 2x | 3x | Tak terbatas (dalam 7 hari) |
| Waktu respons | < 24 jam kerja | 8 jam kerja | < 3 jam kerja |
| Kanal komunikasi | WhatsApp umum | Grup WA khusus | Grup WA PIC khusus + call bulanan |
| Laporan | — | Ringkas bulanan | Lengkap + rekomendasi |

---

## 8. SISTEM KERANJANG MODULAR & LOGIKA HARGA

### 8.1 Prinsip
- Multi-jenis item (satuan desain, video, website, add-on, plan retainer) **dicampur dalam satu keranjang** — sesuai blueprint "Multi-Checkout Modular Cart".
- State: Zustand store `useCartStore` + persist middleware (localStorage). Item disimpan sebagai `{ slug, qty, type }` — **tanpa data pribadi**.
- Wishlist terpisah (`useWishlistStore`, persist, non-sensitif).

### 8.2 Tipe Item Keranjang
| Type | Perilaku Qty | Keterangan |
|---|---|---|
| `unit` (A1–B5) | bebas 1–99 | Satuan jelas (per foto/slide/desain/set) |
| `website` (C1–C6) | qty terkunci = 1 | Satu proyek per baris; C6 tampil "Mulai dari" |
| `addon` (D1–D5) | bebas (D1/D2 per halaman; D3/D4/D5 = 1) | Bisa berdiri sendiri ATAU menempel paket website |
| `plan` (E1–E3) | qty = 1, maks 1 plan | Menambah plan lain otomatis mengganti (dengan konfirmasi UI) |

### 8.3 Perhitungan Total (Single Formula)
`Total = Σ(qty × harga_satuan) + harga_addon_multibahasa (jika ada & valid)`
- Semua perhitungan tampilan real-time di klien, TAPI total final **divalidasi ulang server-side** di `/api/checkout` (anti-tampering) — klien tidak pernah dipercaya untuk angka final.

### 8.4 Aturan Khusus Multi-Bahasa (D6) — KUNCI
- Harga = **35% × harga paket utama**, didefinisikan: *paket website (C1, C3, C4, C5, atau C6) dengan harga tertinggi yang ada di keranjang yang sama*.
- Jika D6 ada di keranjang **tanpa** paket website → tampil warning banner: "Add-on Multi-Bahasa harus bersama paket website" + tombol cepat "Tambah Landing Page" + tombol "Hapus add-on"; tombol checkout **disabled** hingga resolved.
- Untuk C6 (Custom App, harga "mulai dari"), basis 35% = Rp 5.000.000 (base price) dengan catatan "final menyesuaikan scope".

### 8.5 Perilaku UI Keranjang
- Badge kuantitas header & bottom-nav = total qty semua item.
- Perubahan qty teranimasi halus; total di-update real-time dengan format `Rp 1.234.500` (Intl.NumberFormat 'id-ID').
- Simpan keranjang lintas sesi (localStorage) + tombol "Kosongkan Keranjang".

---

## 9. FORM BRIEF KLIEN (SPESIFIKASI)

Lokasi: card "Brief Klien" pada halaman keranjang (mobile: di bawah ringkasan; desktop: kolom kanan sticky). Dikirim **bersamaan** dengan tombol checkout.

| Field | Wajib | Validasi | Placeholder/Help |
|---|---|---|---|
| Nama Lengkap | ✅ | min 3 char, max 60 | "cth: Rina Wulandari" |
| Nama Brand / Usaha | ✅ | min 2 char, max 60 | "cth: Kopi Senja Cirebon" |
| Catatan / Kebutuhan Khusus | Opsional | max 500 char | "Deadline, referensi gaya, target pasar, dsb." |
| *(honeypot tersembunyi)* | — | harus kosong | anti-bot |

- Error inline merah di bawah field; tombol checkout disabled saat invalid.
- Copy kepercayaan di bawah form: *"🔒 Data brief hanya dikirim ke WhatsApp resmi AlexPicture dan tidak disimpan di perangkat Anda."*

---

## 10. WHATSAPP GATEWAY (SPESIFIKASI TEKNIS)

### 10.1 Nomor Tujuan (DIPERBAIKI DARI BLUEPRINT)
> **WhatsApp resmi: `6288272876066`** (asal: 0882-7287-6066 — info kontak resmi).
> Placeholder `6281234567890` pada blueprint v2.0.0 **tidak digunakan**.
> Disimpan sebagai env var `NEXT_PUBLIC_WHATSAPP_NUMBER` (bukan hardcode).

### 10.2 Alur Checkout
1. Klien klik "Checkout via WhatsApp" → validasi form brief + resolve aturan §8.4.
2. `POST /api/checkout` dengan payload `{ items: [{slug, qty}], brief: {name, brand, notes?}, honeypot }` — **tanpa harga dari klien**.
3. Server: validasi honeypot & rate limit → lookup harga dari master data server → hitung total → generate order code `APM-YYMMDD-XXXX` → simpan Lead ke DB → susun pesan WhatsApp → respond `{ ok, orderCode, waUrl }`.
4. Klien: `window.open(waUrl, '_blank')` → navigasi ke `#/terima-kasih?order=APM-...`.
5. Bila `window.open` diblokir popup-blocker → fallback: tampilkan tombol besar "Buka WhatsApp" manual di halaman terima kasih (waUrl tetap tersedia).

### 10.3 Format Pesan WhatsApp (Template Server-Side)
```text
*PESANAN BARU — ALEXPICTURE MARKETPLACE*
_Order ID: APM-250115-4821_

*DATA KLIEN*
• Nama: {nama}
• Brand: {brand}
• Catatan: {notes atau "-"}

*RINCIAN PESANAN*
1. {qty}x {Nama Produk} ({satuan}) — Rp {subtotal}
2. ...

*TOTAL: Rp {total}*

Mohon konfirmasi ketersediaan & langkah selanjutnya. Terima kasih! 🙏
```
- Encoding: `*` tebal, baris baru `\n` → `%0A`, seluruh pesan di-escape (`encodeURIComponent` di server).
- Guard: jika item > 20 baris, ringkas jadi "{n} item lainnya" agar URL `wa.me` tidak melebihi batas panjang.

### 10.4 Pesan WhatsApp Cepat (Kontak Langsung)
Tombol WA (bottom-nav, topbar, footer, CTA) memakai template pendek:
`Halo AlexPicture! Saya ingin konsultasi kebutuhan kreatif untuk bisnis saya.`

---

## 11. SISTEM PROMOSI (FLASH SALE, BUNDLING, BADGE)

### 11.1 Badge Produk (otomatis dari master data)
- `Terlaris` — A2, A3, B1, C1 *(konfigurasi awal, KONFIRMASI)*
- `Best Value` — A5, C4
- `Populer` — E2 (Growth)
- `Mulai dari` — C6

### 11.2 Flash Sale Banner (Beranda)
- Countdown mingguan (reset tiap Senin 00.00 WIB), menampilkan 2–3 produk unggulan secara bergilir.
- **TIDAK mengubah harga satuan** (menjaga acceptance criteria akurasi harga) — fokus urgensi + highlight.

### 11.3 Promo Bundling (Usulan — KONFIRMASI HARGA SEBELUM BUILD)
| Bundle | Isi | Harga Normal | Harga Bundle (usulan) |
|---|---|---|---|
| Starter Branding Kit | A8 + A3 + A4 | Rp 60.000 | Rp 50.000 |
| Social Media Launch Pack | 6×A2 + 3×A4 + 1×B1 | Rp 155.000 | Rp 129.000 |
| UMKM Go Digital | C3 + 12×A2 + D4 (1 bln) | Rp 1.190.000 | Rp 999.000 |
- **Fallback bila belum dikonfirmasi**: tampilkan bundle tanpa diskon (emphasis "semua kebutuhan dalam satu kali order") — tidak ada angka yang bertentangan dengan dokumen resmi.

---

## 12. ARSITEKTUR DATA & SKEMA DATABASE

### 12.1 Prinsip
- **Katalog produk = static TypeScript data modules** (di `src/data/catalog.ts` dll.) — cepat, type-safe, tanpa roundtrip DB, dan jadi source of truth bersama PRD ini. (DB tidak dipakai untuk katalog di MVP.)
- **Database (Supabase PostgreSQL + Prisma)** hanya untuk **Lead logging** — memastikan tidak ada lead hilang walau pesan WA gagal terkirim, dan menyediakan fondasi admin dashboard Phase 2.

### 12.2 Model Data — `Lead`
| Field | Tipe | Catatan |
|---|---|---|
| id | String (cuid) | PK |
| code | String | unique — `APM-YYMMDD-XXXX` |
| customerName | String | Nama lengkap |
| brandName | String | Nama brand/usaha |
| notes | String? | Catatan brief |
| items | String (JSON) | `[{slug, name, qty, unitPrice, subtotal}]` |
| total | Int | Total final (server-computed) |
| status | Enum | `NEW`, `CONTACTED`, `DEAL`, `DONE`, `LOST` — default `NEW` |
| source | String? | UTM source/referrer (bila ada) |
| createdAt | DateTime | default now |

> Tidak ada tabel user, tidak ada data pembayaran, tidak ada kredensial klien — sesuai prinsip "tanpa penyimpanan data sensitif di sisi klien".

---

## 13. SPESIFIKASI API

Semua endpoint Next.js App Router route handler di bawah `/api` (bukan server action).

### 13.1 `POST /api/checkout`
- **Body**: `{ items: [{slug, qty}], brief: {name, brand, notes?}, honeypot }`
- **Proses**: rate limit (maks 5 req/IP/menit, in-memory) → honeypot check → validasi item & resolve harga server-side (termasuk aturan D6 §8.4) → buat order code → INSERT Lead → susun `waUrl`.
- **Response 200**: `{ ok: true, orderCode: "APM-250115-4821", waUrl: "https://wa.me/6288272876066?text=..." }`
- **Response 400**: `{ ok: false, error: "BRIEF_INVALID" | "ITEMS_EMPTY" | "MULTILANG_REQUIRES_WEBSITE" }`
- **Response 429**: rate limited.
- **Response 500**: gagal insert DB → **tetap kembalikan waUrl** (WA adalah kanal utama; log error ke console server). *Lead-loss prevention.*

### 13.2 `GET /api/health`
- `{ ok: true }` — smoke test pasca-deploy.

> Search, filter, sort, cart math — semuanya client-side (data katalog statis); tidak butuh endpoint produk.

---

## 14. DESIGN SYSTEM

### 14.1 Arah Visual
"Marketplace modern yang rapi + sentuhan agensi kreatif percaya diri." Bersih, banyak whitespace, kartu dengan radius lembut, CTA kontras tinggi.

### 14.2 Palet Warna (Tanpa biru/indigo — sesuai brand guideline teknis)
| Token | Nilai Tailwind | Penggunaan |
|---|---|---|
| Primary/Accent | **Amber 600** (`#D97706`) — hover Amber 700 | CTA utama, badge harga, highlight |
| Foreground utama | **Stone 900** | Teks, header gelap section |
| Background | White + **Stone 50/100** section selang-seling | Permukaan |
| Success | **Emerald 600** | Centang deliverable, konfirmasi |
| Destructive | **Red 600** | Hapus item, error |
| Dark canvas | Stone 900 + Stone 800 | Hero, CTA akhir, footer |
- Fokus aksesibilitas: kontras teks ≥ AA; tombol amber selalu dengan teks berkontras cukup.
- **Dark mode**: dukungan penuh via `next-themes` (toggle di header; default mengikuti sistem).

### 14.3 Tipografi
- Font: **Plus Jakarta Sans** (karya foundry Indonesia — selaras brand lokal) via `next/font`.
- Skala: Hero `text-4xl md:text-6xl font-bold` · H2 section `text-2xl md:text-3xl font-bold` · Body `text-sm md:text-base` · Harga `font-bold tabular-nums`.

### 14.4 Komponen UI (semua dari shadcn/ui — New York)
Button, Card, Badge, Input, Textarea, Label, Select, Sheet/Drawer (keranjang cepat & mobile menu), Dialog (lightbox & konfirmasi), Accordion (FAQ + tabel plan mobile), Tabs (PDP), Carousel (best seller + portofolio), Command (search suggestion), Toast/Sonner (feedback add-to-cart), Tooltip, ScrollArea, Separator, Progress (countdown).

### 14.5 Ikonografi & Imaging
- Lucide icons seluruhnya (tanpa emoji di UI komponen; emoji hanya di template pesan WA).
- Aset gambar: `next/image` + lazy loading; rasio konsisten (4:3 kartu produk, 1:1 mockup kategori, 16:9 hero).
- Sumber aset: **dibangkitkan via skill Image Generation saat build** (mockup feed IG, poster, logo pattern, thumbnail video, website mockup di device, hero collage). Tidak menampilkan wajah persona riil yang dapat diidentifikasi.

### 14.6 Motion
- Framer Motion: fade/slide section on-scroll (subtil, 150–300ms), hover lift kartu (`hover:-translate-y-0.5`), badge pulse tipis pada flash sale. Tidak ada animasi yang menghalangi interaksi > 300ms.

---

## 15. RESPONSIVE & MOBILE UX SPECIFICATION

### 15.1 Breakpoints
`base (≥360px) → sm 640 → md 768 → lg 1024 → xl 1280`. Desain ditulis mobile-first.

### 15.2 Perilaku Kunci
| Elemen | Mobile | Desktop |
|---|---|---|
| Navigasi | Bottom nav (fixed) + hamburger drawer untuk menu lengkap | Top bar + main header + mega menu |
| Search | Ikon search → sheet full-width dengan suggestion | Inline di header |
| PDP | Stack 1 kolom + sticky action bar di atas bottom-nav | 2 kolom, panel kanan sticky |
| Kartu katalog | Grid 2 kolom | Grid 4 kolom |
| Tabel plan retainer | Accordion per plan | Tabel perbandingan |
| Keranjang | 1 kolom, ringkasan sticky bawah | 2 kolom (item kiri, ringkasan+form kanan) |
| Touch target | ≥ 44×44px semua kontrol | standar |

### 15.3 Footer & Layout Root
- Root: `min-h-screen flex flex-col`; konten `flex-1`; footer `mt-auto` → menempel bawah saat konten pendek, terdorong alami saat panjang.
- Mobile: padding-bottom konten = tinggi bottom-nav + safe-area.

---

## 16. PWA REQUIREMENTS
- `manifest.json`: name "AlexPicture Marketplace", short_name "AlexPicture", display `standalone`, theme & background color sesuai design system, ikon 192/512 (+maskable).
- Meta: `apple-mobile-web-app-capable`, theme-color, description.
- Service worker: **opsional Phase 2** (MVP cukup installable + splash + ikon).
- Kualitas: Lighthouse PWA installable criteria terpenuhi.

---

## 17. SEO, STRUCTURED DATA & ANALYTICS

### 17.1 Meta & Indexing
- Title default: "AlexPicture Marketplace — Jasa Desain, Video & Website Profesional".
- Meta description, Open Graph, Twitter Card, favicon + og-image (generated).
- `robots.txt` allow-all; sitemap root.
- Meta title/description di-update per view via efek JS (keterbatasan hash-routing — dicatat sebagai tradeoff §5.1).

### 17.2 JSON-LD (di root layout)
- `Organization` + `LocalBusiness`: nama, alamat (Jl. Persil, Karyamulya, Kec. Kesambi, Kota Cirebon, Jawa Barat), telepon, email, openingHours (Mo–Sa 08:00–20:00).
- `WebSite` + potential SearchAction.
- `ItemList` berisi seluruh 26 produk dengan offer harga (membantu rich result marketplace).
- `FAQPage` (mirror konten FAQ).

### 17.3 Analytics & Tracking
- **Vercel Analytics** (zero-config) untuk traffic dasar.
- Event konversi internal (via log Lead + source/referrer) — tanpa dependency pihak ketiga di MVP.
- Meta Pixel: siap via env `NEXT_PUBLIC_META_PIXEL_ID` (kosong = tidak aktif) — opsional, karena produk menjual jasa Meta Ads, pixel sendiri adalah bukti praktik.

---

## 18. KEAMANAN, COMPLIANCE & PRIVASI

| Area | Kebijakan |
|---|---|
| Data klien | Nama/brand/catatan hanya dikirim ke API checkout → disimpan sebagai Lead (internal) + diteruskan ke WA. Tidak ada penyimpanan di browser selain keranjang non-sensitif. |
| Anti-tampering harga | Klien kirim slug+qty saja; harga & total dihitung server dari master data. |
| Rate limiting | 5 req/IP/menit pada `/api/checkout` (in-memory map + cleanup). |
| Anti-spam | Honeypot field wajib kosong. |
| Secrets | Semua token/credential hanya di **Vercel Environment Variables** — TIDAK PERNAH di-commit ke repo. |
| Token hygiene | Token Supabase/Vercel/GitHub yang telah dibagikan via chat wajib **di-rotate pemiliknya** setelah deployment. |
| UU PDP 27/2022 | Kebijakan Privasi eksplisit; hak akses/koreksi/hapus data via email resmi. |
| HTTPS | Default Vercel; semua URL aset relatif. |
| XSS | React escaping default; tanpa `dangerouslySetInnerHTML` untuk konten user. |

---

## 19. DEPLOYMENT RUNBOOK (GITHUB → SUPABASE → VERCEL)

### 19.1 Urutan Eksekusi Build (untuk agent)
1. **Build lokal** (sandbox): seluruh MVP di `src/app/page.tsx` + komponen view + API routes + Prisma schema + aset generated. Lint bersih, dev server jalan, verifikasi via agent-browser.
2. **Supabase**: gunakan access token (`sbp_…`) untuk query Management API → tempatkan project → ambil **connection string PostgreSQL** → set sebagai `DATABASE_URL` → `prisma db push` (membuat tabel Lead).
3. **GitHub**: repo target `disigitalku66-ops/alexpictre` — **hapus seluruh konten lama**, ganti dengan kode baru (force push via token `ghp_…`). Token digunakan hanya untuk operasi git remote, tidak pernah ditulis dalam file.
4. **Vercel**: deploy dari repo GitHub via token `vcp_…`; set Environment Variables: `DATABASE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER=6288272876066`, `NEXT_PUBLIC_META_PIXEL_ID` (opsional kosong). Verifikasi domain `*.vercel.app` + `/api/health`.
5. **Verifikasi pasca-deploy**: health check, klik-through alur cart → WA URL terbuka dengan pesan terformat, tabel Lead menerima baris baru.
6. **Handover**: sarankan rotate ketiga token + (opsional) custom domain `alexpicture.id`.

### 19.2 Catatan
- Jika Supabase project belum ada/bermasalah → fallback: deploy tetap berjalan dengan insert Lead di-bypass (log server-side saja, WA tetap jalan) supaya **website tetap live**, lalu DB disambungkan setelahnya.
- Nama repo tertulis `alexpictre` (tanpa "u") — akan dikonfirmasi ulang sebelum push; bukan blocker.

---

## 20. ACCEPTANCE CRITERIA

1. ✅ **Responsivitas sempurna**: mobile menyerupai aplikasi native (bottom nav + safe-area); desktop menyajikan mega menu; layout utuh dari 360px hingga 1920px.
2. ✅ **Akurasi data harga**: seluruh harga satuan, add-on, dan langganan 100% identik dengan §7 (dokumen bisnis resmi) — diverifikasi item-per-item saat review.
3. ✅ **Keamanan transaksional**: tanpa penyimpanan data sensitif klien di sisi browser; checkout via API server-side; total tervalidasi server; transaksi final terjadi di WhatsApp (E2EE).
4. ✅ **Nomor WA benar**: seluruh tombol/gateway mengarah ke `6288272876066` dari env var.
5. ✅ **Alur inti end-to-end**: beranda → katalog → PDP → tambah ke keranjang (multi-jenis) → brief form → checkout → WhatsApp terbuka dengan pesan terformat benar → halaman terima kasih dengan order code.
6. ✅ **Keranjang modular**: desain + video + website + add-on tercampur; total real-time; aturan multi-bahasa §8.4 berjalan.
7. ✅ **Footer sticky** bawah saat konten pendek; terdorong alami saat panjang; tidak menutupi bottom-nav mobile.
8. ✅ **PWA installable** + meta lengkap.
9. ✅ **Kualitas**: lint bersih; Lighthouse mobile ≥ 90 (Performance/SEO/A11y/BP); tanpa error console; hydratasi aman.
10. ✅ **Deployed**: live di Vercel + repo GitHub ter-replace penuh + Lead tercatat di Supabase.
11. ✅ **Aksesibilitas**: semantic landmarks, aria label pada nav/badge, keyboard navigabel, alt text semua gambar.
12. ✅ **Bahasa**: seluruh copy UI Bahasa Indonesia profesional; format harga `Rp` id-ID.

---

## 21. RISIKO & MITIGASI

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Nomor WA salah di produksi | Fatal — semua lead hilang | Single source env var + verifikasi klik riil saat review + smoke test pasca-deploy |
| Token terekspos di chat/percakapan | Keamanan akun | Hanya via env vars; tidak pernah di-commit; instruksi rotate di handover |
| Popup blocker menghalangi `window.open` WA | Gagal buka chat | Fallback tombol manual di halaman terima kasih |
| URL wa.me terpotong (pesan panjang) | Pesan rusak | Ringkas item > 20 baris; format kompak |
| Harga dimanipulasi klien | Kerugian finansial | Server-side pricing; klien hanya kirim slug+qty |
| Supabase provisioning gagal saat deploy | Lead tak tercatat | Fallback no-DB (§19.2); WA tetap berfungsi |
| Hash-routing membatasi SEO | Traffic organik rendah jangka panjang | Roadmap Phase 2 migrasi route fisik; JSON-LD + meta optimal di MVP |
| Aset portofolio belum ada karya riil | Persepsi kualitas | Mockup profesional generated + label "contoh karya"; slot mudah diganti karya riil |
| Spam lead bot | Beban operasional | Honeypot + rate limit |
| Kebingungan C1 vs C2 (harga 7x lipat) | Frustasi klien / komplain | Pelabelan tegas + tabel perbandingan di PDP masing-masing |

---

## 22. KEPUTUSAN DESAIN TERKUNCI & PERTANYAAN TERBUKA

### 22.1 Keputusan Terkunci (diambil untuk build)
| # | Keputusan | Alasan |
|---|---|---|
| D1 | Nomor WA = `6288272876066` (env var) | Koreksi placeholder blueprint |
| D2 | SPA hash-routing dalam route `/` | Sesuai blueprint "SPA multi-halaman mulus" + kompatibel sandbox & Vercel |
| D3 | Katalog statis (TS modules), DB hanya Lead | Performa + kesederhanaan; admin Phase 2 |
| D4 | Total dihitung server-side | Anti-tampering |
| D5 | Palet Amber + Stone (tanpa biru/indigo) | Brand guideline teknis + karakter kreatif hangat |
| D6 | Font Plus Jakarta Sans | Identitas lokal + keterbacaan modern |
| D7 | Halaman baru: Portofolio, Tentang, FAQ, Legal, Terima Kasih | Kelengkapan trust + kepatuhan UU PDP |
| D8 | Plan retainer masuk keranjang (maks 1) | Konsisten "Multi-Checkout Modular" |
| D9 | Catatan brief opsional (nama & brand wajib) | Menurunkan abandonment; detail bisa lanjut di chat WA |
| D10 | Multi-bahasa = 35% × paket website termahal di keranjang | Interpretasi rasional "paket utama" |
| D11 | Dual-rail pembayaran: WA + transfer bank di MVP; payment link (Midtrans/Xendit) Fase 2 | Rekonsiliasi naskah WhatsApp-only vs kebutuhan payment integration (lihat PDF Bab 10) |
| D12 | For You berbasis aturan; Pesanan Saya (localStorage) + Lacak Pesanan tanpa login | Personalisasi & order history tanpa kompleksitas akun |

### 22.2 Pertanyaan Terbuka (jawaban bisa saat build berjalan — tidak memblokir)
| # | Pertanyaan | Default bila tidak dijawab |
|---|---|---|
| Q1 | Harga bundle §11.3 disetujui? | Tampilkan tanpa diskon (fallback) |
| Q2 | Testimoni riil (nama/usaha/quote) tersedia? | 3 placeholder netral bertanda KONFIRMASI |
| Q3 | Link sosial media resmi (IG/TikTok/FB)? | Ikon disembunyikan |
| Q4 | Custom domain `alexpicture.id` diarahkan ke Vercel? | Pakai `*.vercel.app` |
| Q5 | Rating bintang dekoratif di PDP diperbolehkan? | Tidak ditampilkan (murni kredibilitas riil) |
| Q6 | Nama repo `alexpictre` benar (tanpa "u")? | Ikuti sesuai permintaan |
| Q7 | Nomor rekening tambahan (BCA/BRI) untuk alternatif transfer? | Hanya Mandiri sesuai data |
| Q8 | Rail B (payment link) diinginkan segera setelah MVP? | Fase 2, setelah volume lead stabil (mis. 30+ pesanan/bulan) |

---

## 23. ROADMAP PASCA-MVP

| Fase | Fitur | Nilai |
|---|---|---|
| **Phase 2a — Operasional** | Admin dashboard lead (status pipeline, notifikasi lead baru), voucher diskon server-side, newsletter capture | Efisiensi internal & repeat order |
| **Phase 2b — Growth/SEO** | Migrasi hash → route fisik Next.js per halaman, blog/artikel, hreflang ID/EN, case study pages | Traffic organik |
| **Phase 2c — Produk** | PWA offline catalog, kalkulator quote Custom App interaktif, sistem review & rating klien riil, multi-currency | Konversi & pengalaman |
| **Phase 3 — Skala** | Portal klien (progress order & file delivery), API partner/white-label | Retensi B2B |

---

## 24. LAMPIRAN: DATA BISNIS & ASET

### 24.1 Informasi Resmi
| Item | Nilai |
|---|---|
| Nama Brand | AlexPicture. (wordmark, titik amber) |
| Alamat | Jl. Persil, Karyamulya, Kec. Kesambi, Kota Cirebon, Jawa Barat |
| Jam Operasional | Senin–Sabtu, 08.00–20.00 WIB |
| WhatsApp | 0882-7287-6066 → internasional `6288272876066` |
| Email | halo@alexpicture.id |
| Bank Transfer | Bank Mandiri · No. 1340028200532 · a.n. Ana Solehata |

### 24.2 Kebutuhan Aset Visual (dibangkitkan saat build)
1. Hero collage (mockup multi-layanan) — 1
2. Ilustrasi/ikon kategori 5 (desain, video, web, add-on, langganan)
3. Mockup kartu produk per kategori (≥ 8 variasi)
4. Mockup portofolio (feed IG, carousel, poster, banner, logo, menu, landing page di laptop/HP, e-commerce, thumbnail video) — 12–16
5. og-image + favicon/ikon PWA (192, 512, maskable)
6. Background pattern section CTA (opsional)

### 24.3 Glosarium
- **PDP** — Product Detail Page; **AOV** — Average Order Value; **SLA** — Service Level Agreement; **Brief** — ringkasan kebutuhan klien; **Retainer** — paket langganan bulanan; **Lead** — calon pesanan yang masuk; **WA** — WhatsApp.

---

*Dokumen ini adalah kontrak build. Setiap penyimpangan selama implementasi wajib dicatat di worklog dengan alasan. — AlexPicture Marketplace PRD v2.1.0*

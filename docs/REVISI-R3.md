# REVISI R3 — Home, Navigasi & Copywriting (Advisory, Tanpa Kode)

**Status:** Usulan koreksi & keputusan — MENUNGGU PERSETUJUAN USER
**Tanggal:** Sesi R3
**Basis review:** Kode produksi aktual di `src/` (home-page, site-header, site-footer, product-card, bottom-nav, newsletter, catalog.ts)
**Aturan:** Tidak ada kode ditulis pada sesi ini. Dokumen ini = rekomendasi.

---

## A. RINGKASAN PENILAIAN

Revisi R3 adalah **upgrade besar untuk kualitas copy**: lebih natural, berorientasi kebutuhan
pelanggan, dan menghapus jargon internal ("Pilihan Editor", "Retainer"). Namun ada **7 temuan
kritis** yang harus diputuskan sebelum implementasi karena menyangkut konsistensi bahasa,
taksonomi data, dan janji fitur yang belum ada.

Klasifikasi 13 poin user:
- ✅ **Setuju langsung** (5): poin 2 (ikon WA resmi), 6 (placeholder search), 10 (hapus bank di
  footer), 11 (2 panel promo), 13 (footer deskripsi).
- ✅ **Setuju + koreksi kecil** (4): poin 3 (hero), 4 (anchor harga), 5 (CTA & tags), 12 (untuk kamu).
- ⚠️ **Butuh keputusan sebelum dieksekusi** (4): poin 1 (label "Home" & "Shop"), 8 (kartu 04 "Ad
  Creative" & kartu 05 "Paket Bisnis"), 9 (quick brief vs langsung WA), 12b (search artikel tanpa blog).

---

## B. FEEDBACK PER POIN

### Poin 1 — Navbar & Mega Menu
Struktur user: `Home (dropdown 5 kategori) · Shop · Tentang · Portofolio · Lacak Pesanan · Kontak · Chat WhatsApp`

**Masalah:**
1. **Label "Home" untuk mega menu keliru secara UX.** "Home" = beranda di konvensi universal.
   Dropdown kategori sebaiknya berlabel **"Layanan"** (selaras dengan CTA hero baru "Lihat Layanan")
   atau "Kategori". Beranda tetap diakses via logo (pola Amazon/Tokopedia).
2. **"Shop" berbahasa Inggris sendirian** di antara menu Indonesia. Rekomendasi: **"Katalog"**
   (audiens = pengguna Tokopedia/Shopee). Kalau ingin kesan premium, boleh "Shop", tapi harus
   konsisten dengan keputusan register bahasa (lihat Temuan #2).
3. **"Kontak" tidak punya halaman.** Solusi ringan: anchor scroll ke blok kontak footer
   (`id="kontak"`), tanpa halaman baru. WA pill sudah menjadi kanal kontak utama.
4. **FAQ hilang dari nav** (daftar user tidak memuatnya) — masih aman: FAQ ada di topbar
   ("Bantuan & FAQ") dan footer (kolom Jelajahi).
5. **3 nama untuk 1 hal:** "Paket Bulanan" (nav user) vs "Paket Retainer" (nav saat ini) vs
   "Retainer Bulanan" (data kategori). → **Standarisasi: "Paket Bulanan"** di seluruh UI.

**Rekomendasi struktur final (desktop):**
```
[Logo] [Search..................] [❤] [🌙] [🛒]
Nav row: Layanan ▾ (mega menu) · Katalog · Portofolio · Lacak Pesanan · Tentang · Kontak    [Chat WhatsApp]
```
Mega menu "Layanan" = 5 kolom bergambar (Desain, Video Komersial, Website, Add-on, Paket
Bulanan), tiap kolom: gambar kategori (aset `cat-*.png` sudah ada — reuse), 4–6 layanan teratas
+ link "Lihat Semua". Mobile: tetap Sheet drawer + bottom nav (tidak berubah).

### Poin 2 — Ikon WhatsApp Resmi ✅ SETUJU
- Ganti Lucide `MessageCircle` → glyph resmi WhatsApp (SVG path simple-icons, lisensi CC0).
- Buat 1 komponen bersama `WhatsAppIcon` — dipakai di 7 titik: (1) pill nav desktop, (2) tombol
  drawer mobile, (3) tab bottom nav, (4) tombol CTA akhir, (5) kontak footer, (6) tombol quick
  brief di product card (baru), (7) panel promo bila diperlukan.
- Warna: **WA green #25D366** untuk tombol CTA utama (instan dikenali); emerald-600 boleh
  dipertahankan bila ingin konsisten design system. Default: #25D366.

### Poin 3 — Copy Hero ✅ SETUJU + POLISH
- Eyebrow: "Jasa Layanan Digital Kreatif" ✅
- H1 EN: "Creative Services for Growing Businesses." — boleh (pola lazim agensi kreatif ID,
  kesan premium). Alternatif ID bila mau: "Layanan Kreatif untuk Bisnis yang Bertumbuh."
  **Catatan SEO:** keyword "marketplace jasa kreatif" hilang dari H1 → pertahankan di meta title
  dan/atau eyebrow agar tidak kehilangan sinyal pencarian.
- Subheadline: versus user sedikit bertele di akhir. Polish rekomendasi (perubahan minimal):
  > "Layanan desain grafis, pembuatan website, dan video komersial untuk membantu bisnis tampil
  > lebih profesional dengan materi pemasaran yang siap digunakan."

### Poin 4 — "Harga Transparan" → Anchor Harga ✅ SETUJU + POLISH
- Fakta: item termurah = Foto Produk Rp10.000/foto → klaim "mulai 10 ribuan" **akurat**. ✅
- Kartu USP 1 jadi: **Judul "Harga Mulai 10 Riban"** / **Desc "Harga tampil jelas sejak awal —
  tanpa biaya tersembunyi."** (anchor + USP asli tetap hidup, tidak saling meniadakan).
- Risiko kecil: anchor rendah menarik lead harga-mur — mitigasi cukup karena transparansi memang
  pilar brand, dan harga tinggi (web 700rb–5jt) tetap tampil di katalog.

### Poin 5 — CTA Hero & Small Tags ✅ SETUJU + 2 KOREKSI
- "Jelajahi Katalog" → **"Lihat Layanan"** ✅ (target tetap `#/katalog`).
- "Lihat Paket Retainer" → **"Lihat Portofolio"** ⚠️ **ejaan wajib "Portofolio"** (KBBI, dan sudah
  dipakai nav/footer/judul halaman saat ini). "Portfolio" tidak boleh muncul di UI.
- Konsekuensi: retainer kehilangan tempat di hero → masih tercakup aman di mega menu, kartu 05,
  dan panel promo kiri. ✅
- Small tags baru: Desain Grafis / Website / Video Komersial / Ad Creative. Rekomendasi: jadikan
  **chips yang bisa diklik** → 3 kategori + 1 koleksi "Ad Creative" (lihat Temuan #4).
- Chips lama memuat bukti sosial ("26 layanan, 5 kategori") → pindahkan angka itu ke subjudul
  seksi kategori (mis. "Pilih dari 26 layanan…") supaya proof point tidak hilang.

### Poin 6 — Placeholder Search ✅ SETUJU
"Cari layanan desain, website, atau video..." — lebih pendek dan natural. (Opsional: "Cari
layanan… desain, website, atau video" agar konsisten gaya elipsis.)

### Poin 7 — Judul Seksi Kategori ✅ SETUJU + POLISH
- "Belanja per Kategori" → **"Layanan Kreatif"** ✅
- Subjudul user: "Pilih layanan yang Anda butuhkan untuk mengembangkan tampilan dan kebutuhan
  pemasaran bisnis." — redundan ("mengembangkan tampilan dan kebutuhan"). Polish:
  > "Pilih layanan untuk mengembangkan tampilan dan pemasaran bisnis Anda."

### Poin 8 — 5 Kartu Kategori ⚠️ 2 KARTU BERMASALAH
Kartu 01–03: judulnya **sudah persis sama** dengan nama kategori di master data
("Desain & Branding", "Video Komersial", "Website & Web Apps") → hanya ganti blurb + tambah CTA. Mudah.

- **Kartu 01:** copy user menyebut **"kemasan"** — TIDAK ADA produk desain kemasan di katalog
  (A1–A9: foto produk, feed, carousel, cover story, Meta ads, poster, banner, logo, menu digital).
  Solusi: hapus kata "kemasan" → "Logo, identitas visual, materi media sosial, dan berbagai
  kebutuhan desain bisnis." (Catatan: "sosial media" → **"media sosial"** sesuai KBBI.) Kalau
  memang ingin jual desain kemasan → daftar sebagai produk backlog.
- **Kartu 04 "Ad Creative":** BUKAN kategori di master data. Solusi: buat konsep ringan
  **"koleksi"** (cross-category): A5 Meta Ads + B1 UGC 20s + B2 UGC 30s + B3 TV AD 30s + B4 TV
  AD 40s (default 5 item). Tambah pemetaan kecil di catalog.ts — bukan perombakan skema.
- **Kartu 05 "Paket Bisnis":** copy user "Kombinasi desain, website, dan video" — **TIDAK AKURAT**
  untuk retainer (paket bulanan tidak termasuk website; website adalah proyek sekali jadi).
  Dua jalur: (a) **perbaiki copy** + selaraskan judul jadi "Paket Bulanan": "Kuota desain, video,
  dan materi iklan setiap bulan — dalam satu paket langganan." (b) atau benar-benar buat produk
  bundle baru "Paket Bisnis" (logo + landing page + video) — mesin bundling `BUNDLE_DEALS` sudah
  ada, jadi layak jadi **backlog**, bukan blokir R3.
- **Add-on kehilangan kartu homepage** (kartu hanya 5, Add-on tidak masuk) → wajar: add-on adalah
  produk upsell, tetap terjangkau via mega menu + katalog + cross-sell. Disetujui.
- CTA per kartu: "Lihat Layanan" ×4 + kartu 05 **"Lihat Paket"** → sarankan "Lihat Paket Bulanan"
  (lebih spesifik). Pertahankan baris jumlah layanan ("X layanan") sebagai proof point.

### Poin 9 — "Pilihan Editor" → "Pilihan Layanan" + Tombol WA di Kartu ⚠️ PERLU DEFINE
- Judul **"Pilihan Layanan"** + link "Lihat Semua →" ✅.
- Subjudul user ("Layanan yang dapat disesuaikan…") tidak nyambung dengan isi seksi (produk
  terlaris). Polish yang menggabungkan keduanya:
  > "Layanan terlaris & nilai terbaik — dapat disesuaikan dengan kebutuhan bisnis Anda."
- Badge "Terlaris" / "Best Value" **sudah ada di data** (BadgeId terlaris/best-value) — tinggal
  pastikan item POPULAR_SLUGS yang tampil membawanya. ✅ tanpa perubahan skema.
- Tombol WA di product card → "muncul ke form brief": interpretasi terbaik = **Quick Brief Sheet**:
  klik ikon WA → sheet mini (nama, kebutuhan singkat, deadline opsional) → tombol "Kirim via
  WhatsApp" → buka wa.me dengan pesan terisi otomatis (nama produk + kode + harga + label
  [Quick Brief]). V1 **tanpa tulis DB** (percakapan WA = catatan lead; ukur dulu volume).
- Penempatan UI: ikon WA kecil di kartu produk (pojok, `stopPropagation` agar tidak bentrok
  dengan klik kartu → detail). Berlaku di SEMUA kartu (home + katalog) untuk konsistensi.
- Alternatif lebih murah: tombol langsung buka wa.me dengan template "Halo, saya tertarik dengan
  [produk]…". Kurang terstruktur, tapi zero UI baru. Default: Quick Brief Sheet.

### Poin 10 — Hapus Transfer Bank di Footer ✅ SETUJU
Aman — info rekening tetap ada di halaman Terima Kasih (dengan tombol salin), FAQ, dan S&K.
Footer memang tempat yang salah untuk instruksi pembayaran.

### Poin 11 — Dua Panel Promo ✅ SETUJU + DEFINE TARGET CTA
- Panel kiri (✦, "Butuh Konten untuk Sebulan?" → "Lihat Paket Bulanan →") → `#/langganan`. ✅
- Panel kanan (↗, "Punya Website yang Ingin Dibuat?" → **"Mulai Konsultasi →"**) — audiens berubah
  dari migrasi (panel lama) ke website baru. CTA paling pas: buka **Quick Brief preset "website"**
  (atau wa.me template konsultasi website). Ikon ✦/↗ → pakai Lucide `Sparkles` / `ArrowUpRight`
  agar konsisten design system.
- Layanan migrasi konten kehilangan panggung → tidak masalah, tetap di katalog & kategori Add-on.

### Poin 12 — "Untuk Kamu" → "Layanan untuk Kebutuhan Anda" ✅ SETUJU + TRADEOFF
- 4 kartu kebutuhan (brand, sosial media, website, promosi) + CTA "Konsultasikan" ✅ copy bagus.
- **Tradeoff:** mengganti mesin rekomendasi rule-based (wishlist/keranjang/view-scoring, PRD
  §11.4) dengan kartu statis. Pendapat kami: **setuju diganti** — dua seksi "produk terlaris" +
  "rekomendasi personal" memang tumpang tindih; kartu kebutuhan lebih jelas untuk pengunjung
  baru. Engine skor view tetap di kode (dipakai wishlist), bisa dihidupkan lagi nanti.
- CTA tiap kartu: Quick Brief/WA dengan **pesan prefill berbeda per kartu** (intent brand/feed/
  website/iklan). Kartu sebaiknya juga punya link sekunder ke koleksi terkait (opsional).

### Poin 12b — Strip "Tips Kreatif & Inspirasi Bisnis" ⚠️ SEARCH ARTIKEL TANPA BLOG
- **Fakta:** TIDAK ADA blog/artikel di produk. Search "Cari artikel..." yang menghasilkan kosong
  = janji palsu, merusak kepercayaan pada hari pertama.
- **Fakta baik:** komponen newsletter SUDAH ADA (`NewsletterStrip`) — input + tombol, copy "Tips
  kreatif & promo spesial". Struktur user (judul + deskripsi + input + tombol) persis cocok bila
  inputnya = email.
- **Rekomendasi default:** pertahankan newsletter, ganti copy: judul **"Tips Kreatif & Inspirasi
  Bisnis"**, deskripsi versi user, placeholder email, tombol **"Langganan"** (bukan "Cari").
  Blog + search artikel = backlog, syarat minimal 8–10 artikel nyata dulu.

### Poin 13 — Footer ✅ SETUJU
Deskripsi baru menggantikan tagline panjang ✅ + hapus blok bank (poin 10) ✅. Pertahankan
alamat, jam, kontak, kolom Jelajahi/Layanan. Tambah `id="kontak"` di kolom kontak (untuk nav
"Kontak").

---

## C. TEMUAN KRITIS (HAL YANG BELUM DIPERTIMBANGKAN)

1. **"Home" bukan label mega menu** → "Layanan". Home = beranda (logo/tautan terpisah).
2. **Register bahasa campur:** copy baru semua "Anda", tapi kode masih "kamu/-mu"
   ("Bisnismu", "kebutuhanmu", "wishlist-mu", "Email kamu…"). → Sweep global ke "Anda".
3. **Ejaan:** "Portfolio" (user) vs "Portofolio" (existing, KBBI) → wajib "Portofolio".
   Juga "sosial media" → "media sosial".
4. **Taksonomi ganda:** label kartu baru (Ad Creative, Paket Bisnis) vs 5 kategori master data
   (desain/video/website/addon/retainer). → Kategori tetap 5; tambah "koleksi" ringan untuk Ad
   Creative; retainer di-rebrand "Paket Bulanan" di semua UI.
5. **Janji tanpa isi:** search artikel tanpa blog (poin 12b) — jangan rilis.
6. **Akurasi klaim produk:** "kemasan" (tidak ada produknya), "kombinasi website" di paket
   bulanan (tidak termasuk) — copy wajib akurat atau bikin produknya.
7. **SEO:** H1 bahasa Inggris menghapus keyword ID dari headline → pertahankan "marketplace jasa
   kreatif" di meta title + eyebrow.

---

## D. TABEL KEPUTUSAN (DEFAULT AMAN — SIAP "LANJUT")

| ID | Keputusan | Default yang disarankan |
|----|-----------|------------------------|
| D-R3-01 | Label parent mega menu | **"Layanan"** (bukan "Home"); beranda via logo |
| D-R3-02 | Label menu toko | **"Katalog"** (register Indonesia) |
| D-R3-03 | Register bahasa global | **"Anda"** — sweep semua "-mu/kamu" |
| D-R3-04 | Ejaan | **"Portofolio"**, **"media sosial"** |
| D-R3-05 | Istilah retainer di UI | **"Paket Bulanan"** di nav, kartu 05, footer, promo |
| D-R3-06 | Kartu 05 | Judul "Paket Bulanan", copy akurat; bundle "Paket Bisnis" = backlog via BUNDLE_DEALS |
| D-R3-07 | Ad Creative | Koleksi cross-category: A5 + B1 + B2 + B3 + B4 |
| D-R3-08 | Chips hero | Klik → kategori desain/website/video + koleksi Ad Creative |
| D-R3-09 | Tombol WA di kartu produk | Quick Brief Sheet (nama/kebutuhan/deadline) → wa.me prefill; v1 tanpa DB |
| D-R3-10 | Strip sebelum footer | Newsletter (bukan search artikel); copy baru user |
| D-R3-11 | Nav "Kontak" | Anchor scroll ke footer `#kontak` (tanpa halaman baru) |
| D-R3-12 | Subjudul Pilihan Layanan | "Layanan terlaris & nilai terbaik — dapat disesuaikan dengan kebutuhan bisnis Anda." |
| D-R3-13 | Panel kanan CTA | Quick Brief preset website / wa.me template konsultasi |
| D-R3-14 | Ikon & warna WA | Glyph resmi simple-icons; tombol utama #25D366 |
| D-R3-15 | Kartu 01 | Hapus "kemasan" (atau backlog produk kemasan) |
| D-R3-16 | Untuk Kamu | Diganti 4 kartu kebutuhan statis; engine personalisasi disimpan di kode |

---

## E. DAMPAK IMPLEMENTASI (SETUJU → EKSEKUSI)

**File yang berubah:**
- `site-header.tsx` — nav row baru (1 mega menu "Layanan" 5 kolom bergambar), Katalog, Kontak
  anchor, ikon WA resmi, placeholder search, sweep drawer mobile
- `home-page.tsx` — USP kartu 1, hero (eyebrow/H1/sub/CTA/chips), seksi kategori (judul+blurb+CTA
  per kartu), Pilihan Layanan, 2 panel promo baru, Untuk Anda (4 kartu kebutuhan), CTA akhir
- `site-footer.tsx` — hapus blok bank, deskripsi brand baru, `id="kontak"`
- `newsletter.tsx` — judul & deskripsi baru
- `product-card.tsx` — tombol quick brief (ikon WA resmi)
- `catalog.ts` — + COLLECTIONS (Ad Creative), rebrand display "Paket Bulanan", blurb kategori

**Komponen baru:** `whatsapp-icon.tsx` (glyph resmi), `quick-brief-sheet.tsx` (form → wa.me).

**Tidak berubah:** Deals Hari Ini, Baru di AlexPicture, floating card hero, semua harga &
deliverable master data, halaman lain (katalog/produk/keranjang/lacak/portofolio/dll).

**Urutan kerja:** implementasi R3 → lint + verifikasi browser → **baru lanjut Runbook §19**
(GitHub → Vercel → Supabase) agar deploy sekali dengan copy final.

Estimasi: 1 sesi build (medium). Semua aset gambar kategori sudah ada (reuse `cat-*.png`).

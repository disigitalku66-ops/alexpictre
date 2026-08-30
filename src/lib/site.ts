// AlexPicture Marketplace — Konstanta Bisnis (PRD v3.0 §24.1)
// Satu-satunya sumber data kontak & legal untuk seluruh UI.

export const SITE = {
  name: "AlexPicture",
  fullName: "AlexPicture Marketplace",
  tagline: "Mitra produksi kreatif berstandar industri",
  description:
    "Jasa desain grafis, video komersial, website full-stack & web apps custom, add-on, dan paket retainer bulanan — harga transparan ala marketplace, kualitas ala agensi.",
  address: "Jl. Persil, Karyamulya, Kec. Kesambi, Kota Cirebon, Jawa Barat",
  hours: "Senin–Sabtu, 08.00–20.00 WIB",
  hoursShort: "Sen–Sab 08.00–20.00 WIB",
  phoneIntl: "6288272876066", // WhatsApp resmi (asal 0882-7287-6066) — PRD §10.1
  phoneDisplay: "0882-7287-6066",
  email: "halo@alexpicture.id",
  bank: {
    name: "Bank Mandiri",
    account: "1340028200532",
    holder: "Ana Solehata",
  },
  city: "Cirebon",
} as const;

export const NAV_LINKS = [
  { to: "/katalog", label: "Katalog" },
  { to: "/langganan", label: "Paket Bulanan" },
  { to: "/portofolio", label: "Portofolio" },
  { to: "/lacak-pesanan", label: "Lacak Pesanan" },
  { to: "/faq", label: "FAQ" },
  { to: "/tentang", label: "Tentang" },
] as const;

import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { CATALOG, CATEGORIES, formatIDR } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alexpictre.vercel.app"),
  title: {
    default: "AlexPicture — Desain, Website & Video untuk Bisnis",
    template: "%s | AlexPicture",
  },
  description: SITE.description,
  keywords: [
    "jasa desain grafis",
    "jasa video iklan",
    "jasa website",
    "landing page",
    "e-commerce",
    "retainer konten",
    "AlexPicture",
    "Cirebon",
  ],
  authors: [{ name: SITE.name }],
  manifest: "/manifest.json",
  openGraph: {
    title: "AlexPicture — Desain, Website & Video untuk Bisnis",
    description: SITE.description,
    siteName: SITE.fullName,
    type: "website",
    locale: "id_ID",
    images: [{ url: "/images/hero-collage.png", width: 1344, height: 768, alt: "Contoh layanan desain, website, dan video AlexPicture" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AlexPicture — Desain, Website & Video untuk Bisnis",
    description: SITE.description,
  },
  appleWebApp: {
    capable: true,
    title: SITE.name,
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#D97706" },
    { media: "(prefers-color-scheme: dark)", color: "#1C1917" },
  ],
  width: "device-width",
  initialScale: 1,
};

// ---------- JSON-LD (PRD §17.2) ----------
function buildJsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.fullName,
    url: "https://alexpicture.id",
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Persil, Karyamulya, Kec. Kesambi",
      addressLocality: "Kota Cirebon",
      addressRegion: "Jawa Barat",
      addressCountry: "ID",
    },
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.fullName,
    image: "/images/hero-collage.png",
    email: SITE.email,
    telephone: `+${SITE.phoneIntl}`,
    priceRange: "Rp 10.000 - Rp 3.500.000",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Persil, Karyamulya, Kec. Kesambi",
      addressLocality: "Kota Cirebon",
      addressRegion: "Jawa Barat",
      addressCountry: "ID",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "20:00",
      },
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.fullName,
    url: "https://alexpicture.id",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://alexpicture.id/#/katalog?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Katalog Layanan AlexPicture",
    numberOfItems: CATALOG.length,
    itemListElement: CATALOG.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: item.name,
        description: item.short,
        serviceType: CATEGORIES.find((c) => c.id === item.category)?.name || item.category,
        offers: {
          "@type": "Offer",
          price: item.price,
          priceCurrency: "IDR",
          description: item.price === 0 ? "35% dari paket website" : formatIDR(item.price),
        },
      },
    })),
  };

  return { organization, localBusiness, website, itemList };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = buildJsonLd();
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${jakarta.variable} font-sans antialiased bg-background text-foreground`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.organization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.localBusiness) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.website) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.itemList) }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster richColors position="top-center" closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}

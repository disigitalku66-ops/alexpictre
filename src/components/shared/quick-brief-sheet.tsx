"use client";

// ============================================================
// QUICK BRIEF SHEET — form brief cepat → WhatsApp (R3 / D-R3-09)
// Dipicu dari: tombol WA di kartu produk, kartu kebutuhan di
// beranda, panel promo "Mulai Konsultasi". V1 tanpa tulis DB —
// percakapan WA menjadi catatan lead.
// ============================================================

import { useState } from "react";
import { CalendarClock, MessageSquareText, Store, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Img } from "@/components/shared/img";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { useBriefStore, type BriefIntent } from "@/lib/brief-store";
import { formatIDR, getItem } from "@/lib/catalog";
import { waUrlFromMessage } from "@/lib/whatsapp";

const INTENTS: Record<BriefIntent, { title: string; desc: string; placeholder: string }> = {
  umum: {
    title: "Konsultasi Kebutuhan",
    desc: "Ceritakan kebutuhan kreatif bisnis Anda — kami bantu memilih layanan yang paling sesuai.",
    placeholder: "Contoh: Saya butuh materi promo untuk launching produk bulan depan…",
  },
  brand: {
    title: "Konsultasi Desain & Branding",
    desc: "Mulai dari logo, identitas visual, hingga materi promosi.",
    placeholder: "Contoh: Saya ingin memperbarui logo dan identitas brand kami…",
  },
  social: {
    title: "Konsultasi Konten Media Sosial",
    desc: "Siapkan desain konten yang konsisten dan mudah digunakan.",
    placeholder: "Contoh: Saya butuh desain feed IG rutin setiap bulan…",
  },
  website: {
    title: "Konsultasi Website",
    desc: "Ceritakan kebutuhan Anda — kami bantu mengubahnya menjadi website yang siap digunakan.",
    placeholder: "Contoh: Saya ingin membuat landing page untuk produk baru…",
  },
  promo: {
    title: "Konsultasi Iklan & Promosi",
    desc: "Gunakan video dan materi iklan yang lebih menarik.",
    placeholder: "Contoh: Saya butuh video iklan untuk Meta Ads…",
  },
};

function BriefForm({ slug, intent, onDone }: {
  slug?: string;
  intent: BriefIntent;
  onDone: () => void;
}) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [need, setNeed] = useState("");
  const [deadline, setDeadline] = useState("");

  const item = slug ? getItem(slug) : undefined;
  const meta = INTENTS[intent];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    const keb = need.trim();
    if (n.length < 2) {
      toast.error("Mohon isi nama Anda terlebih dahulu");
      return;
    }
    if (keb.length < 5) {
      toast.error("Ceritakan kebutuhan Anda (minimal 5 karakter)");
      return;
    }

    const lines = [
      "*QUICK BRIEF — ALEXPICTURE*",
      `• Nama: ${n}`,
      `• Brand: ${brand.trim() || "-"}`,
    ];
    if (item) {
      lines.push(`• Layanan: ${item.name} (${item.code}) — ${item.price === 0 ? "35% paket web" : formatIDR(item.price)}`);
    }
    lines.push(`• Kebutuhan: ${keb}`);
    if (deadline.trim()) lines.push(`• Target selesai: ${deadline.trim()}`);
    lines.push("", "Mohon info langkah selanjutnya. Terima kasih!");

    window.open(waUrlFromMessage(lines.join("\n")), "_blank", "noopener,noreferrer");
    toast.success("Brief Anda disiapkan", {
      description: "Selesaikan pengiriman di tab WhatsApp yang terbuka.",
    });
    onDone();
  }

  return (
    <form onSubmit={submit} className="flex flex-1 flex-col overflow-y-auto scrollbar-slim p-4 pt-2">
      {/* Konteks layanan (bila dipicu dari kartu produk) */}
      {item && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border bg-card p-3">
          <Img src={item.image} alt={item.name} ratio="1/1" className="h-14 w-14 shrink-0 rounded-lg" sizes="56px" />
          <div className="min-w-0">
            <p className="line-clamp-1 text-sm font-semibold text-foreground">{item.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {item.code} · {item.unit}
            </p>
            <p className="mt-0.5 text-sm font-bold tabular-nums text-primary">
              {item.price === 0 ? "35% paket web" : formatIDR(item.price)}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="brief-name">
            Nama Anda <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              id="brief-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="cth: Rina"
              className="h-11 pl-9"
              autoComplete="name"
              maxLength={60}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brief-brand">
            Nama bisnis / brand <span className="text-xs font-normal text-muted-foreground">(opsional)</span>
          </Label>
          <div className="relative">
            <Store className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              id="brief-brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="cth: Kopi Kirana"
              className="h-11 pl-9"
              maxLength={60}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brief-need">
            Ceritakan kebutuhan Anda <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="brief-need"
            value={need}
            onChange={(e) => setNeed(e.target.value)}
            placeholder={meta.placeholder}
            className="min-h-28 resize-y"
            maxLength={600}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brief-deadline">
            Target selesai <span className="text-xs font-normal text-muted-foreground">(opsional)</span>
          </Label>
          <div className="relative">
            <CalendarClock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              id="brief-deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="cth: 2 minggu dari sekarang"
              className="h-11 pl-9"
              maxLength={40}
            />
          </div>
        </div>
      </div>

      <div className="mt-auto pt-5">
        <Button
          type="submit"
          className="h-12 w-full bg-[#25D366] text-base font-bold text-white hover:bg-[#1eb757]"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Kirim via WhatsApp
        </Button>
        <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <MessageSquareText className="h-3.5 w-3.5" aria-hidden />
          Anda akan diarahkan ke WhatsApp resmi AlexPicture — konsultasi awal tanpa biaya.
        </p>
      </div>
    </form>
  );
}

export function QuickBriefSheet() {
  const open = useBriefStore((s) => s.open);
  const slug = useBriefStore((s) => s.slug);
  const intent = useBriefStore((s) => s.intent);
  const seq = useBriefStore((s) => s.seq);
  const hide = useBriefStore((s) => s.hide);

  const meta = INTENTS[intent];

  return (
    <Sheet open={open} onOpenChange={(v) => !v && hide()}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#25D366]/15 text-[#1eb757]">
              <WhatsAppIcon className="h-4 w-4" />
            </span>
            {meta.title}
          </SheetTitle>
          <SheetDescription>{meta.desc}</SheetDescription>
        </SheetHeader>
        <BriefForm key={`${seq}-${intent}-${slug ?? "none"}`} slug={slug} intent={intent} onDone={hide} />
      </SheetContent>
    </Sheet>
  );
}

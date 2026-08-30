// ============================================================
// WHATSAPP GATEWAY — pembangun pesan & URL (PRD v3.0 §10)
// Modul isomorfik (dipakai server di /api/checkout DAN klien).
// Nomor WA resmi: 6288272876066 — selalu dari env var (D1).
// ============================================================

import type { PricedLine } from "./catalog";

export const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6288272876066";

export function formatIDRPlain(n: number): string {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

/** URL chat cepat untuk tombol kontak langsung (PRD §10.4). */
export function quickChatUrl(): string {
  const msg = "Halo AlexPicture! Saya ingin konsultasi kebutuhan kreatif untuk bisnis saya.";
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function waUrlFromMessage(message: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export interface CheckoutMessageData {
  orderCode: string;
  customerName: string;
  brandName: string;
  notes?: string;
  lines: PricedLine[];
  total: number;
}

/**
 * Template pesan checkout (PRD §10.3). Guard > 20 baris item
 * agar URL wa.me tidak melebihi batas panjang.
 */
export function buildCheckoutMessage(data: CheckoutMessageData): string {
  const { orderCode, customerName, brandName, notes, lines, total } = data;

  const maxLines = 20;
  const shown = lines.slice(0, maxLines);
  const rest = lines.length - shown.length;

  const itemLines = shown.map((l, idx) => {
    const qtyLabel = l.qty > 1 ? `${l.qty}x` : "1x";
    return `${idx + 1}. ${qtyLabel} ${l.name} (${l.unit}) — ${formatIDRPlain(l.subtotal)}`;
  });
  if (rest > 0) itemLines.push(`... dan ${rest} item lainnya (lihat ringkasan di website)`);

  const message = [
    "*PESANAN BARU — ALEXPICTURE MARKETPLACE*",
    `_Order ID: ${orderCode}_`,
    "",
    "*DATA KLIEN*",
    `• Nama: ${customerName}`,
    `• Brand: ${brandName}`,
    `• Catatan: ${notes?.trim() ? notes.trim() : "-"}`,
    "",
    "*RINCIAN PESANAN*",
    ...itemLines,
    "",
    `*TOTAL: ${formatIDRPlain(total)}*`,
    "",
    "Mohon konfirmasi ketersediaan & langkah selanjutnya. Terima kasih!",
  ].join("\n");

  return message;
}

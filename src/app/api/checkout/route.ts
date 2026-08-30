import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { computeCart } from "@/lib/catalog";
import { buildCheckoutMessage, waUrlFromMessage } from "@/lib/whatsapp";

// ============================================================
// POST /api/checkout — WhatsApp Gateway (PRD v3.0 §13.1)
// Keamanan: honeypot + rate limit 5 req/IP/menit (in-memory) +
// harga SELALU dihitung server-side (anti-tampering).
// Lead-loss prevention: bila DB gagal, waUrl tetap dikembalikan.
// ============================================================

export const runtime = "nodejs";

// ---------- Rate limiter in-memory ----------
const RATE_LIMIT = 5;
const RATE_WINDOW = 60_000;
const hits = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + RATE_WINDOW });
    return false;
  }
  entry.count += 1;
  if (entry.count % 20 === 0) {
    // bersihkan entri kedaluwarsa secara berkala
    for (const [key, val] of hits) {
      if (now > val.reset) hits.delete(key);
    }
  }
  return entry.count > RATE_LIMIT;
}

// ---------- Order code APM-YYMMDD-XXXX ----------
function generateOrderCode(): string {
  const d = new Date();
  const now = new Date(d.getTime() + 7 * 3600 * 1000); // WIB
  const yy = String(now.getUTCFullYear()).slice(2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  let suffix = Math.random().toString(36).slice(2, 6).toUpperCase().replace(/[^A-Z0-9]/g, "");
  suffix = suffix.padEnd(4, "X").slice(0, 4);
  return `APM-${yy}${mm}${dd}-${suffix}`;
}

interface CheckoutBody {
  items?: { slug?: unknown; qty?: unknown }[];
  brief?: { name?: unknown; brand?: unknown; notes?: unknown };
  honeypot?: unknown;
  source?: unknown;
}

function bad(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: NextRequest) {
  // ---------- IP & rate limit ----------
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (isRateLimited(ip)) {
    return bad("RATE_LIMITED", 429);
  }

  // ---------- Parse body ----------
  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return bad("INVALID_JSON");
  }

  // ---------- Honeypot anti-bot ----------
  if (typeof body.honeypot === "string" && body.honeypot.trim().length > 0) {
    return bad("BOT_DETECTED");
  }

  // ---------- Validasi brief ----------
  const name = typeof body.brief?.name === "string" ? body.brief.name.trim() : "";
  const brand = typeof body.brief?.brand === "string" ? body.brief.brand.trim() : "";
  const notes = typeof body.brief?.notes === "string" ? body.brief.notes.trim().slice(0, 500) : "";
  if (name.length < 3 || name.length > 60) return bad("BRIEF_INVALID");
  if (brand.length < 2 || brand.length > 60) return bad("BRIEF_INVALID");

  // ---------- Validasi items ----------
  if (!Array.isArray(body.items) || body.items.length === 0) return bad("ITEMS_EMPTY");
  if (body.items.length > 60) return bad("ITEMS_EMPTY");
  const items: { slug: string; qty: number }[] = [];
  for (const raw of body.items) {
    const slug = typeof raw?.slug === "string" ? raw.slug : "";
    const qty = Number(raw?.qty);
    if (!slug || !Number.isFinite(qty) || qty < 1 || qty > 99) return bad("ITEMS_INVALID");
    items.push({ slug, qty: Math.round(qty) });
  }

  // ---------- Harga server-side ----------
  const totals = computeCart(items);
  if (totals.invalidSlugs.length > 0) return bad("ITEMS_INVALID");
  if (totals.lines.length === 0) return bad("ITEMS_EMPTY");
  if (totals.multilang.present && !totals.multilang.valid) {
    return bad("MULTILANG_REQUIRES_WEBSITE");
  }

  // ---------- Order code unik ----------
  let orderCode = generateOrderCode();
  let codeOk = false;
  for (let attempt = 0; attempt < 5 && !codeOk; attempt++) {
    try {
      const existing = await db.lead.findUnique({ where: { code: orderCode } });
      if (!existing) codeOk = true;
      else orderCode = generateOrderCode();
    } catch {
      codeOk = true; // DB bermasalah — lanjut (lead-loss prevention)
    }
  }

  // ---------- INSERT Lead ----------
  const leadData = {
    code: orderCode,
    customerName: name,
    brandName: brand,
    notes: notes || null,
    items: JSON.stringify(
      totals.lines.map((l) => ({
        slug: l.slug,
        name: l.name,
        qty: l.qty,
        unit: l.unit,
        unitPrice: l.unitPrice,
        subtotal: l.subtotal,
      }))
    ),
    total: totals.total,
    status: "NEW",
    paymentStatus: "UNPAID",
    source: typeof body.source === "string" ? body.source.slice(0, 100) : null,
  };

  let dbFailed = false;
  try {
    await db.lead.create({ data: leadData });
  } catch (err) {
    dbFailed = true;
    console.error("[checkout] Gagal insert Lead — WA tetap dikembalikan:", err);
  }

  // ---------- Susun WhatsApp URL ----------
  const message = buildCheckoutMessage({
    orderCode,
    customerName: name,
    brandName: brand,
    notes,
    lines: totals.lines,
    total: totals.total,
  });
  const waUrl = waUrlFromMessage(message);

  return NextResponse.json({
    ok: true,
    orderCode,
    total: totals.total,
    waUrl,
    dbLogged: !dbFailed,
  });
}

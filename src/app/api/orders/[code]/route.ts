import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// ============================================================
// GET /api/orders/:code?brand=... — Lacak Pesanan (PRD §10.3)
// Verifikasi ringan: Order ID + nama brand. Tanpa login.
// Hanya mengembalikan data MINIMAL (status + item + total) —
// bukan data kontak. Rate limit 10 req/IP/menit.
// ============================================================

export const runtime = "nodejs";

const RATE_LIMIT = 10;
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
  return entry.count > RATE_LIMIT;
}

interface LeadItem {
  slug: string;
  name: string;
  qty: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ code: string }> }) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "RATE_LIMITED" }, { status: 429 });
  }

  const { code } = await ctx.params;
  const brand = (req.nextUrl.searchParams.get("brand") || "").trim().toLowerCase();

  if (!code || !brand) {
    return NextResponse.json({ ok: false, error: "MISSING_PARAMS" }, { status: 400 });
  }

  let lead;
  try {
    lead = await db.lead.findUnique({ where: { code: code.toUpperCase() } });
  } catch (err) {
    console.error("[orders] DB error:", err);
    return NextResponse.json({ ok: false, error: "DB_UNAVAILABLE" }, { status: 500 });
  }

  // Verifikasi ringan: nama brand harus cocok (anti enumerasi order)
  if (!lead || lead.brandName.trim().toLowerCase() !== brand) {
    return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
  }

  let items: LeadItem[] = [];
  try {
    items = JSON.parse(lead.items) as LeadItem[];
  } catch {
    items = [];
  }

  return NextResponse.json({
    ok: true,
    order: {
      code: lead.code,
      status: lead.status,
      paymentStatus: lead.paymentStatus,
      items,
      total: lead.total,
      itemCount: items.reduce((n, i) => n + i.qty, 0),
      createdAt: lead.createdAt.toISOString(),
    },
  });
}

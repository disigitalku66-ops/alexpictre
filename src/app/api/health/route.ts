import { NextResponse } from "next/server";

// GET /api/health — smoke test pasca-deploy (PRD §13.2)
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ ok: true, service: "alexpicture-marketplace", ts: Date.now() });
}

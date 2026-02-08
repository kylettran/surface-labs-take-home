import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const rawKey = process.env.ANTHROPIC_API_KEY ?? "";
  const trimmedKey = rawKey.trim();

  return NextResponse.json({
    hasKey: Boolean(trimmedKey),
    startsWithSkAnt: trimmedKey.startsWith("sk-ant-"),
    length: trimmedKey.length,
  });
}

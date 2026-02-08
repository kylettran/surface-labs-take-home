import { NextResponse } from "next/server";
import { callClaude } from "@/lib/ai";
import { buildDrivePrompt } from "@/lib/drive-scorer";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.company) {
      return NextResponse.json({ error: "Missing company" }, { status: 400 });
    }

    const prompt = buildDrivePrompt(body.company);
    const score = await callClaude(prompt);
    return NextResponse.json(score);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { callClaude } from "@/lib/ai";
import { buildEmailPrompt, getSurfaceValueProp } from "@/lib/email-templates";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const company = body?.company;
    const topPainSignal = body?.topPainSignal;
    const angle = body?.angle;

    if (!company || !topPainSignal || !angle) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const buyerPersona =
      body?.buyerPersona || company.buyerPersonas?.[0] || "Revenue leader";

    const prompt = buildEmailPrompt({
      buyerPersona,
      companyName: company.name,
      topPainSignal,
      angle,
      valueProp: getSurfaceValueProp(company),
    });

    const email = await callClaude(prompt);
    return NextResponse.json(email);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

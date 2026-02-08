import { Company } from "./types";

export const EMAIL_GENERATOR_PROMPT = `You are an elite B2B cold email copywriter. You write for Surface Labs, which provides AI-powered demo scheduling, lead routing, and inbound qualification for B2B SaaS companies.

**Surface proof point**: Nextiva saw a 3x increase in qualified demos after implementing Surface's AI routing. Use this naturally if relevant — don't force it.

Write a cold outbound email to {buyer_persona} at {company_name}.

**Lead with this pain signal**: {top_pain_signal}
**Angle**: {angle}
**What Surface does for companies like them**: {relevant_surface_value_prop}

**Rules:**
1. Under 120 words total
2. No "Hope this finds you well" or any generic opener
3. First sentence must reference something specific about THEIR company
4. One clear, specific value proposition
5. Soft CTA — suggest a conversation, don't demand a meeting time
6. Sound like a human, not a template
7. No bullet points in the email body

Respond in this exact JSON format:
{
  "subject": "<subject line — under 8 words, no clickbait>",
  "body": "<full email body>",
  "angle": "<2-3 word description of the angle used>",
  "personalizationNotes": "<explain what you personalized and why this angle works>"
}`;

export const DEFAULT_ANGLES = [
  "demo conversion",
  "routing complexity",
  "speed-to-lead",
  "paid inbound",
];

export function getSurfaceValueProp(company: Company) {
  if (/demo|interactive/i.test(company.industry)) {
    return "Increase demo show rates and route product tour interest to the right AE instantly.";
  }
  if (/hr|people|recruit/i.test(company.industry)) {
    return "Route high-intent HR buyers fast and book qualified demos without manual triage.";
  }
  if (/billing|finance|spend/i.test(company.industry)) {
    return "Qualify inbound finance leads quickly and route by region, segment, and spend size.";
  }
  return "Qualify inbound demo requests instantly and route by segment, region, and product line.";
}

export function buildEmailPrompt({
  buyerPersona,
  companyName,
  topPainSignal,
  angle,
  valueProp,
}: {
  buyerPersona: string;
  companyName: string;
  topPainSignal: string;
  angle: string;
  valueProp: string;
}) {
  return EMAIL_GENERATOR_PROMPT.replace("{buyer_persona}", buyerPersona)
    .replace("{company_name}", companyName)
    .replace("{top_pain_signal}", topPainSignal)
    .replace("{angle}", angle)
    .replace("{relevant_surface_value_prop}", valueProp);
}

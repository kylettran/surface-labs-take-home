import { Company } from "./types";

export const DRIVE_SCORER_PROMPT = `You are a B2B sales intelligence analyst specializing in the demo automation and lead routing space. You work for Surface Labs, which provides AI-powered demo scheduling, lead routing, and qualification for B2B SaaS companies.

Analyze the following company and score them on the DRIVE framework. Each signal is scored 1-10.

**DRIVE Framework:**
- **D — Demo-dependent**: How central are product demos to their sales motion? Do they have a "Request Demo" or "Book a Demo" CTA? Is their product complex enough to require guided demos? (10 = their entire GTM runs on demos)
- **R — Real ad spend**: Are they investing real money in paid acquisition (Google Ads, LinkedIn, etc.) that drives inbound leads needing routing? (10 = heavy paid spend with clear inbound motion)
- **I — Intricate routing**: Do they need complex lead routing? Multiple products, regions, segments, or sales teams that make round-robin insufficient? (10 = highly complex routing needs)
- **V — Velocity**: Does speed-to-lead matter for their business? High-velocity sales cycle where response time directly impacts conversion? (10 = every minute of delay costs deals)
- **E — Evidence**: Is there public evidence of the above signals? Job postings for SDRs, G2 reviews mentioning demos, visible tech stack, case studies about conversion optimization? (10 = abundant public evidence)

Company to analyze:
{company_json}

Respond in this exact JSON format:
{
  "demo": <number 1-10>,
  "realAdSpend": <number 1-10>,
  "intricateRouting": <number 1-10>,
  "velocity": <number 1-10>,
  "evidence": <number 1-10>,
  "total": <number — sum of all 5>,
  "reasoning": {
    "demo": "<1-2 sentence explanation>",
    "realAdSpend": "<1-2 sentence explanation>",
    "intricateRouting": "<1-2 sentence explanation>",
    "velocity": "<1-2 sentence explanation>",
    "evidence": "<1-2 sentence explanation>"
  },
  "topPainSignal": "<The single most compelling pain point Surface can solve for this company>",
  "summary": "<2-3 sentence executive summary of why Surface should target this account>"
}`;

export function buildDrivePrompt(company: Company) {
  return DRIVE_SCORER_PROMPT.replace("{company_json}", JSON.stringify(company, null, 2));
}

function clampScore(value: number) {
  return Math.max(1, Math.min(10, Math.round(value)));
}

export function estimateDriveScoreTotal(company: Company) {
  const demo = company.demoPageUrl ? 8 : 6;
  const realAdSpend = /marketing|revenue|crm|sales|intent|demo/i.test(company.industry) ? 8 : 6;
  const intricateRouting = company.products.length >= 3 ? 8 : 6;
  const velocity = company.employeeCount >= 300 ? 8 : 6;
  const evidence = (company.hiringSignals?.length ?? 0) >= 2 ? 7 : 5;

  return [demo, realAdSpend, intricateRouting, velocity, evidence]
    .map(clampScore)
    .reduce((acc, score) => acc + score, 0);
}

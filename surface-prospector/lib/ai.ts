const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-5-20250929";
const TIMEOUT_MS = 30_000;
const MAX_TOKENS = 800;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("Unable to parse JSON from Claude response");
  }
}

export async function callClaude(prompt: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Missing ANTHROPIC_API_KEY");
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          temperature: 0.4,
          messages: [{ role: "user", content: prompt }],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 429 || response.status >= 500) {
          const wait = Math.min(1000 * 2 ** attempt, 8000);
          await sleep(wait);
          continue;
        }
        throw new Error(`Claude API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      const content = data?.content?.[0]?.text ?? "";

      if (data?.usage) {
        console.log("Claude usage", {
          inputTokens: data.usage.input_tokens,
          outputTokens: data.usage.output_tokens,
        });
      }

      return extractJson(content);
    } catch (error) {
      lastError = error as Error;
      const wait = Math.min(1000 * 2 ** attempt, 8000);
      await sleep(wait);
    }
  }

  throw lastError ?? new Error("Claude API failed");
}

const MAX_TEXT_LENGTH = 20_000;
const DEFAULT_MODEL = "gpt-4.1-mini";

const instructions = {
  summarize:
    "Ringkas teks berikut dalam bahasa Indonesia. Pertahankan poin penting, jangan menambahkan fakta, dan gunakan kalimat yang jelas.",
  plan:
    "Ubah teks berikut menjadi rencana kerja praktis dalam bahasa Indonesia. Susun langkah secara berurutan dan sertakan prioritas bila relevan. Jangan menambahkan fakta yang tidak ada.",
  rewrite:
    "Tulis ulang teks berikut dalam bahasa Indonesia agar lebih jelas dan efektif. Pertahankan maksud dan faktanya; berikan hanya hasil penulisan ulang.",
} as const;

type Action = keyof typeof instructions;

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function extractResult(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;

  const response = payload as { output_text?: unknown; output?: unknown };
  if (typeof response.output_text === "string" && response.output_text.trim()) {
    return response.output_text.trim();
  }

  if (!Array.isArray(response.output)) return null;

  const text = response.output.flatMap((item: unknown) => {
    if (!item || typeof item !== "object") return [];
    const content = (item as { content?: unknown }).content;
    if (!Array.isArray(content)) return [];
    return content.flatMap((part: unknown) => {
      if (!part || typeof part !== "object") return [];
      const outputPart = part as { type?: unknown; text?: unknown };
      return outputPart.type === "output_text" && typeof outputPart.text === "string"
        ? [outputPart.text]
        : [];
    });
  });

  const result = text.join("\n").trim();
  return result || null;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Permintaan harus berisi JSON yang valid.", 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonError("Permintaan tidak valid.", 400);
  }

  const { action, text } = body as { action?: unknown; text?: unknown };
  if (typeof action !== "string" || !Object.prototype.hasOwnProperty.call(instructions, action)) {
    return jsonError("Tindakan tidak didukung. Gunakan summarize, plan, atau rewrite.", 400);
  }
  if (typeof text !== "string" || !text.trim()) {
    return jsonError("Teks wajib diisi.", 400);
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return jsonError("Teks terlalu panjang. Batasnya 20.000 karakter.", 400);
  }

  const authorization = request.headers.get("authorization") ?? "";
  const bearerMatch = authorization.match(/^Bearer\s+(\S+)$/i);
  if (!bearerMatch) {
    return jsonError("API key OpenAI diperlukan. Masukkan key Anda lalu coba lagi.", 401);
  }

  const apiKey = bearerMatch[1];
  const model = process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        instructions: instructions[action as Action],
        input: text.trim(),
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401) {
        return jsonError("API key OpenAI tidak valid. Periksa key Anda lalu coba lagi.", 401);
      }
      if (response.status === 429) {
        return jsonError("Batas penggunaan OpenAI tercapai. Tunggu sebentar atau periksa kuota akun Anda.", 429);
      }
      return jsonError("Layanan AI gagal memproses permintaan. Coba lagi nanti.", 502);
    }

    const result = extractResult(await response.json());
    if (!result) {
      return jsonError("Layanan AI tidak memberikan hasil yang dapat digunakan.", 502);
    }

    return Response.json({ result });
  } catch {
    return jsonError("Layanan AI sedang tidak tersedia. Coba lagi nanti.", 502);
  }
}

export const maxDuration = 60;

interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: GeminiPart[] };
  }>;
  error?: { message: string };
}

const MODELS = [
  'gemini-2.0-flash-preview-image-generation',
  'gemini-2.0-flash-exp-image-generation',
];

export async function POST(req: Request) {
  const { prompt } = await req.json() as { prompt: string };

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 3) {
    return Response.json({ error: 'Prompt en az 3 karakter olmalı' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'API key eksik' }, { status: 500 });
  }

  const stickerPrompt = `Create a high-quality sticker design: ${prompt.trim()}. Style: die-cut sticker with clean white border, vibrant saturated colors, cute cartoon illustration style, bold outlines, isolated on pure white background, sticker art style`;

  for (const model of MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: stickerPrompt }] }],
            generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
          }),
        }
      );

      const data = await res.json() as GeminiResponse;

      if (!res.ok) {
        console.error(`[generate] ${model} failed:`, data.error?.message);
        continue;
      }

      const imagePart = data.candidates?.[0]?.content?.parts?.find(
        (p) => p.inlineData?.mimeType?.startsWith('image/')
      );

      if (!imagePart?.inlineData) continue;

      const dataUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
      return Response.json({ imageUrl: dataUrl, generatedAt: new Date().toISOString() });
    } catch (err) {
      console.error(`[generate] ${model} exception:`, err);
      continue;
    }
  }

  return Response.json({ error: 'Görsel oluşturulamadı. Gemini image generation API\'nize erişim olmayabilir.' }, { status: 500 });
}

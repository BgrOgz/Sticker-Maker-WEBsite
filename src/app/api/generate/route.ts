import { experimental_generateImage as generateImage } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { prompt } = await req.json() as { prompt: string };

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 3) {
    return Response.json({ error: 'Prompt en az 3 karakter olmalı' }, { status: 400 });
  }

  if (prompt.trim().length > 512) {
    return Response.json({ error: 'Prompt 512 karakterden uzun olamaz' }, { status: 400 });
  }

  const stickerPrompt = `Create a high-quality sticker design: ${prompt.trim()}. Style: die-cut sticker with clean white border, vibrant saturated colors, cute cartoon illustration style, bold outlines, isolated on pure white background, no background elements, sticker art style`;

  try {
    const { images } = await generateImage({
      model: google.imageModel('imagen-3.0-generate-002'),
      prompt: stickerPrompt,
      aspectRatio: '1:1',
    });

    if (!images || images.length === 0) {
      return Response.json({ error: 'Görsel oluşturulamadı, tekrar dene' }, { status: 500 });
    }

    const dataUrl = `data:image/png;base64,${images[0].base64}`;
    return Response.json({ imageUrl: dataUrl, generatedAt: new Date().toISOString() });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[generate] error:', message);
    return Response.json({ error: message }, { status: 500 });
  }
}

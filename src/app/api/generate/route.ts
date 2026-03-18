import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { prompt, imageBase64 } = await req.json() as { prompt: string; imageBase64?: string };

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 3) {
    return Response.json({ error: 'Prompt en az 3 karakter olmalı' }, { status: 400 });
  }

  if (prompt.trim().length > 512) {
    return Response.json({ error: 'Prompt 512 karakterden uzun olamaz' }, { status: 400 });
  }

  try {
    const stickerInstruction = `Create a high-quality die-cut sticker design: vibrant saturated colors, bold outlines, cute cartoon illustration style, clean white border, isolated on pure white background.`;

    let result;

    if (imageBase64) {
      // Multimodal: uploaded image + prompt
      const userText = prompt.trim()
        ? `${stickerInstruction} Based on this reference image, create a sticker. Additional description: ${prompt.trim()}`
        : `${stickerInstruction} Turn this image into a sticker.`;

      const content = [
        { type: 'image' as const, image: imageBase64 },
        { type: 'text' as const, text: userText },
      ];

      result = await generateText({
        model: google('gemini-3.1-flash-image-preview'),
        messages: [{ role: 'user', content }],
        providerOptions: {
          google: { responseModalities: ['TEXT', 'IMAGE'] },
        },
      });
    } else {
      // Text-only prompt
      result = await generateText({
        model: google('gemini-3.1-flash-image-preview'),
        prompt: `${stickerInstruction} Subject: ${prompt.trim()}`,
        providerOptions: {
          google: { responseModalities: ['TEXT', 'IMAGE'] },
        },
      });
    }

    const imageFile = result.files?.find((f) => f.mediaType?.startsWith('image/'));

    if (!imageFile) {
      return Response.json({ error: 'Görsel oluşturulamadı, tekrar dene' }, { status: 500 });
    }

    const dataUrl = `data:${imageFile.mediaType};base64,${imageFile.base64}`;
    return Response.json({ imageUrl: dataUrl, generatedAt: new Date().toISOString() });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[generate] error:', message);
    return Response.json({ error: message }, { status: 500 });
  }
}

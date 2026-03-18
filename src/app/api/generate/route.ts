import { experimental_generateImage as generateImage } from 'ai';
import { createVertex } from '@ai-sdk/google-vertex';

export const maxDuration = 60;

function getVertexClient() {
  const credsB64 = process.env.GOOGLE_VERTEX_CREDENTIALS;
  if (!credsB64) throw new Error('GOOGLE_VERTEX_CREDENTIALS env var eksik');

  const creds = JSON.parse(Buffer.from(credsB64, 'base64').toString('utf-8'));

  return createVertex({
    project: creds.project_id,
    location: 'us-central1',
    googleAuthOptions: {
      credentials: {
        client_email: creds.client_email,
        private_key: creds.private_key,
      },
    },
  });
}

export async function POST(req: Request) {
  const { prompt } = await req.json() as { prompt: string };

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 3) {
    return Response.json({ error: 'Prompt en az 3 karakter olmalı' }, { status: 400 });
  }

  if (prompt.trim().length > 512) {
    return Response.json({ error: 'Prompt 512 karakterden uzun olamaz' }, { status: 400 });
  }

  const stickerPrompt = `Create a high-quality sticker design: ${prompt.trim()}. Style: die-cut sticker with clean white border, vibrant saturated colors, cute cartoon illustration style, bold outlines, isolated on pure white background, sticker art style`;

  try {
    const vertex = getVertexClient();

    const { images } = await generateImage({
      model: vertex.image('imagen-3.0-generate-002'),
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

import { experimental_generateImage as generateImage, generateText } from 'ai';
import { createVertex } from '@ai-sdk/google-vertex';
import { google } from '@ai-sdk/google';

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

async function describeImage(imageBuffer: Buffer): Promise<string | null> {
  // Use direct Gemini API (GOOGLE_GENERATIVE_AI_API_KEY) for vision
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) return null;

  try {
    const result = await generateText({
      model: google('gemini-2.5-flash'),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', image: imageBuffer },
            {
              type: 'text',
              text: 'Describe this image in detail for a sticker design. Focus on: the main subject (person, animal, object), physical appearance, colors, expression, clothing. Be specific and vivid. Max 120 words.',
            },
          ],
        },
      ],
    });
    return result.text;
  } catch (err) {
    console.warn('[generate] Gemini Vision failed:', err instanceof Error ? err.message : err);
    return null;
  }
}

export async function POST(req: Request) {
  const { prompt, imageBase64 } = await req.json() as { prompt: string; imageBase64?: string };

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 3) {
    return Response.json({ error: 'Prompt en az 3 karakter olmalı' }, { status: 400 });
  }

  if (prompt.trim().length > 512) {
    return Response.json({ error: 'Prompt 512 karakterden uzun olamaz' }, { status: 400 });
  }

  try {
    const vertex = getVertexClient();

    let finalPrompt: string;

    if (imageBase64) {
      const base64Data = imageBase64.replace(/^data:[^;]+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');
      const description = await describeImage(imageBuffer);

      if (description) {
        finalPrompt = `Create a high-quality die-cut sticker design of: ${description}. User instructions: ${prompt.trim()}. Style: sticker art with clean white border, vibrant saturated colors, bold outlines, isolated on pure white background, cartoon illustration style, professional sticker design.`;
      } else {
        // Vision unavailable — use text prompt only
        finalPrompt = `Create a high-quality sticker design: ${prompt.trim()}. Style: die-cut sticker with clean white border, vibrant saturated colors, cute cartoon illustration style, bold outlines, isolated on pure white background.`;
      }
    } else {
      finalPrompt = `Create a high-quality sticker design: ${prompt.trim()}. Style: die-cut sticker with clean white border, vibrant saturated colors, cute cartoon illustration style, bold outlines, isolated on pure white background, sticker art style`;
    }

    const { images } = await generateImage({
      model: vertex.image('imagen-3.0-generate-002'),
      prompt: finalPrompt,
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

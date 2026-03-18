import { experimental_generateImage as generateImage, generateText } from 'ai';
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
  const { prompt, imageBase64 } = await req.json() as { prompt: string; imageBase64?: string };

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 3) {
    return Response.json({ error: 'Prompt en az 3 karakter olmalı' }, { status: 400 });
  }

  if (prompt.trim().length > 512) {
    return Response.json({ error: 'Prompt 512 karakterden uzun olamaz' }, { status: 400 });
  }

  try {
    const vertex = getVertexClient();
    const stickerPrompt = `Create a high-quality sticker design: ${prompt.trim()}. Style: die-cut sticker with clean white border, vibrant saturated colors, cute cartoon illustration style, bold outlines, isolated on pure white background, sticker art style`;

    // If image uploaded: try Gemini Vision to describe it, fall back to text prompt on error
    let finalPrompt = stickerPrompt;
    if (imageBase64) {
      try {
        const base64Data = imageBase64.replace(/^data:[^;]+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');

        const GEMINI_MODELS = [
          'gemini-2.0-flash-exp',
          'gemini-1.5-pro-002',
          'gemini-1.5-flash-002',
          'gemini-1.5-flash-001',
        ];

        let description: string | null = null;
        for (const modelId of GEMINI_MODELS) {
          try {
            const result = await generateText({
              model: vertex(modelId),
              messages: [
                {
                  role: 'user',
                  content: [
                    { type: 'image', image: imageBuffer },
                    {
                      type: 'text',
                      text: 'Describe this image briefly for a sticker design prompt. Focus on main subject, colors, style. Max 80 words.',
                    },
                  ],
                },
              ],
            });
            description = result.text;
            break;
          } catch {
            // Try next model
          }
        }

        if (description) {
          finalPrompt = `Create a high-quality sticker design based on: ${description}. ${prompt.trim() ? `Additional instructions: ${prompt.trim()}.` : ''} Style: die-cut sticker with clean white border, vibrant saturated colors, cute cartoon illustration style, bold outlines, isolated on pure white background, sticker art style`;
        }
      } catch {
        // Gemini Vision unavailable — proceed with text-only prompt
        console.warn('[generate] Gemini Vision unavailable, using text prompt only');
      }
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

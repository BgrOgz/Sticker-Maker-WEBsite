import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { experimental_generateImage as generateImage } from 'ai';
import { createVertex } from '@ai-sdk/google-vertex';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'styles');

const STYLES = [
  {
    id: 'cyberpunk',
    prompt: 'cyberpunk neon city at night, holographic purple and cyan glitch aesthetics, futuristic urban landscape, neon signs, rain reflections, vivid electric colors, dark atmospheric background, ultra detailed digital art',
  },
  {
    id: 'anime',
    prompt: 'anime art style cute character illustration, expressive big eyes, vibrant saturated colors, clean bold outlines, sakura petals, dynamic pose, manga aesthetics, kawaii, professional anime key visual',
  },
  {
    id: 'realistic',
    prompt: 'ultra photorealistic macro photograph, professional studio lighting, sharp focus, cinematic depth of field, 8k resolution, natural colors, beautiful composition, award winning photography',
  },
  {
    id: 'watercolor',
    prompt: 'beautiful watercolor painting, soft flowing brushstrokes, delicate color washes, pastel tones, artistic paper texture, impressionist style, flowers and nature, gentle bleeding colors, fine art illustration',
  },
  {
    id: 'pixel-art',
    prompt: 'retro 8-bit pixel art video game scene, vibrant limited color palette, chunky pixel character, classic arcade aesthetic, nostalgic gaming, isometric pixel landscape, detailed sprite art',
  },
  {
    id: '3d-render',
    prompt: 'professional 3D CGI render, Octane render, subsurface scattering, cinematic studio lighting, ray tracing reflections, smooth polished surfaces, photorealistic materials, ultra high quality 3D art',
  },
];

async function main() {
  const credsPath = path.join(process.env.HOME, 'Downloads', 'makeasticker-9d8a5314989d.json');
  const creds = JSON.parse(fs.readFileSync(credsPath, 'utf-8'));

  const vertex = createVertex({
    project: creds.project_id,
    location: 'us-central1',
    googleAuthOptions: {
      credentials: {
        client_email: creds.client_email,
        private_key: creds.private_key,
      },
    },
  });

  for (const style of STYLES) {
    const outPath = path.join(OUTPUT_DIR, `${style.id}.png`);
    if (fs.existsSync(outPath)) {
      console.log(`⏭  ${style.id} — already exists, skipping`);
      continue;
    }

    process.stdout.write(`🎨 Generating ${style.id}...`);
    try {
      const { images } = await generateImage({
        model: vertex.image('imagen-3.0-generate-002'),
        prompt: style.prompt,
        aspectRatio: '1:1',
      });

      const buffer = Buffer.from(images[0].base64, 'base64');
      fs.writeFileSync(outPath, buffer);
      console.log(` ✓ saved (${Math.round(buffer.length / 1024)}KB)`);
    } catch (err) {
      console.log(` ✗ failed: ${err.message}`);
    }
  }

  console.log('\nDone! Images saved to public/styles/');
}

main();

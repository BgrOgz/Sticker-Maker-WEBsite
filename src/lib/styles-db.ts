/**
 * Curated sticker styles database
 * Each style has a prompt enhancer that enriches user prompts
 */

import type { Style } from '@/types';

export const STICKER_STYLES: Style[] = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon-soaked, glitchy, futuristic aesthetic',
    promptEnhancer:
      'cyberpunk neon holographic glitch art style, bright neon colors, tech vibes, dark background',
    category: 'futuristic',
  },
  {
    id: 'anime',
    name: 'Anime',
    description: 'Expressive characters, clean lines, vibrant colors',
    promptEnhancer:
      'anime character design, expressive eyes, clean lines, vibrant colors, manga style',
    category: 'artistic',
  },
  {
    id: 'realistic',
    name: 'Realistic',
    description: 'Photorealistic, detailed, professional quality',
    promptEnhancer:
      'photorealistic, detailed, professional photography, 4k quality, sharp focus, cinematic',
    category: 'photographic',
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    description: 'Soft edges, artistic, flowing colors',
    promptEnhancer: 'watercolor painting style, soft edges, artistic, colorful, flowing brushstrokes',
    category: 'artistic',
  },
  {
    id: 'pixel-art',
    name: 'Pixel Art',
    description: 'Retro 8-bit video game style',
    promptEnhancer: 'pixel art, 8-bit, retro video game style, blocky pixels, limited color palette',
    category: 'retro',
  },
  {
    id: '3d-render',
    name: '3D Render',
    description: 'Professional 3D rendering, polished',
    promptEnhancer:
      '3D render, octane render, professional lighting, detailed geometry, smooth surface',
    category: 'digital',
  },
  {
    id: 'comic',
    name: 'Comic',
    description: 'Comic book style with bold outlines',
    promptEnhancer:
      'comic book style, bold outlines, halftone shading, dramatic, speech bubble style',
    category: 'artistic',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Simple shapes, limited colors, flat design',
    promptEnhancer:
      'minimalist design, simple shapes, limited color palette, flat art style, geometric',
    category: 'modern',
  },
  {
    id: 'surreal',
    name: 'Surreal',
    description: 'Dreamlike, fantastical elements',
    promptEnhancer:
      'surreal art, dreamlike, surrealism, fantastical elements, impossible objects',
    category: 'artistic',
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Glowing neon signs aesthetic',
    promptEnhancer:
      'neon sign aesthetic, glowing, neon lights, dark background, vibrant glowing edges',
    category: 'futuristic',
  },
];

export const STYLE_CATEGORIES = {
  all: 'All Styles',
  futuristic: 'Futuristic',
  artistic: 'Artistic',
  photographic: 'Photographic',
  digital: 'Digital',
  retro: 'Retro',
  modern: 'Modern',
};

export function getStyleById(id: string): Style | undefined {
  return STICKER_STYLES.find((style) => style.id === id);
}

export function getStylesByCategory(category: string): Style[] {
  if (category === 'all') return STICKER_STYLES;
  return STICKER_STYLES.filter((style) => style.category === category);
}

export function applyStyleToPrompt(prompt: string, style: Style): string {
  // Trim and combine original prompt with style enhancer
  const trimmedPrompt = prompt.trim();
  const enhanced = `${trimmedPrompt} ${style.promptEnhancer}`.trim();
  return enhanced;
}

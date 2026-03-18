/**
 * Falling Background Images Configuration
 * List of sticker images for the animated falling background
 */

export const FALLING_IMAGES = [
  '/falling-images/Ekran Resmi 2026-03-18 13.20.42.png',
  '/falling-images/Ekran Resmi 2026-03-18 13.20.46.png',
  '/falling-images/Ekran Resmi 2026-03-18 13.20.50.png',
  '/falling-images/Ekran Resmi 2026-03-18 13.20.54.png',
  '/falling-images/Ekran Resmi 2026-03-18 13.20.58.png',
  '/falling-images/Ekran Resmi 2026-03-18 13.21.03.png',
  '/falling-images/Ekran Resmi 2026-03-18 13.21.07.png',
  '/falling-images/Ekran Resmi 2026-03-18 13.21.11.png',
  '/falling-images/Ekran Resmi 2026-03-18 13.21.15.png',
  '/falling-images/Ekran Resmi 2026-03-18 13.21.19.png',
];

export const FALLING_BACKGROUND_CONFIG = {
  imageCount: 15, // Number of simultaneous falling images
  minSize: 50,
  maxSize: 150,
  minOpacity: 0.2,
  maxOpacity: 0.5,
  minSpeed: 1, // pixels per frame
  maxSpeed: 4,
  frameRate: 60,
};

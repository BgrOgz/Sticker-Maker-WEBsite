'use client';

import { useEffect, useRef } from 'react';
import { FALLING_IMAGES, FALLING_BACKGROUND_CONFIG } from '@/lib/falling-images-config';

interface FallingItem {
  x: number;
  y: number;
  vy: number;
  size: number;
  opacity: number;
  rotation: number;
  rotSpeed: number;
  imgIdx: number;
}

export function FallingBackground(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Size canvas to viewport
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Load all images first, then start
    const loaded: HTMLImageElement[] = [];
    let loadCount = 0;

    const startAnimation = () => {
      const cfg = FALLING_BACKGROUND_CONFIG;
      const items: FallingItem[] = [];

      // Spread items across full screen height so they're immediately visible
      for (let i = 0; i < cfg.imageCount; i++) {
        const size = cfg.minSize + Math.random() * (cfg.maxSize - cfg.minSize);
        items.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height, // start at random height, not all at top
          vy: cfg.minSpeed + Math.random() * (cfg.maxSpeed - cfg.minSpeed),
          size,
          opacity: cfg.minOpacity + Math.random() * (cfg.maxOpacity - cfg.minOpacity),
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.02,
          imgIdx: i % loaded.length,
        });
      }

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (const item of items) {
          // Move down
          item.y += item.vy;
          item.rotation += item.rotSpeed;

          // Wrap when off-screen bottom
          if (item.y - item.size > canvas.height) {
            item.y = -item.size;
            item.x = Math.random() * canvas.width;
          }

          const img = loaded[item.imgIdx];
          if (!img || !img.complete || img.naturalWidth === 0) continue;

          ctx.save();
          ctx.globalAlpha = item.opacity;
          ctx.translate(item.x, item.y);
          ctx.rotate(item.rotation);
          ctx.drawImage(img, -item.size / 2, -item.size / 2, item.size, item.size);
          ctx.restore();
        }

        rafRef.current = requestAnimationFrame(draw);
      };

      rafRef.current = requestAnimationFrame(draw);
    };

    // Load each image, start when all done (or after a timeout)
    FALLING_IMAGES.forEach((src, i) => {
      const img = new Image();
      img.onload = () => {
        loaded[i] = img;
        loadCount++;
        if (loadCount === FALLING_IMAGES.length) startAnimation();
      };
      img.onerror = () => {
        loadCount++;
        if (loadCount === FALLING_IMAGES.length) startAnimation();
      };
      img.src = src;
    });

    // Safety fallback: start after 3s even if some images fail
    const fallback = setTimeout(() => {
      if (rafRef.current === null && loaded.length > 0) startAnimation();
    }, 3000);

    return () => {
      window.removeEventListener('resize', resize);
      clearTimeout(fallback);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

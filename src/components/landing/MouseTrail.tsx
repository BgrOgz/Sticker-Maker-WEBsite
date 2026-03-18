'use client';

import { useEffect, useRef } from 'react';

const COLORS = [
  '#a855f7', '#3b82f6', '#06b6d4',
  '#10b981', '#facc15', '#f97316',
  '#ef4444', '#ec4899',
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  colorIdx: number;
}

const MAX_PARTICLES = 120;

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

// Pre-compute RGB values once — gradient oluştururken parseInt çağrılmaz
const COLORS_RGB = COLORS.map(hexToRgb);

export function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const particles = useRef<Particle[]>([]);
  const colorIdxRef = useRef(0);
  const distRef = useRef(0);
  const lastPos = useRef({ x: 0, y: 0 });
  // mousemove'u rAF ile throttle etmek için
  const pendingPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Sadece son pozisyonu kaydet — draw loop'ta işle
    const onMove = (e: MouseEvent) => {
      pendingPos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);

    const spawnParticles = (x: number, y: number) => {
      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      lastPos.current = { x, y };

      distRef.current += speed;
      if (distRef.current > 50) {
        colorIdxRef.current = (colorIdxRef.current + 1) % COLORS.length;
        distRef.current = 0;
      }

      // Hızlı harekette fazla parçacık oluşturma
      const count = Math.min(Math.floor(speed / 6) + 1, 4);

      for (let i = 0; i < count; i++) {
        if (particles.current.length >= MAX_PARTICLES) break;
        const angle = Math.random() * Math.PI * 2;
        const spread = Math.random() * 1.5;
        particles.current.push({
          x: x + (Math.random() - 0.5) * 5,
          y: y + (Math.random() - 0.5) * 5,
          vx: Math.cos(angle) * spread * 0.3,
          vy: Math.sin(angle) * spread * 0.3 - 0.25,
          size: 5 + Math.random() * 9,
          alpha: 0.45 + Math.random() * 0.25,
          colorIdx: colorIdxRef.current,
        });
      }
    };

    const draw = () => {
      // Throttled spawn — rAF başına 1 kez
      if (pendingPos.current) {
        spawnParticles(pendingPos.current.x, pendingPos.current.y);
        pendingPos.current = null;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let i = particles.current.length;
      while (i--) {
        const p = particles.current[i];

        p.size  += 0.5;
        p.alpha *= 0.92;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;

        if (p.alpha < 0.01) {
          particles.current.splice(i, 1);
          continue;
        }

        // shadowBlur YOK — sadece radialGradient
        const [r, g, b] = COLORS_RGB[p.colorIdx];
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grad.addColorStop(0,   `rgba(${r},${g},${b},${p.alpha})`);
        grad.addColorStop(0.5, `rgba(${r},${g},${b},${p.alpha * 0.35})`);
        grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
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
        zIndex: 50,
        pointerEvents: 'none',
      }}
    />
  );
}

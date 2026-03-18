'use client';

import { useState } from 'react';
import { FallingBackground } from '@/components/landing/FallingBackground';
import { MouseTrail } from '@/components/landing/MouseTrail';
import { STICKER_STYLES, applyStyleToPrompt } from '@/lib/styles-db';
import type { Style } from '@/types';

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);

  function handleStyleClick(style: Style) {
    const enriched = applyStyleToPrompt(prompt, style);
    setPrompt(enriched);
    setSelectedStyle(style);
    // Scroll back to top so user sees their enriched prompt
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleGenerate() {
    if (!prompt.trim()) return;
    // Auth check will go here — for now alert as placeholder
    alert(`Generating: "${prompt}"\n\n(API route coming soon!)`);
  }

  return (
    <main className="relative min-h-screen text-white overflow-x-hidden" style={{ background: 'transparent' }}>
      {/* Falling sticker background */}
      <FallingBackground />
      {/* Mouse trail overlay */}
      <MouseTrail />

      {/* ── HERO SECTION ─────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Headline */}
        <h1 className="mb-4 text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
          Generate{' '}
          <span className="gradient-word">stunning</span>
          <br />
          stickers with AI
        </h1>
        <p className="mb-12 text-base md:text-lg text-[#b0b0b0] max-w-sm leading-relaxed">
          Type what you imagine. Get a custom die-cut sticker with 3D preview in seconds.
        </p>

        {/* Prompt Input */}
        <div className="w-full max-w-xl flex flex-col gap-3">
          <div className="relative flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 py-3 focus-within:border-[#00d9ff] transition-colors">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="a cute blue robot with sunglasses..."
              maxLength={512}
              className="flex-1 bg-transparent text-white placeholder-[#555] outline-none text-sm font-mono"
            />
            {prompt.length > 0 && (
              <span className="text-xs text-[#555] font-mono">{prompt.length}/512</span>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim()}
            className="btn-rainbow w-full py-3 rounded-2xl text-sm tracking-wider"
          >
            Generate ✦
          </button>

          {selectedStyle && (
            <p className="text-xs text-[#00d9ff] font-mono opacity-70">
              Style applied: {selectedStyle.name}
            </p>
          )}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs tracking-widest text-[#b0b0b0] uppercase font-mono">Styles</span>
          <div className="w-px h-10 bg-gradient-to-b from-[#b0b0b0] to-transparent" />
        </div>
      </section>

      {/* ── STYLES SECTION ──────────────────────────── */}
      <section className="relative z-10 px-4 pb-32 max-w-6xl mx-auto">
        <h2 className="mb-2 text-center text-2xl font-mono font-bold text-white">
          Choose a Style
        </h2>
        <p className="mb-10 text-center text-sm text-[#b0b0b0]">
          Click any style to enhance your prompt automatically
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {STICKER_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => handleStyleClick(style)}
              className={`
                flex flex-col items-start gap-2 p-4 rounded-xl border text-left
                transition-all duration-200 cursor-pointer group
                ${
                  selectedStyle?.id === style.id
                    ? 'bg-[#00d9ff]/10 border-[#00d9ff] text-[#00d9ff]'
                    : 'bg-[#1a1a1a] border-[#2a2a2a] text-white hover:border-[#00d9ff]/50 hover:bg-[#1a1a1a]'
                }
              `}
            >
              <span className="text-sm font-mono font-bold group-hover:text-[#00d9ff] transition-colors">
                {style.name}
              </span>
              <span className="text-xs text-[#b0b0b0] leading-relaxed">
                {style.description}
              </span>
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-[#555] font-mono">
          Styles enrich your prompt with AI-optimized descriptors
        </p>
      </section>
    </main>
  );
}

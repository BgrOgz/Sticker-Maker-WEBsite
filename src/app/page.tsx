'use client';

import { useState } from 'react';
import { FallingBackground } from '@/components/landing/FallingBackground';
import { MouseTrail } from '@/components/landing/MouseTrail';
import { STICKER_STYLES, applyStyleToPrompt } from '@/lib/styles-db';
import type { Style } from '@/types';

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleStyleClick(style: Style) {
    const enriched = applyStyleToPrompt(prompt, style);
    setPrompt(enriched);
    setSelectedStyle(style);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleGenerate() {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await res.json() as { imageUrl?: string; error?: string };

      if (!res.ok) {
        setError(data.error ?? 'Bir hata oluştu');
        return;
      }

      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
        // Scroll to result
        setTimeout(() => {
          document.getElementById('result')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bağlantı hatası, tekrar dene');
    } finally {
      setIsLoading(false);
    }
  }

  function handleDownload() {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `sticker-${Date.now()}.png`;
    a.click();
  }

  return (
    <main className="relative min-h-screen text-white overflow-x-hidden" style={{ background: 'transparent' }}>
      <FallingBackground />
      <MouseTrail />

      {/* ── HERO SECTION ─────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="mb-4 text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
          Generate{' '}
          <span className="gradient-word">stunning</span>
          <br />
          stickers with AI
        </h1>
        <p className="mb-12 text-base md:text-lg text-[#b0b0b0] max-w-sm leading-relaxed">
          Type what you imagine. Get a custom die-cut sticker in seconds.
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
              disabled={isLoading}
              className="flex-1 bg-transparent text-white placeholder-[#555] outline-none text-sm font-mono disabled:opacity-50"
            />
            {prompt.length > 0 && (
              <span className="text-xs text-[#555] font-mono">{prompt.length}/512</span>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isLoading}
            className="btn-rainbow w-full py-3 rounded-2xl text-sm tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </span>
            ) : (
              'Generate ✦'
            )}
          </button>

          {selectedStyle && !isLoading && (
            <p className="text-xs text-[#00d9ff] font-mono opacity-70">
              Style applied: {selectedStyle.name}
            </p>
          )}

          {error && (
            <p className="text-xs text-red-400 font-mono bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2">
              ⚠ {error}
            </p>
          )}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs tracking-widest text-[#b0b0b0] uppercase font-mono">Styles</span>
          <div className="w-px h-10 bg-gradient-to-b from-[#b0b0b0] to-transparent" />
        </div>
      </section>

      {/* ── RESULT SECTION ──────────────────────────── */}
      {imageUrl && (
        <section id="result" className="relative z-10 flex flex-col items-center px-4 py-24">
          <h2 className="mb-8 text-2xl font-mono font-bold text-white">Your Sticker ✦</h2>
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-3xl bg-[#00d9ff]/20 blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {/* Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Generated sticker"
              className="relative rounded-3xl border border-[#2a2a2a] w-72 h-72 md:w-96 md:h-96 object-contain bg-[#1a1a1a]"
            />
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={handleDownload}
              className="px-6 py-3 rounded-2xl bg-[#00d9ff] text-black text-sm font-bold tracking-wide hover:bg-[#00b8d4] transition-colors"
            >
              Download ↓
            </button>
            <button
              onClick={() => { setImageUrl(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-6 py-3 rounded-2xl border border-[#2a2a2a] text-sm font-mono text-[#b0b0b0] hover:border-[#00d9ff]/50 hover:text-white transition-colors"
            >
              New Sticker
            </button>
          </div>
        </section>
      )}

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

'use client';

import { useState, useRef } from 'react';
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
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleStyleClick(style: Style) {
    const enriched = applyStyleToPrompt(prompt, style);
    setPrompt(enriched);
    setSelectedStyle(style);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedImage(ev.target?.result as string);
    reader.readAsDataURL(file);
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

      if (data.imageUrl) setImageUrl(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bağlantı hatası, tekrar dene');
    } finally {
      setIsLoading(false);
    }
  }

  function handleDownload(format: 'png' | 'svg') {
    if (!imageUrl) return;
    const filename = `sticker-${Date.now()}`;
    const a = document.createElement('a');

    if (format === 'png') {
      a.href = imageUrl;
      a.download = `${filename}.png`;
    } else {
      // Embed PNG inside SVG — accepted by most sticker printers
      const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="1024" height="1024" viewBox="0 0 1024 1024">
  <image xlink:href="${imageUrl}" x="0" y="0" width="1024" height="1024"/>
</svg>`;
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      a.href = URL.createObjectURL(blob);
      a.download = `${filename}.svg`;
    }

    a.click();
    if (format === 'svg') URL.revokeObjectURL(a.href);
  }

  return (
    <main className="relative min-h-screen text-white overflow-x-hidden" style={{ background: 'transparent' }}>
      <FallingBackground />
      <MouseTrail />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-16">

        {/* ── HEADER ─────────────────────────────── */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            HAYALİNDEKİ <span className="gradient-word-slow">STİCKERLARI</span> ÜRET!
          </h1>
          <p className="text-sm text-[#b0b0b0] max-w-lg mx-auto">
            İster bastırmak istediğin stickerin görselini yükle, istersen de hayalindeki stickeri tasvir et.
          </p>
        </div>

        {/* ── TWO-COLUMN MAIN ─────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

          {/* LEFT: Input */}
          <div className="flex flex-col gap-3">
            {/* Prompt box */}
            <div className="rb-wrap flex-1">
            <div className="rb-inner p-4 min-h-[180px] flex flex-col">
              <p className="text-[10px] tracking-widest text-[#555] uppercase font-mono mb-3">
                Prompt için chatbox
              </p>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleGenerate()}
                placeholder="Hayalindeki stickeri tasvir et..."
                maxLength={512}
                disabled={isLoading}
                rows={5}
                className="flex-1 bg-transparent text-white placeholder-[#444] outline-none text-sm font-mono resize-none disabled:opacity-50"
              />
              <div className="flex items-center justify-between mt-2">
                {prompt.length > 0 && (
                  <span className="text-[10px] text-[#555] font-mono">{prompt.length}/512</span>
                )}
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isLoading}
                  className="ml-auto btn-rainbow px-5 py-2 rounded-xl text-xs tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Üretiliyor...
                    </span>
                  ) : 'Üret ✦'}
                </button>
              </div>
            </div>
            </div>

            {/* Upload box */}
            <div className="rb-wrap">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rb-inner p-4 text-left w-full group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {uploadedImage ? (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={uploadedImage} alt="uploaded" className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <p className="text-xs font-mono text-[#00d9ff]">Görsel yüklendi</p>
                    <p className="text-[10px] text-[#555]">Değiştirmek için tıkla</p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-mono text-[#b0b0b0] group-hover:text-[#00d9ff] transition-colors">
                    Görsel Yükle
                  </p>
                  <p className="text-[10px] text-[#555] mt-1 leading-relaxed">
                    Sanat tarzını kopyalayacak ya da bu görseli sticker yapacak otomatik olarak
                  </p>
                </div>
              )}
            </button>
            </div>
          </div>

          {/* RIGHT: Output */}
          <div className="rb-wrap min-h-[280px]">
          <div className="rb-inner flex flex-col items-center justify-center" style={{minHeight: 'calc(100% - 0px)'}}>
            {isLoading ? (
              <div className="flex flex-col items-center gap-3">
                <span className="inline-block w-8 h-8 border-2 border-[#00d9ff]/30 border-t-[#00d9ff] rounded-full animate-spin" />
                <span className="text-xs font-mono text-[#555]">Üretiliyor...</span>
              </div>
            ) : imageUrl ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Generated sticker"
                  className="max-w-full max-h-56 object-contain rounded-xl"
                />
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => handleDownload('png')}
                    className="px-4 py-2 rounded-xl bg-[#00d9ff] text-black text-xs font-bold hover:bg-[#00b8d4] transition-colors"
                  >
                    PNG ↓
                  </button>
                  <button
                    onClick={() => handleDownload('svg')}
                    className="px-4 py-2 rounded-xl bg-[#a855f7] text-white text-xs font-bold hover:bg-[#9333ea] transition-colors"
                  >
                    SVG ↓
                  </button>
                  <button
                    onClick={() => setImageUrl(null)}
                    className="px-4 py-2 rounded-xl border border-[#2a2a2a] text-xs font-mono text-[#b0b0b0] hover:border-[#00d9ff]/50 transition-colors"
                  >
                    Yeni
                  </button>
                </div>
              </div>
            ) : error ? (
              <div className="p-4 text-center">
                <p className="text-xs text-red-400 font-mono bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2">
                  ⚠ {error}
                </p>
              </div>
            ) : (
              <div className="text-center px-6">
                <p className="text-[10px] tracking-widest text-[#444] uppercase font-mono">
                  Generative AI çıktısı
                </p>
                <p className="text-[10px] text-[#333] font-mono mt-1">
                  Sticker buraya gelecek
                </p>
              </div>
            )}
          </div>
          </div>
        </div>

        {/* ── DETAIL SETTINGS DROPDOWN ─────────────── */}
        <div className="mb-8">
          <div className="rb-wrap">
          <button
            onClick={() => setDetailsOpen((v) => !v)}
            className="rb-inner w-full px-5 py-3 text-sm font-mono text-[#b0b0b0] flex items-center justify-between"
          >
            <span>Detay Ayarlama</span>
            <span className={`transition-transform duration-200 ${detailsOpen ? 'rotate-180' : ''}`}>▾</span>
          </button>
          </div>

          {detailsOpen && (
            <div className="rb-wrap mt-2">
            <div className="rb-inner p-4">
              <div className="flex flex-wrap gap-3">
                <label className="flex flex-col gap-1 flex-1 min-w-[140px]">
                  <span className="text-[10px] text-[#555] font-mono uppercase">Boyut</span>
                  <select className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none">
                    <option>1:1 Kare</option>
                    <option>4:3</option>
                    <option>16:9</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1 flex-1 min-w-[140px]">
                  <span className="text-[10px] text-[#555] font-mono uppercase">Kalite</span>
                  <select className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none">
                    <option>Standart</option>
                    <option>Yüksek</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1 flex-1 min-w-[140px]">
                  <span className="text-[10px] text-[#555] font-mono uppercase">Arka plan</span>
                  <select className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none">
                    <option>Beyaz</option>
                    <option>Şeffaf</option>
                    <option>Yok</option>
                  </select>
                </label>
              </div>
            </div>
            </div>
          )}
        </div>

        {/* ── STYLES SECTION ──────────────────────── */}
        <div>
          <h2 className="text-lg font-extrabold mb-1">
            Karar veremedin mi? Yaratıcı stillerimizden faydalan{' '}
            <span className="text-base">👇</span>
          </h2>
          <p className="text-xs text-[#555] font-mono mb-5">
            Bir stile tıkla — prompt otomatik zenginleşir
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {STICKER_STYLES.slice(0, 6).map((style) => (
              <div key={style.id} className="rb-wrap">
              <button
                onClick={() => handleStyleClick(style)}
                className={`rb-inner w-full flex flex-col items-end justify-end text-left transition-colors overflow-hidden relative
                  ${selectedStyle?.id === style.id ? 'ring-2 ring-[#00d9ff]' : ''}`}
                style={{ minHeight: '140px' }}
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(/styles/${style.id}.png)` }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                {/* Text */}
                <div className="relative z-10 p-3 w-full">
                  <span className={`block text-sm font-extrabold ${selectedStyle?.id === style.id ? 'text-[#00d9ff]' : 'text-white'}`}>
                    {style.name}
                  </span>
                  <span className="block text-[10px] text-white/60 leading-relaxed mt-0.5">
                    {style.description}
                  </span>
                </div>
              </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}

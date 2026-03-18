/**
 * useGeneration - Sticker generation state and methods
 * Manages prompt, generation flow, image loading, and error handling
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { GenerationResponse } from '@/types';

interface UseGenerationReturn {
  prompt: string;
  setPrompt: (prompt: string) => void;
  imageUrl: string | null;
  isGenerating: boolean;
  error: string | null;
  elapsedTime: number;
  generate: () => Promise<void>;
  cancel: () => void;
  reset: () => void;
  clearError: () => void;
}

export function useGeneration(onAuthRequired?: () => void): UseGenerationReturn {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Elapsed time counter
  useEffect(() => {
    if (!isGenerating) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsedTime(elapsed);
      }
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGenerating]);

  const validatePrompt = (text: string): string | null => {
    const trimmed = text.trim();
    if (trimmed.length < 3) {
      return 'Prompt must be at least 3 characters';
    }
    if (trimmed.length > 512) {
      return 'Prompt must be less than 512 characters';
    }
    return null;
  };

  const generate = useCallback(async () => {
    const validationError = validatePrompt(prompt);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setElapsedTime(0);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
        signal: abortControllerRef.current.signal,
      });

      // Check for auth requirement
      if (response.status === 401) {
        setIsGenerating(false);
        onAuthRequired?.();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const data: GenerationResponse = await response.json();
      setImageUrl(data.imageUrl);
      setError(null);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Generation cancelled');
      } else {
        const message = err instanceof Error ? err.message : 'Generation failed';
        setError(message);
      }
    } finally {
      setIsGenerating(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [prompt, onAuthRequired]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsGenerating(false);
  }, []);

  const reset = useCallback(() => {
    setPrompt('');
    setImageUrl(null);
    setError(null);
    setElapsedTime(0);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    prompt,
    setPrompt,
    imageUrl,
    isGenerating,
    error,
    elapsedTime,
    generate,
    cancel,
    reset,
    clearError,
  };
}

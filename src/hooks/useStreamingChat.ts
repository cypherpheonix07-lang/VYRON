/**
 * PROJECT BRAHMA — STREAMING CHAT HOOK (PHASE C.2)
 * Dual-mode token accumulator.
 * Live mode throttles SSE tokens to 60fps; Demo mode reveals characters at speed.
 */

import { useState, useRef, useEffect, useCallback } from "react";

export interface UseStreamingChatOptions {
  speed?: number; // ms per token or character
  isDemo?: boolean;
}

export interface UseStreamingChatReturn {
  displayedText: string;
  isComplete: boolean;
  abort: () => void;
  streamText: (fullText: string, onDone?: () => void) => void;
  pushChunk: (chunk: string) => void;
  reset: () => void;
}

export function useStreamingChat(options: UseStreamingChatOptions = {}): UseStreamingChatReturn {
  const { speed = 15, isDemo = false } = options;
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isComplete, setIsComplete] = useState<boolean>(true);

  const fullTextRef = useRef<string>("");
  const currentIndexRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const onDoneCallbackRef = useRef<(() => void) | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  const abort = useCallback(() => {
    clearTimers();
    setDisplayedText(fullTextRef.current);
    setIsComplete(true);
    onDoneCallbackRef.current?.();
  }, [clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    fullTextRef.current = "";
    currentIndexRef.current = 0;
    setDisplayedText("");
    setIsComplete(true);
  }, [clearTimers]);

  // Demo mode: character-by-character reveal
  const streamText = useCallback(
    (text: string, onDone?: () => void) => {
      clearTimers();
      fullTextRef.current = text;
      currentIndexRef.current = 0;
      setDisplayedText("");
      setIsComplete(false);
      onDoneCallbackRef.current = onDone || null;

      if (!isDemo || speed <= 0) {
        setDisplayedText(text);
        setIsComplete(true);
        onDone?.();
        return;
      }

      let lastTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - lastTime;
        if (elapsed >= speed) {
          const stepSize = Math.max(1, Math.floor(elapsed / speed));
          currentIndexRef.current = Math.min(text.length, currentIndexRef.current + stepSize);
          setDisplayedText(text.slice(0, currentIndexRef.current));
          lastTime = now;
        }

        if (currentIndexRef.current < text.length) {
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          setIsComplete(true);
          onDoneCallbackRef.current?.();
        }
      };

      animFrameRef.current = requestAnimationFrame(step);
    },
    [clearTimers, isDemo, speed]
  );

  // Live mode: push incoming token chunk throttled to 60fps
  const pushChunk = useCallback(
    (chunk: string) => {
      fullTextRef.current += chunk;
      setIsComplete(false);

      if (!animFrameRef.current) {
        animFrameRef.current = requestAnimationFrame(() => {
          setDisplayedText(fullTextRef.current);
          animFrameRef.current = null;
        });
      }
    },
    []
  );

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return {
    displayedText,
    isComplete,
    abort,
    streamText,
    pushChunk,
    reset,
  };
}

'use client';

import { useEffect } from 'react';

/**
 * Some machines (older integrated GPUs, stale drivers, remote desktop, or Chrome
 * with hardware acceleration switched off) fall back to software rendering. There,
 * `backdrop-filter` and large `blur()` layers are recomputed on the CPU every frame
 * and the tab locks up.
 *
 * This watches the first few seconds of real frames and, if the device can't keep
 * up, switches the page into a "lite" render mode that drops those effects. The
 * decision is remembered so later visits start out lite with no flash.
 *
 * See the matching `[data-perf='lite']` rules in globals.css.
 */

export const RENDER_MODE_STORAGE_KEY = 'aspire:render-mode';

const SAMPLE_DURATION_MS = 2500;
/** A frame this long means we already missed several 60fps budgets. */
const SLOW_FRAME_MS = 55;
/** Ignore gaps this large — the tab was backgrounded, not janky. */
const STALLED_FRAME_MS = 1000;
const SLOW_FRAME_LIMIT = 12;

type RenderMode = 'lite' | 'full';

const applyMode = (mode: RenderMode) => {
  document.documentElement.dataset.perf = mode === 'lite' ? 'lite' : 'full';
};

const remember = (mode: RenderMode) => {
  try {
    localStorage.setItem(RENDER_MODE_STORAGE_KEY, mode);
  } catch {
    // Private browsing or blocked storage: we just re-measure next visit.
  }
};

const readRemembered = (): RenderMode | null => {
  try {
    const stored = localStorage.getItem(RENDER_MODE_STORAGE_KEY);
    return stored === 'lite' || stored === 'full' ? stored : null;
  } catch {
    return null;
  }
};

/** Hints that are known before a single frame is drawn. */
const isLowPoweredDevice = () => {
  const nav = navigator as Navigator & { deviceMemory?: number };

  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4) return true;
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4) return true;

  return (
    window.matchMedia('(prefers-reduced-transparency: reduce)').matches ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
};

export default function PerfGuard() {
  useEffect(() => {
    const remembered = readRemembered();
    if (remembered) {
      applyMode(remembered);
      return;
    }

    if (isLowPoweredDevice()) {
      applyMode('lite');
      remember('lite');
      return;
    }

    applyMode('full');

    let rafId = 0;
    let slowFrames = 0;
    let lastFrame = performance.now();
    const startedAt = lastFrame;

    const sample = (now: number) => {
      const delta = now - lastFrame;
      lastFrame = now;

      if (delta > SLOW_FRAME_MS && delta < STALLED_FRAME_MS) {
        slowFrames += 1;
      }

      if (slowFrames >= SLOW_FRAME_LIMIT) {
        applyMode('lite');
        remember('lite');
        return;
      }

      if (now - startedAt >= SAMPLE_DURATION_MS) {
        remember('full');
        return;
      }

      rafId = requestAnimationFrame(sample);
    };

    rafId = requestAnimationFrame(sample);

    return () => cancelAnimationFrame(rafId);
  }, []);

  return null;
}

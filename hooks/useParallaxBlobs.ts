'use client';

import { useEffect, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ParallaxBlobConfig {
  /**
   * Movement intensity relative to mouse position.
   * 0.0 = no movement at all, 1.0 = moves at full maxPx range.
   * Use lower values for blobs that appear "further away" (reinforces depth).
   */
  depth: number;

  /**
   * Maximum displacement in pixels from the blob's origin position.
   * @default 25
   */
  maxPx?: number;

  /**
   * Lerp interpolation factor per frame (0.0 = infinite inertia, 1.0 = instant).
   * Lower values = more spring/inertia feel.
   * @default 0.06
   */
  lerpFactor?: number;
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * `useParallaxBlobs`
 *
 * Tracks the normalized mouse position (-1 to +1 per axis) and smoothly
 * translates each registered DOM element by an amount proportional to its
 * `depth` factor. Animation is driven by `requestAnimationFrame` + linear
 * interpolation, producing a natural inertia / spring feel.
 *
 * Each blob can have an independent `depth`, `maxPx`, and `lerpFactor`,
 * making it easy to fake parallax depth:
 *   - depth 1.0 → "closest" blob, moves most
 *   - depth 0.4 → "furthest" blob, barely moves
 *
 * Usage:
 * ```tsx
 * const { setRef } = useParallaxBlobs([
 *   { depth: 1.0, maxPx: 30, lerpFactor: 0.065 }, // blob 0
 *   { depth: 0.6, maxPx: 26, lerpFactor: 0.055 }, // blob 1
 * ]);
 *
 * <div ref={setRef(0)} />
 * <div ref={setRef(1)} />
 * ```
 */
export function useParallaxBlobs(configs: ParallaxBlobConfig[]) {
  // Mutable refs — never trigger re-renders
  const blobRefs = useRef<(HTMLElement | null)[]>(
    new Array(configs.length).fill(null),
  );

  // Per-blob interpolated offsets
  const offsets = useRef(configs.map(() => ({ x: 0, y: 0 })));

  // Normalized mouse position: -1 (left/top) → +1 (right/bottom)
  const mouse = useRef({ nx: 0, ny: 0 });

  const rafId = useRef<number | null>(null);

  /**
   * Returns a callback ref for the given blob index.
   * Attach directly to a DOM element: `ref={setRef(0)}`
   */
  const setRef =
    (index: number) => (el: HTMLElement | null) => {
      blobRefs.current[index] = el;
    };

  useEffect(() => {
    const lastApplied = configs.map(() => ({ x: -999, y: -999 }));

    // ── Mouse tracking ──────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.nx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.ny = (e.clientY / window.innerHeight) * 2 - 1;
    };

    // When mouse leaves viewport, ease back to origin
    const onMouseLeave = () => {
      mouse.current.nx = 0;
      mouse.current.ny = 0;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });

    // ── RAF animation loop ──────────────────────────────────────────────────
    const tick = () => {
      const { nx, ny } = mouse.current;

      configs.forEach((cfg, i) => {
        const el = blobRefs.current[i];
        if (!el) return;

        const maxPx = cfg.maxPx ?? 25;
        const speed = cfg.lerpFactor ?? 0.06;

        // Target offset: move in the direction of the mouse, scaled by depth
        const targetX = nx * maxPx * cfg.depth;
        const targetY = ny * maxPx * cfg.depth;

        // Smooth interpolation — creates the inertia/spring effect
        const currentX = lerp(offsets.current[i].x, targetX, speed);
        const currentY = lerp(offsets.current[i].y, targetY, speed);

        offsets.current[i].x = currentX;
        offsets.current[i].y = currentY;

        // Only update DOM style if position changed significantly
        if (
          Math.abs(currentX - lastApplied[i].x) > 0.01 ||
          Math.abs(currentY - lastApplied[i].y) > 0.01
        ) {
          lastApplied[i].x = currentX;
          lastApplied[i].y = currentY;
          el.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
        }
      });

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);

    // ── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { setRef };
}

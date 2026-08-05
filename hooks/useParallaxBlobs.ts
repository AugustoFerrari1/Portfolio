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

// ─── Idle drift constants ──────────────────────────────────────────────────────
const IDLE_DELAY_MS = 1800; // ms before idle drift kicks in
const IDLE_PHASES = [0, Math.PI * 0.65, Math.PI * 1.3, Math.PI * 1.95];
const IDLE_FREQ = 0.00035;   // rad/ms — slow floating (~18s full cycle)
const IDLE_AMPLITUDE = 0.28; // fraction of maxPx used for idle drift

export function useParallaxBlobs(configs: ParallaxBlobConfig[]) {
  // Mutable refs — never trigger re-renders
  const blobRefs = useRef<(HTMLElement | null)[]>(
    new Array(configs.length).fill(null),
  );

  // Per-blob interpolated offsets
  const offsets = useRef(configs.map(() => ({ x: 0, y: 0 })));

  // Normalized mouse position: -1 (left/top) → +1 (right/bottom)
  const mouse = useRef({ nx: 0, ny: 0 });

  // Idle tracking
  const lastMouseMoveTime = useRef<number>(performance.now());
  const isIdle = useRef<boolean>(false);

  const rafId = useRef<number | null>(null);

  const setRef =
    (index: number) => (el: HTMLElement | null) => {
      blobRefs.current[index] = el;
    };

  useEffect(() => {
    // ── Mouse tracking ──────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.nx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.ny = (e.clientY / window.innerHeight) * 2 - 1;
      lastMouseMoveTime.current = performance.now();
      isIdle.current = false;
    };

    // When mouse leaves viewport, ease back to origin
    const onMouseLeave = () => {
      mouse.current.nx = 0;
      mouse.current.ny = 0;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });

    // ── RAF animation loop ──────────────────────────────────────────────────
    const tick = (timestamp: number) => {
      const timeSinceMove = timestamp - lastMouseMoveTime.current;
      const mouseIsIdle = timeSinceMove > IDLE_DELAY_MS;

      if (mouseIsIdle && !isIdle.current) {
        isIdle.current = true;
      }

      const { nx, ny } = mouse.current;

      configs.forEach((cfg, i) => {
        const el = blobRefs.current[i];
        if (!el) return;

        const maxPx = cfg.maxPx ?? 25;
        const speed = cfg.lerpFactor ?? 0.06;

        let targetX: number;
        let targetY: number;

        if (mouseIsIdle) {
          const phase = IDLE_PHASES[i] ?? 0;
          const t = timestamp * IDLE_FREQ;
          const idleAmp = maxPx * cfg.depth * IDLE_AMPLITUDE;
          targetX = Math.sin(t + phase) * idleAmp;
          targetY = Math.cos(t * 0.73 + phase) * idleAmp;
        } else {
          targetX = nx * maxPx * cfg.depth;
          targetY = ny * maxPx * cfg.depth;
        }

        offsets.current[i].x = lerp(offsets.current[i].x, targetX, speed);
        offsets.current[i].y = lerp(offsets.current[i].y, targetY, speed);

        const writeX = Math.round(offsets.current[i].x * 100) / 100;
        const writeY = Math.round(offsets.current[i].y * 100) / 100;

        el.style.transform = `translate3d(${writeX}px, ${writeY}px, 0)`;
      });

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);

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

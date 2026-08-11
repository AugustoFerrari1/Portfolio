'use client';

import { useRef, useEffect } from 'react';

interface NoiseProps {
  patternSize?: number;
  patternScaleX?: number;
  patternScaleY?: number;
  patternRefreshInterval?: number;
  patternAlpha?: number;
  zIndex?: number;
  mixBlendMode?: React.CSSProperties['mixBlendMode'];
}

const Noise = ({
  patternSize = 250,
  patternScaleX = 1.4,
  patternScaleY = 1.5,
  patternRefreshInterval = 2,
  patternAlpha = 9,
  zIndex = 10,
  mixBlendMode = 'overlay',
}: NoiseProps) => {
  const grainRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let frame = 0;
    let animationId: number;
    const canvasSize = 512;

    // Pre-generate 4 offscreen noise pattern canvases once
    const patternDim = 256;
    const NUM_PATTERNS = 4;
    const patterns: CanvasPattern[] = [];

    for (let p = 0; p < NUM_PATTERNS; p++) {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = patternDim;
      offCanvas.height = patternDim;
      const offCtx = offCanvas.getContext('2d');
      if (offCtx) {
        const imageData = offCtx.createImageData(patternDim, patternDim);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const value = Math.random() * 255;
          data[i] = value;
          data[i + 1] = value;
          data[i + 2] = value;
          data[i + 3] = patternAlpha;
        }
        offCtx.putImageData(imageData, 0, 0);
        const pat = ctx.createPattern(offCanvas, 'repeat');
        if (pat) patterns.push(pat);
      }
    }

    if (patterns.length === 0) return;

    let patternIdx = 0;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    };

    const drawGrain = () => {
      ctx.clearRect(0, 0, canvasSize, canvasSize);
      const pattern = patterns[patternIdx];
      patternIdx = (patternIdx + 1) % patterns.length;

      // Apply random offset to shift noise position dynamically each refresh
      const offsetX = Math.floor(Math.random() * patternDim);
      const offsetY = Math.floor(Math.random() * patternDim);

      ctx.save();
      ctx.translate(-offsetX, -offsetY);
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, canvasSize + patternDim, canvasSize + patternDim);
      ctx.restore();
    };

    const loop = () => {
      if (frame % patternRefreshInterval === 0) {
        drawGrain();
      }
      frame++;
      animationId = window.requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resize);
    resize();
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(animationId);
    };
  }, [patternSize, patternScaleX, patternScaleY, patternRefreshInterval, patternAlpha]);

  return (
    <canvas
      ref={grainRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        imageRendering: 'pixelated',
        zIndex,
        mixBlendMode,
      }}
    />
  );
};

export default Noise;


'use client';

import Image from 'next/image';
import styles from './OrganicBlob.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type BlobVariant = 'tl' | 'tr' | 'bl' | 'br';

interface OrganicBlobProps {
  variant: BlobVariant;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Tint color to recolor the 3D blob while keeping its original volume & shading.
   * Defaults to '#796f8a' matching the background.
   */
  tintColor?: string;
  /**
   * Brightness filter multiplier to darken the body without dulling specular 3D highlights.
   * Defaults to 0.68.
   */
  brightness?: number;
  /**
   * Contrast filter multiplier.
   * Defaults to 1.12.
   */
  contrast?: number;
  /**
   * Saturation filter value.
   * Defaults to 0 to remove any blue/violet hue from base image.
   */
  saturate?: number;
}

// ─── Intrinsic dimensions ─────────────────────────────────────────────────────

const DIMENSIONS: Record<BlobVariant, { width: number; height: number }> = {
  tl: { width: 980, height: 780 },
  tr: { width: 950, height: 750 },
  bl: { width: 760, height: 700 },
  br: { width: 780, height: 700 },
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * `OrganicBlob`
 *
 * Renders a pre-generated PNG blob asset (public/blobs/blob-{variant}.png)
 * using next/image. Uses `saturate(0)` to desaturate base image hues combined with
 * `mix-blend-mode: color` in tone #796f8a to achieve a neutral tone matching #796f8a background,
 * preserving glossy 3D specular highlights.
 */
export default function OrganicBlob({
  variant,
  className,
  style,
  tintColor = '#262030ff',
  brightness = 0.68,
  contrast = 1.12,
  saturate = 0,
}: OrganicBlobProps) {
  const { width, height } = DIMENSIONS[variant];
  const imageSrc = `/blobs/blob-${variant}.png`;

  return (
    <div
      className={[styles[`blob--${variant}`], className].filter(Boolean).join(' ')}
      style={{ position: 'relative', ...style }}
      aria-hidden="true"
    >
      <Image
        src={imageSrc}
        alt=""
        width={width}
        height={height}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          filter: `saturate(${saturate}) brightness(${brightness}) contrast(${contrast})`,
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
        priority
        draggable={false}
      />
      {tintColor && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: tintColor,
            mixBlendMode: 'color',
            WebkitMaskImage: `url(${imageSrc})`,
            maskImage: `url(${imageSrc})`,
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            pointerEvents: 'none',
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
        />
      )}
    </div>
  );
}


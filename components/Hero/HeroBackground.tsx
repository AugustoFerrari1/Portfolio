'use client';

import OrganicBlob from '../Blobs/OrganicBlob';
import { useParallaxBlobs } from '@/hooks/useParallaxBlobs';
import styles from './Hero.module.css';

/* ─── Parallax depth config ───────────────────────────────────────────────── */
const BLOB_CONFIGS = [
  { depth: 0.60, maxPx: 26, lerpFactor: 0.075 }, // TL — medium, mid-layer
  { depth: 1.00, maxPx: 30, lerpFactor: 0.085 }, // TR — closest, most reactive
  { depth: 0.40, maxPx: 20, lerpFactor: 0.065 }, // BL — furthest, most subtle
  { depth: 0.75, maxPx: 28, lerpFactor: 0.080 }, // BR — medium-close
  { depth: 0.20, maxPx: 14, lerpFactor: 0.045 }, // TC - top center, very subtle
] as const;

/* ─── Blob tints & filters (same organic dark 3D blobs for both light & dark mode) ─── */
const BLOB_TINT = '#262030ff';
// Slightly boosted brightness and contrast for extra specular shine/brillito
const BLOB_FILTERS = { brightness: 0.78, contrast: 1.22, saturate: 0 };

interface HeroBackgroundProps {
  isLoaded?: boolean;
}

export default function HeroBackground({ isLoaded = false }: HeroBackgroundProps) {
  const { setRef } = useParallaxBlobs([...BLOB_CONFIGS]);

  return (
    <div className={`${styles.heroBackground} ${isLoaded ? styles.heroLoaded : ''}`}>
      {/* Light beam */}
      <div className={styles.lightBeam} />

      {/* ── Organic Blobs ── */}
      <div className={`${styles.blobWrapper} ${styles.blobWrapperTL}`}>
        <div ref={setRef(0)} className={styles.blobParallax}>
          <OrganicBlob variant="tl" className={styles.blobSvgTL} tintColor={BLOB_TINT} {...BLOB_FILTERS} />
        </div>
      </div>

      <div className={`${styles.blobWrapper} ${styles.blobWrapperTR}`}>
        <div ref={setRef(1)} className={styles.blobParallax}>
          <OrganicBlob variant="tr" className={styles.blobSvgTR} tintColor={BLOB_TINT} {...BLOB_FILTERS} />
        </div>
      </div>

      <div className={`${styles.blobWrapper} ${styles.blobWrapperTC}`}>
        <div ref={setRef(4)} className={styles.blobParallax}>
          <OrganicBlob variant="tc" className={styles.blobSvgTC} tintColor={BLOB_TINT} {...BLOB_FILTERS} />
        </div>
      </div>

      <div className={`${styles.blobWrapper} ${styles.blobWrapperBL}`}>
        <div ref={setRef(2)} className={styles.blobParallax}>
          <OrganicBlob variant="bl" className={styles.blobSvgBL} tintColor={BLOB_TINT} {...BLOB_FILTERS} />
        </div>
      </div>

      <div className={`${styles.blobWrapper} ${styles.blobWrapperBR}`}>
        <div ref={setRef(3)} className={styles.blobParallax}>
          <OrganicBlob variant="br" className={styles.blobSvgBR} tintColor={BLOB_TINT} {...BLOB_FILTERS} />
        </div>
      </div>

    </div>
  );
}

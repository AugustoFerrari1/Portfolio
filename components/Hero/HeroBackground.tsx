'use client';

import OrganicBlob from './OrganicBlob';
import { useParallaxBlobs } from '@/hooks/useParallaxBlobs';
import styles from './Hero.module.css';

/* ─── Parallax depth config ───────────────────────────────────────────────── */
const BLOB_CONFIGS = [
  { depth: 0.60, maxPx: 26, lerpFactor: 0.075 }, // TL — medium, mid-layer
  { depth: 1.00, maxPx: 30, lerpFactor: 0.085 }, // TR — closest, most reactive
  { depth: 0.40, maxPx: 20, lerpFactor: 0.065 }, // BL — furthest, most subtle
  { depth: 0.75, maxPx: 28, lerpFactor: 0.080 }, // BR — medium-close
] as const;

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
          <OrganicBlob variant="tl" className={styles.blobSvgTL} />
        </div>
      </div>

      <div className={`${styles.blobWrapper} ${styles.blobWrapperTR}`}>
        <div ref={setRef(1)} className={styles.blobParallax}>
          <OrganicBlob variant="tr" className={styles.blobSvgTR} />
        </div>
      </div>

      <div className={`${styles.blobWrapper} ${styles.blobWrapperBL}`}>
        <div ref={setRef(2)} className={styles.blobParallax}>
          <OrganicBlob variant="bl" className={styles.blobSvgBL} />
        </div>
      </div>

      <div className={`${styles.blobWrapper} ${styles.blobWrapperBR}`}>
        <div ref={setRef(3)} className={styles.blobParallax}>
          <OrganicBlob variant="br" className={styles.blobSvgBR} />
        </div>
      </div>

    </div>
  );
}

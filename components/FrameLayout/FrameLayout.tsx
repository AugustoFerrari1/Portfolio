import type { ReactNode } from 'react';
import styles from './FrameLayout.module.css';

interface FrameLayoutProps {
  children: ReactNode;
}

/**
 * FrameLayout — solo el marco y sus elementos edge.
 * Todo el contenido (nav, hero, secciones) va dentro de {children}.
 */
export default function FrameLayout({ children }: FrameLayoutProps) {
  return (
    <div className={styles.wrapper}>

      {/* ── Marco fijo ── */}
      <div className={styles.frame}>
        {/* Zona de scroll interno */}
        <div className={styles.frameContent}>
          {children}
        </div>
      </div>

      {/* ── Edge elements: fijos al viewport, en zona de margen ── */}
      <div className={styles.edgeLeft} aria-hidden="true">
        Disponible para trabajar — 2027
      </div>
      <div className={styles.edgeRight} aria-hidden="true">
        Ingeniería &amp; Software
      </div>
      <div className={styles.edgeBottom} aria-hidden="true">
        <span className={styles.edgeBottomDesktop}>Personal Design</span>
        <span className={styles.edgeBottomMobile}>Ingeniería &amp; Software</span>
      </div>
    </div>
  );
}

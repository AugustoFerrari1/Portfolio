'use client';

import styles from './Hero.module.css';

interface AnimatedBurgerIconProps {
  isHovered: boolean;
  isOpen: boolean;
}

/**
 * AnimatedBurgerIcon — 
 * - Normal: 9 círculos ahuecados en matriz 3x3
 * - Hover (cerrado): 4 esquinas ahuecadas + cruz (+) en el centro
 * - Abierto (menuOpen): Cruz diagonal (X)
 */
export default function AnimatedBurgerIcon({ isHovered, isOpen }: AnimatedBurgerIconProps) {
  return (
    <div className={styles.burgerIconWrapper}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {/* 4 Círculos de las esquinas (ahuecados) */}
        <circle cx="5" cy="5" r="1.8" className={`${styles.dotCorner} ${isOpen ? styles.dotCornerHidden : ''}`} />
        <circle cx="19" cy="5" r="1.8" className={`${styles.dotCorner} ${isOpen ? styles.dotCornerHidden : ''}`} />
        <circle cx="5" cy="19" r="1.8" className={`${styles.dotCorner} ${isOpen ? styles.dotCornerHidden : ''}`} />
        <circle cx="19" cy="19" r="1.8" className={`${styles.dotCorner} ${isOpen ? styles.dotCornerHidden : ''}`} />

        {/* 5 Círculos internos (ahuecados) — se desvanecen en hover o cuando está abierto */}
        <g className={`${styles.innerDotsGroup} ${(isHovered || isOpen) ? styles.innerDotsHidden : ''}`}>
          <circle cx="12" cy="5" r="1.8" className={styles.dotInner} />
          <circle cx="5" cy="12" r="1.8" className={styles.dotInner} />
          <circle cx="12" cy="12" r="1.8" className={styles.dotInner} />
          <circle cx="19" cy="12" r="1.8" className={styles.dotInner} />
          <circle cx="12" cy="19" r="1.8" className={styles.dotInner} />
        </g>

        {/* Cruz central (+ que rota a X cuando está abierto) */}
        <g className={`${styles.crossGroup} ${isOpen ? styles.crossOpen : (isHovered ? styles.crossHovered : '')}`}>
          <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

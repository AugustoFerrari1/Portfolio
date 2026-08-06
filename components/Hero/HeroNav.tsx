'use client';

import { useState } from 'react';
import Image from 'next/image';
import AnimatedBurgerIcon from './AnimatedBurgerIcon';
import styles from './Hero.module.css';

interface HeroNavProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * HeroNav — Barra de navegación superior dentro de Hero
 */
export default function HeroNav({ isOpen, onToggle }: HeroNavProps) {
  const [hovered, setHovered] = useState(false);
  const [lang, setLang] = useState<'ES' | 'EN'>('ES');

  return (
    <header className={styles.nav}>
      {/* Esquina izquierda vacía */}
      <div className={styles.navLogo} aria-label="Augusto Ferrari">
        <Image
          src="/logofir.png"
          alt="Augusto Ferrari"
          width={779}
          height={607}
          className={styles.navLogoImage}
          priority
        />
      </div>

      {/* Controles de la derecha: EN/ES, Luna, Burger */}
      <div className={styles.navRightControls}>
        {/* Idioma ES/EN */}
        <button
          className={styles.langBtn}
          onClick={() => setLang(l => (l === 'ES' ? 'EN' : 'ES'))}
          aria-label="Toggle language"
        >
          {lang}
        </button>

        {/* Toggle Tema (Luna) */}
        <button className={styles.themeBtn} aria-label="Toggle theme">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>

        {/* Burger con animación */}
        <button
          id="menu-toggle"
          className={`${styles.menuBtn} ${isOpen ? styles.menuBtnActive : ''}`}
          onClick={onToggle}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
        >
          <AnimatedBurgerIcon isHovered={hovered} isOpen={isOpen} />
          <span className={`${styles.menuTooltip} ${hovered ? styles.menuTooltipVisible : ''}`}>
            {isOpen ? 'Cerrar' : 'Menu'}
          </span>
        </button>
      </div>
    </header>
  );
}

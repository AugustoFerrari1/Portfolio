'use client';

import { useNav, type ViewId } from '@/components/NavContext';
import Noise from './Noise';
import styles from './Hero.module.css';

const NAV_ITEMS: { num: string; label: string; view: ViewId }[] = [
  { num: '01', label: 'Inicio', view: 'home' },
  { num: '02', label: 'Proyectos', view: 'projects' },
  { num: '03', label: 'Sobre mí', view: 'about' },
  { num: '04', label: 'Contacto', view: 'contact' },
];

const SOCIAL_ITEMS = [
  { label: 'instagram', href: 'https://www.instagram.com/aguferrari1/' },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/augusto-ferrari' },
];

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const { navigate } = useNav();

  function handleNav(view: ViewId) {
    navigate(view);
    onClose();
  }

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
      aria-hidden={!isOpen}
    >
      {/* Capa de Blur & Root BG traslúcido */}
      <div className={styles.overlayBlur} aria-hidden="true" />

      {/* Noise sobre el blur, bajo el nav */}
      <Noise
        patternSize={250}
        patternRefreshInterval={2}
        patternAlpha={8}
        zIndex={2}
        mixBlendMode="overlay"
      />

      {/* Nav left-aligned, centrada verticalmente */}
      <nav className={styles.overlayNav}>
        {NAV_ITEMS.map(({ num, label, view }, i) => (
          <button
            key={num}
            className={styles.overlayItem}
            style={{ transitionDelay: isOpen ? `${i * 60 + 80}ms` : '0ms' }}
            onClick={() => handleNav(view)}
          >
            <span className={styles.overlayLabelWrapper}>
              <span className={styles.overlayLabel}>{label}</span>
              <span className={styles.overlayNum}>{num}</span>
            </span>
          </button>
        ))}

        {/* Redes sociales debajo de la última opción */}
        <div
          className={styles.overlaySocials}
          style={{ transitionDelay: isOpen ? `${NAV_ITEMS.length * 60 + 100}ms` : '0ms' }}
        >
          {SOCIAL_ITEMS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <span className={styles.socialArrow} aria-hidden="true">↗</span>
              <span>{label}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}

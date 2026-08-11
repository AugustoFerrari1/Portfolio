'use client';

import { useLanguage } from '@/components/LanguageContext';
import { useNav, type ViewId } from '@/components/NavContext';
import Noise from '../Noise/Noise';
import styles from '../Hero/Hero.module.css';
import InvertRevealGroup from '@/components/InvertReveal/InvertRevealGroup';

type MenuViewId = 'home' | 'projects' | 'about' | 'contact';

const NAV_ITEMS: { num: string; view: MenuViewId }[] = [
  { num: '01', view: 'home' },
  { num: '02', view: 'projects' },
  { num: '03', view: 'about' },
  { num: '04', view: 'contact' },
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
  const { t } = useLanguage();

  function handleNav(view: ViewId) {
    navigate(view);
    onClose();
  }

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
      aria-hidden={!isOpen}
    >
      <div className={styles.overlayBlur} aria-hidden="true" />

      <Noise
        patternSize={250}
        patternRefreshInterval={2}
        patternAlpha={8}
        zIndex={2}
        mixBlendMode="overlay"
      />

      {/* Wrapper que mantiene el layout original del nav (columna alineada a la izquierda) */}
      <nav className={styles.overlayNav}>

        {/* Grupo de navegación — círculo grande, cubre los 4 ítems */}
        <InvertRevealGroup
          radius={40}
          smoothing={0.25}
          as="div"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 'clamp(0px, 0.7vh, 8px)',
            width: '100%',
          }}
        >
          {NAV_ITEMS.map(({ num, view }, i) => (
            <button
              key={num}
              className={styles.overlayItem}
              style={{ transitionDelay: isOpen ? `${i * 60 + 80}ms` : '0ms' }}
              onClick={() => handleNav(view)}
            >
              <span className={styles.overlayLabelWrapper}>
                <span className={styles.overlayLabel}>{t.menu.items[view]}</span>
                <span className={styles.overlayNum}>{num}</span>
              </span>
            </button>
          ))}
        </InvertRevealGroup>

        {/* Grupo de redes sociales — círculo más chico, separado del nav */}
        <InvertRevealGroup
          radius={22}
          smoothing={0.25}
          as="div"
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
              <svg
                className={styles.socialArrow}
                aria-hidden="true"
                viewBox="0 0 12 12"
                focusable="false"
              >
                <path d="M3 3h6v6" />
                <path d="M9 3 3 9" />
              </svg>
              <span>{label}</span>
            </a>
          ))}
        </InvertRevealGroup>

      </nav>
    </div>
  );
}

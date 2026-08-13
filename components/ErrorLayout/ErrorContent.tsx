'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageContext';
import { NavProvider, useNav } from '@/components/NavContext';
import HeroNav from '@/components/Hero/HeroNav';
import MenuOverlay from '@/components/BurgerThings/MenuOverlay';
import HeroBackground from '@/components/Hero/HeroBackground';
import CustomCursor from '@/components/CustomCursor';
import Preloader from '@/components/Preloader/Preloader';
import InvertReveal from '@/components/InvertReveal/InvertReveal';
import InvertRevealGroup from '@/components/InvertReveal/InvertRevealGroup';
import styles from './ErrorContent.module.css';

interface ErrorContentProps {
  type?: '404' | 'generic';
  code?: string;
  title?: string;
  description?: string;
  reset?: () => void;
}

function ErrorContentInner({
  type = '404',
  code,
  title,
  description,
  reset,
}: ErrorContentProps) {
  const { t } = useLanguage();
  const { currentView } = useNav();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [prevView, setPrevView] = useState(currentView);

  const displayCode = code || (type === '404' ? t.error.notFoundCode : t.error.genericCode);
  const displayTitle = title || (type === '404' ? t.error.notFoundTitle : t.error.genericTitle);
  const displayDescription =
    description || (type === '404' ? t.error.notFoundDescription : t.error.genericDescription);

  // Si el usuario selecciona un ítem del MenuOverlay estando en la página de error,
  // redirigir a la página principal '/' donde opera la SPA
  useEffect(() => {
    if (currentView !== prevView) {
      setPrevView(currentView);
      if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        router.push('/');
      }
    }
  }, [currentView, prevView, router]);

  return (
    <div className={styles.root}>
      {/* ── Preloader intro ── */}
      <Preloader onComplete={() => setIsLoaded(true)} />

      {/* ── Custom Cursor ── */}
      <CustomCursor />

      {/* ── Fondo persistente (Blobs 3D, Light Beam, Noise) ── */}
      <HeroBackground isLoaded={isLoaded} />

      {/* ── Nav global ── */}
      <HeroNav isOpen={menuOpen} onToggle={() => setMenuOpen(v => !v)} />

      {/* ── Overlay de menú ── */}
      <MenuOverlay
        isOpen={menuOpen}
        onClose={() => {
          setMenuOpen(false);
          // Si cerró el menú habiendo hecho clic en una opción (redireccionado o vista modificada)
          if (typeof window !== 'undefined' && window.location.pathname !== '/') {
            router.push('/');
          }
        }}
      />

      {/* ── Overlay de cristal ── */}
      <div className={styles.blurOverlay} />

      {/* ── Contenido centrado — sólo visible (fade in) cuando el menú está cerrado ── */}
      <main
        className={`${styles.inner} ${!menuOpen ? styles.innerActive : ''}`}
        aria-hidden={menuOpen}
      >
        <div className={styles.errorBox}>
          {/* Código de error estilizado */}
          <div className={styles.codeWrapper}>
            <span className={styles.codeText}>{displayCode}</span>
          </div>

          {/* Título y línea decorativa */}
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{displayTitle}</h1>
            <div className={styles.titleLine} />
          </div>

          {/* Descripción */}
          <p className={styles.description}>{displayDescription}</p>

          {/* Botón con efecto InvertReveal sin borde ni background */}
          <InvertRevealGroup radius={17} smoothing={0.25} as="div" className={styles.actionRow}>
            <InvertReveal>
              <Link href="/" className={styles.homeBtn}>
                <svg
                  className={styles.homeBtnIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 12H5M5 12L12 19M5 12L12 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className={styles.homeBtnText}>{t.error.backToHome}</span>
              </Link>
            </InvertReveal>

            {reset && (
              <InvertReveal>
                <button onClick={reset} className={styles.retryBtn} type="button">
                  <span>Reintentar</span>
                </button>
              </InvertReveal>
            )}
          </InvertRevealGroup>
        </div>
      </main>
    </div>
  );
}

export default function ErrorContent(props: ErrorContentProps) {
  return (
    <NavProvider>
      <ErrorContentInner {...props} />
    </NavProvider>
  );
}

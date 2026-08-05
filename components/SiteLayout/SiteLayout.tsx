'use client';

import { useState } from 'react';
import { useNav } from '@/components/NavContext';
import HeroNav from '@/components/Hero/HeroNav';
import MenuOverlay from '@/components/Hero/MenuOverlay';
import HeroContent from '@/components/Hero/HeroContent';
import HeroBackground from '@/components/Hero/HeroBackground';
import Projects from '@/components/Projects';
import About from '@/components/About';
import Contact from '@/components/Contact';
import CustomCursor from '@/components/CustomCursor';
import Preloader from '@/components/Preloader/Preloader';
import styles from './SiteLayout.module.css';

/**
 * SiteLayout — Controla la vista activa (SPA sin scroll).
 * La nav (hamburger) y el fondo persistente del Hero (blobs)
 * están siempre presentes.
 */
export default function SiteLayout() {
  const { currentView } = useNav();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={styles.root}>
      {/* ── Preloader intro ── */}
      <Preloader onComplete={() => setIsLoaded(true)} />

      {/* ── Custom Cursor ── */}
      <CustomCursor />

      {/* ── Fondo persistente (Blobs 3D, Light Beam, Noise) ── */}
      <HeroBackground isLoaded={isLoaded} />

      {/* ── Nav global — siempre visible ── */}
      <HeroNav isOpen={menuOpen} onToggle={() => setMenuOpen(v => !v)} />

      {/* ── Overlay de menú ── */}
      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* ── Vistas — sólo la activa es visible cuando el menú está cerrado ── */}
      <div
        className={`${styles.view} ${currentView === 'home' && !menuOpen ? styles.viewActive : ''}`}
        aria-hidden={currentView !== 'home' || menuOpen}
      >
        <HeroContent isLoaded={isLoaded} />
      </div>

      <div
        className={`${styles.view} ${currentView === 'projects' && !menuOpen ? styles.viewActive : ''}`}
        aria-hidden={currentView !== 'projects' || menuOpen}
      >
        <Projects />
      </div>

      {/* Sobre mí */}
      <div
        className={`${styles.view} ${currentView === 'about' && !menuOpen ? styles.viewActive : ''}`}
        aria-hidden={currentView !== 'about' || menuOpen}
      >
        <About />
      </div>

      <div
        className={`${styles.view} ${currentView === 'contact' && !menuOpen ? styles.viewActive : ''}`}
        aria-hidden={currentView !== 'contact' || menuOpen}
      >
        <Contact />
      </div>

    </div>
  );
}

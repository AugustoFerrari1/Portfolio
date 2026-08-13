'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { useNav } from '@/components/NavContext';
import Noise from '../Noise/Noise';
import styles from './Hero.module.css';
import InvertReveal from '@/components/InvertReveal/InvertReveal';
import InvertRevealGroup from '@/components/InvertReveal/InvertRevealGroup';

interface HeroContentProps {
  isLoaded?: boolean;
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.ctaArrow}
    >
      <path
        d="M4 12H20M20 12L13 5M20 12L13 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HeroContent({ isLoaded = false }: HeroContentProps) {
  const { navigate, currentView } = useNav();
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isLoaded && currentView === 'home') {
      setIsVisible(false);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
      return () => cancelAnimationFrame(frame);
    } else {
      setIsVisible(false);
    }
  }, [isLoaded, currentView]);

  return (
    <section id="home" className={`${styles.hero} ${isVisible ? styles.heroLoaded : ''}`}>

      <Noise
        patternSize={250}
        patternRefreshInterval={2}
        patternAlpha={8}
        zIndex={6}
        mixBlendMode="overlay"
      />

      <div className={styles.heroCenter}>
        <div className={styles.titleContainer}>
          {/* InvertRevealGroup: trackea el mouse y emite coordenadas absolutas.
              Cada InvertReveal hijo mantiene su propio isolation + overlay,
              pero todos muestran el círculo en la misma posición absoluta.
              Resultado: el círculo fluye sin cortes entre ambas líneas. */}
          <InvertRevealGroup
            radius={17}
            smoothing={0.25}
            as="h1"
            className={styles.heroTitle}
          >
            <span className={styles.heroLine}>
              <span className={styles.doubleTextOutline}>
                {t.hero.line1Outline}
              </span>{' '}
              <InvertReveal>
                <span className={`${styles.doubleTextSolid} ${styles.solidWithWave}`}>
                  {t.hero.line1Solid}
                </span>
              </InvertReveal>
            </span>
            <span className={styles.heroLine}>
              <span className={styles.doubleTextOutline}>
                {t.hero.line2Outline}
              </span>{' '}
              <InvertReveal>
                <span className={`${styles.doubleTextSolid} ${styles.solidWithWave}`}>
                  {t.hero.line2Solid}
                </span>
              </InvertReveal>
            </span>
          </InvertRevealGroup>
        </div>


        <p className={styles.heroDescription}>
          <span className={styles.descriptionDesktop}>
            {t.hero.descriptionLine1}
            <br />{t.hero.descriptionLine2}
          </span>
          <span className={styles.descriptionMobile}>
            <span>{t.hero.descriptionLine1}</span>
            <span>{t.hero.descriptionLine2}</span>
          </span>
        </p>

        <InvertRevealGroup
          radius={17}
          smoothing={0.25}
          as="div"
          className={styles.heroCtas}
        >
          <div className={styles.heroCtasLine}>
            <InvertReveal>
              <button
                className={styles.ctaLink}
                onClick={() => navigate('projects')}
              >
                <ArrowIcon /> {t.hero.projectsCta}
              </button>
            </InvertReveal>
            <InvertReveal>
              <button
                className={styles.ctaLink}
                onClick={() => navigate('about')}
              >
                <ArrowIcon /> {t.hero.aboutCta}
              </button>
            </InvertReveal>
          </div>
        </InvertRevealGroup>
      </div>
    </section>
  );
}

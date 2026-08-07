'use client';

import { useLanguage } from '@/components/LanguageContext';
import { useNav } from '@/components/NavContext';
import Noise from '../Noise/Noise';
import styles from './Hero.module.css';
import { InvertReveal, InvertRevealGroup } from '../InvertReveal';

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
  const { navigate } = useNav();
  const { t } = useLanguage();

  return (
    <section id="home" className={`${styles.hero} ${isLoaded ? styles.heroLoaded : ''}`}>
      <Noise
        patternSize={250}
        patternRefreshInterval={2}
        patternAlpha={8}
        zIndex={6}
        mixBlendMode="overlay"
      />

      <div className={styles.heroCenter}>
        <div className={styles.titleContainer}>
          <h1 className={styles.heroTitle}>
            <InvertRevealGroup radius={20}>
              <span className={styles.heroLine}>
                <span className={styles.doubleTextOutline}>
                  {t.hero.line1Outline}
                </span>{' '}
                <InvertReveal revealClassName={styles.reveal}>
                  <span className={`${styles.doubleTextSolid} ${styles.solidWithWave}`}>
                    {t.hero.line1Solid}
                  </span>
                </InvertReveal>
              </span>
              <span className={styles.heroLine}>
                <span className={styles.doubleTextOutline}>
                  {t.hero.line2Outline}
                </span>{' '}
                <InvertReveal revealClassName={styles.reveal}>
                  <span className={`${styles.doubleTextSolid} ${styles.solidWithWave}`}>
                    {t.hero.line2Solid}
                  </span>
                </InvertReveal>
              </span>
            </InvertRevealGroup>
          </h1>
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

        <div className={styles.heroCtas}>
          <button
            className={styles.ctaLink}
            onClick={() => navigate('projects')}
          >
            <ArrowIcon /> {t.hero.projectsCta}
          </button>
          <button
            className={styles.ctaLink}
            onClick={() => navigate('about')}
          >
            <ArrowIcon /> {t.hero.aboutCta}
          </button>
        </div>
      </div>
    </section>
  );
}
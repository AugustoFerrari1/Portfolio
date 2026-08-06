'use client';

import { useNav } from '@/components/NavContext';
import Noise from './Noise';
import styles from './Hero.module.css';

interface HeroContentProps {
  isLoaded?: boolean;
}

export default function HeroContent({ isLoaded = false }: HeroContentProps) {
  const { navigate } = useNav();

  return (
    <section id="home" className={`${styles.hero} ${isLoaded ? styles.heroLoaded : ''}`}>

      {/* Noise canvas — sobre blobs, debajo del texto */}
      <Noise
        patternSize={250}
        patternRefreshInterval={2}
        patternAlpha={8}
        zIndex={6}
        mixBlendMode="overlay"
      />

      {/* Contenido central */}
      <div className={styles.heroCenter}>
        <div className={styles.titleContainer}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroLine}>
              <span className={styles.doubleTextOutline}>
                HOLA, SOY
              </span>{' '}
              <span className={`${styles.doubleTextSolid} ${styles.solidWithWave}`}>
                AUGUSTO FERRARI
              </span>
            </span>
            <span className={styles.heroLine}>
              <span className={styles.doubleTextOutline}>
                INGENIERO EN
              </span>{' '}
              <span className={`${styles.doubleTextSolid} ${styles.solidWithWave}`}>
                SISTEMAS
              </span>
            </span>
          </h1>
        </div>

        <p className={styles.heroDescription}>
          <span className={styles.descriptionDesktop}>
            Soy estudiante de ingeniería en sistemas, backend developer
            <br />&amp; arquitecto de infraestructura y bases de datos
          </span>
          <span className={styles.descriptionMobile}>
            <span>Soy estudiante de ingeniería en sistemas, backend developer</span>
            <span>&amp; arquitecto de infraestructura y bases de datos</span>
          </span>
        </p>

        <div className={styles.heroCtas}>
          <button
            className={styles.ctaLink}
            onClick={() => navigate('projects')}
          >
            <span>→</span> mis proyectos
          </button>
          <button
            className={styles.ctaLink}
            onClick={() => navigate('about')}
          >
            <span>→</span>saber más
          </button>
        </div>
      </div>

      {/* Marker lateral */}
      <div className={styles.sideMarker} aria-hidden="true">
        <div className={styles.sideMarkerDot} />
      </div>
    </section>
  );
}

'use client';

import Noise from '@/components/Hero/Noise';
import styles from './Contact.module.css';

const EMAIL = 'augustoferrari@gmail.com';

const SOCIAL_ITEMS = [
  { label: 'instagram', href: 'https://www.instagram.com/aguferrari1/' },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/augusto-ferrari' },
];

export default function Contact() {
  return (
    <section id="contact" className={styles.section} aria-label="Contacto">

      {/* ── Glassmorphism overlay sobre los blobs ── */}
      <div className={styles.blurOverlay} aria-hidden="true" />

      {/* ── Noise animado ── */}
      <Noise
        patternSize={250}
        patternRefreshInterval={2}
        patternAlpha={9}
        zIndex={2}
        mixBlendMode="overlay"
      />

      {/* ── Contenido ── */}
      <div className={styles.inner}>

        {/* ── Título ── */}
        <div className={styles.titleRow}>
          <h1 className={styles.title}>CONTACTO</h1>
          <div className={styles.titleLine} />
        </div>

        {/* ── Fila de datos ── */}
        <div className={styles.dataRow}>

          {/* Email */}
          <div className={styles.dataGroup}>
            <span className={styles.dataLabel}>E-MAIL</span>
            <a
              href={`mailto:${EMAIL}`}
              className={styles.dataLink}
              aria-label={`Enviar email a ${EMAIL}`}
            >
              <span className={styles.dataArrow} aria-hidden="true">↗</span>
              <span>{EMAIL}</span>
            </a>
          </div>

          {/* Redes sociales */}
          <div className={styles.dataGroup}>
            <span className={styles.dataLabel}>REDES SOCIALES</span>
            <div className={styles.socialList}>
              {SOCIAL_ITEMS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.dataLink}
                  aria-label={`Visitar ${label}`}
                >
                  <span className={styles.dataArrow} aria-hidden="true">↗</span>
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

'use client';

import { useLanguage } from '@/components/LanguageContext';
import Noise from '@/components/Noise/Noise';
import styles from './Contact.module.css';

const EMAIL = 'augustoferrari@gmail.com';

const SOCIAL_ITEMS = [
  { label: 'instagram', href: 'https://www.instagram.com/aguferrari1/' },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/augusto-ferrari' },
];

export default function Contact() {
  const { t } = useLanguage();

  return (
    <section id="contact" className={styles.section} aria-label={t.contact.aria}>
      <div className={styles.blurOverlay} aria-hidden="true" />

      <Noise
        patternSize={250}
        patternRefreshInterval={2}
        patternAlpha={9}
        zIndex={2}
        mixBlendMode="overlay"
      />

      <div className={styles.inner}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{t.contact.heading}</h1>
          <div className={styles.titleLine} />
        </div>

        <div className={styles.dataRow}>
          <div className={styles.dataGroup}>
            <span className={styles.dataLabel}>{t.contact.emailLabel}</span>
            <a
              href={`mailto:${EMAIL}`}
              className={styles.dataLink}
              aria-label={`${t.contact.emailAria} ${EMAIL}`}
            >
              <span className={styles.dataArrow} aria-hidden="true">-&gt;</span>
              <span>{EMAIL}</span>
            </a>
          </div>

          <div className={styles.dataGroup}>
            <span className={styles.dataLabel}>{t.contact.socialLabel}</span>
            <div className={styles.socialList}>
              {SOCIAL_ITEMS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.dataLink}
                  aria-label={`${t.contact.socialAria} ${label}`}
                >
                  <span className={styles.dataArrow} aria-hidden="true">-&gt;</span>
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

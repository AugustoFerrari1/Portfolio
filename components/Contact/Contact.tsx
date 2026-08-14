'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import Noise from '@/components/Noise/Noise';
import styles from './Contact.module.css';
import InvertRevealGroup from '@/components/InvertReveal/InvertRevealGroup';
import { useNav } from '@/components/NavContext';

const EMAIL = 'aguferrari100@gmail.com';

const SOCIAL_ITEMS = [
  { label: 'instagram', href: 'https://www.instagram.com/aguferrari1/' },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/augusto-ferrari' },
];

export default function Contact() {
  const { t } = useLanguage();
  const { currentView } = useNav();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (currentView === 'contact') {
      setIsVisible(false);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
      return () => cancelAnimationFrame(frame);
    } else {
      setIsVisible(false);
    }
  }, [currentView]);

  return (
    <section
      id="contact"
      className={`${styles.section} ${isVisible ? styles.sectionVisible : ''}`}
      aria-label={t.contact.aria}
    >
      <div className={styles.blurOverlay} aria-hidden="true" />

      <Noise
        patternSize={250}
        patternRefreshInterval={2}
        patternAlpha={9}
        zIndex={2}
        mixBlendMode="overlay"
      />

      <div className={styles.inner}>
        {/* dataRow anima primero (DOM primero en column-reverse = visualmente abajo → aparece antes) */}
        <InvertRevealGroup
          radius={22}
          smoothing={0.25}
          as="div"
          className={styles.dataRow}
        >
          <div className={styles.dataGroup}>
            <span className={styles.dataLabel}>{t.contact.emailLabel}</span>
            <a
              href={`mailto:${EMAIL}`}
              className={styles.dataLink}
              aria-label={`${t.contact.emailAria} ${EMAIL}`}
            >
              <svg
                className={styles.dataArrow}
                aria-hidden="true"
                viewBox="0 0 12 12"
                focusable="false"
              >
                <path d="M3 3h6v6" />
                <path d="M9 3 3 9" />
              </svg>
              <span className={styles.emailDesktop}>{EMAIL}</span>
              <span className={styles.emailMobile}>gmail</span>
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
                  <svg
                    className={styles.dataArrow}
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
            </div>
          </div>
        </InvertRevealGroup>

        {/* titleRow anima después (delay mayor en CSS) */}
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{t.contact.heading}</h1>
          <div className={styles.titleLine} />
        </div>
      </div>
    </section>
  );
}

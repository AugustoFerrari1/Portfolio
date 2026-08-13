'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import Noise from '@/components/Noise/Noise';
import styles from './About.module.css';
import InvertReveal from '@/components/InvertReveal/InvertReveal';
import InvertRevealGroup from '@/components/InvertReveal/InvertRevealGroup';
import { useNav } from '@/components/NavContext';

const SKILLS = [
  'TypeScript', 'React', 'Next.js', 'Node.js',
  'Java', 'Javascript', 'C++', 'SQL', 'Git',
  'Python', 'Ada', 'Docker', 'Tailwind', 'MongoDB', 'REST APIs',
];

const DOCUMENT_FILES = [
  {
    id: 1,
    color: '#00e5ff',
    hasLanguages: true,
    fileEs: '/docs/cv-augustoferrari.pdf',
    fileEn: '/docs/cv-augustoferrari.pdf',
    downloadNameEs: 'CV-Augusto-Ferrari-ES.pdf',
    downloadNameEn: 'CV-Augusto-Ferrari-EN.pdf',
  },
  {
    id: 2,
    color: '#2563eb',
    hasLanguages: false,
    file: '/docs/certificado.pdf',
    downloadName: 'Certificado-PHP-Augusto-Ferrari.pdf',
  },
];

export default function About() {
  const { t } = useLanguage();
  const { currentView } = useNav();
  const documents = DOCUMENT_FILES.map((doc, index) => ({
    ...doc,
    ...t.about.documents[index],
  }));
  const [active, setActive] = useState(0);
  const prev = () => setActive(i => (i - 1 + documents.length) % documents.length);
  const next = () => setActive(i => (i + 1) % documents.length);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (currentView === 'about') {
      // Resetear y re-disparar la animación cada vez que se navega a About
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
    <section id="about" className={`${styles.section} ${isVisible ? styles.sectionVisible : ''}`}>
      <div className={styles.blurOverlay} aria-hidden="true" />
      <Noise patternSize={250} patternRefreshInterval={2} patternAlpha={9} zIndex={2} mixBlendMode="overlay" />

      <div className={styles.inner}>
        <div className={styles.leftColumn}>
          <div className={styles.sliderWrap}>
            <div className={styles.sliderTrack}>
              {documents.map((doc, i) => {
                const offset = i - active;
                const previewSrc = doc.hasLanguages ? doc.fileEs : doc.file;
                return (
                  <div
                    key={doc.id}
                    className={styles.certCard}
                    style={{
                      '--cert-color': doc.color,
                      '--offset': offset,
                    } as React.CSSProperties}
                    data-active={offset === 0 ? 'true' : undefined}
                    onClick={() => setActive(i)}
                  >
                    <div className={styles.certPreview}>
                      <iframe
                        src={`${previewSrc}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                        className={styles.pdfIframe}
                        title={doc.title}
                      />
                      <div className={styles.certOverlayText}>
                        <span className={styles.certTitle}>{doc.title}</span>
                        {doc.hasLanguages ? (
                          <div className={styles.downloadCardGroup} onClick={(e) => e.stopPropagation()}>
                            <span className={styles.downloadLabel}>{t.about.downloadPdf}:</span>
                            <div className={styles.downloadCardBtns}>
                              <a
                                href={doc.fileEs}
                                download={doc.downloadNameEs}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.downloadCardBtn}
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                  <polyline points="7 10 12 15 17 10" />
                                  <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                <span>{t.about.downloadEs}</span>
                              </a>
                              <a
                                href={doc.fileEn}
                                download={doc.downloadNameEn}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.downloadCardBtn}
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                  <polyline points="7 10 12 15 17 10" />
                                  <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                <span>{t.about.downloadEn}</span>
                              </a>
                            </div>
                          </div>
                        ) : (
                          <a
                            href={doc.file}
                            download={doc.downloadName}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.downloadCardBtn}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            <span>{t.about.downloadPdf}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={styles.sliderDots}>
              {documents.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.sliderDot} ${i === active ? styles.sliderDotActive : ''}`}
                  onClick={() => setActive(i)}
                  aria-label={`${t.about.viewDocument} ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className={styles.sliderControls}>

            <span className={styles.sliderCount}>
              {String(active + 1).padStart(2, '0')} / {String(documents.length).padStart(2, '0')}
            </span>
          </div>

          <div className={styles.mobileDocButtons}>
            {documents.map((doc) => (
              <div key={doc.id} className={styles.mobileDocCard}>
                <div className={styles.mobileDocInfo}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M12 18v-6" />
                    <path d="m9 15 3 3 3-3" />
                  </svg>
                  <span>{doc.title}</span>
                </div>
                <div className={styles.mobileDocActions}>
                  {doc.hasLanguages ? (
                    <>
                      <a
                        href={doc.fileEs}
                        download={doc.downloadNameEs}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.mobileDocLangBtn}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span>{t.about.downloadEs}</span>
                      </a>
                      <a
                        href={doc.fileEn}
                        download={doc.downloadNameEn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.mobileDocLangBtn}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span>{t.about.downloadEn}</span>
                      </a>
                    </>
                  ) : (
                    <a
                      href={doc.file}
                      download={doc.downloadName}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.mobileDocLangBtn}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <span>{t.about.downloadPdf}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.rightColumn}>
          <InvertRevealGroup
            radius={55}
            smoothing={0.25}
            as="h2"
            className={styles.name}
          >
            <InvertReveal>
              <span className={styles.doubleTextSolid}>Augusto</span>
            </InvertReveal>
            <br />
            <InvertReveal>
              <span className={styles.nameOutline}>Ferrari</span>
            </InvertReveal>
          </InvertRevealGroup>
          <p className={styles.bio}>{t.about.bio}</p>

          <div className={styles.divider} />

          <div className={styles.skillsSection}>
            <span className={styles.skillsLabel}>{t.about.technologies}</span>
            <div className={styles.skillsGrid}>
              {SKILLS.map(skill => (
                <span key={skill} className={styles.skillChip}>{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

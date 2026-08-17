'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useNav } from '@/components/NavContext';
import { useLanguage } from '@/components/LanguageContext';
import Noise from '@/components/Noise/Noise';
import styles from './ProjectDetail.module.css';
import InvertReveal from '@/components/InvertReveal/InvertReveal';
import InvertRevealGroup from '@/components/InvertReveal/InvertRevealGroup';

export default function ProjectDetail() {
  const { selectedProject, closeProject, currentView } = useNav();
  const { t } = useLanguage();
  const pd = t.projectDetail;
  const [isVisible, setIsVisible] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!selectedProject || currentView !== 'project-detail') {
      setIsVisible(false);
      return;
    }

    // Resetear primero para que las animaciones CSS se reinicien siempre
    setIsVisible(false);
    setScrollTop(0);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsVisible(true));
    });

    return () => cancelAnimationFrame(frame);
  }, [selectedProject, currentView]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeProject();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [closeProject]);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const nextScrollTop = event.currentTarget.scrollTop;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);

    frameRef.current = requestAnimationFrame(() => {
      setScrollTop(nextScrollTop);
      frameRef.current = null;
    });
  }, []);

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  if (!selectedProject) return null;

  const proj = selectedProject;
  const projDetails = pd.projects[proj.id as keyof typeof pd.projects];
  const role = projDetails?.role ?? proj.role;
  const client = projDetails?.client ?? proj.client;
  const description = projDetails?.description ?? proj.description;

  const categoryParts = proj.category.split(' / ');
  const galleryTop = galleryRef.current?.offsetTop ?? Number.MAX_SAFE_INTEGER;
  const viewportHeight = containerRef.current?.clientHeight ?? 1;
  const galleryTravel = Math.max(viewportHeight * (proj.images.length - 1), 1);
  const galleryScroll = Math.min(Math.max(scrollTop - galleryTop, 0), galleryTravel);
  const slidePosition = (galleryScroll / galleryTravel) * (proj.images.length - 1);
  const isPinned = scrollTop >= galleryTop - 4 && galleryScroll < galleryTravel;

  return (
    <section
      className={`${styles.section} ${isVisible ? styles.sectionVisible : ''}`}
      aria-label={`${pd.ariaLabel} ${proj.title}`}
    >
      <div className={styles.blurOverlay} aria-hidden="true" />
      <Noise patternSize={250} patternRefreshInterval={2} patternAlpha={8} zIndex={2} mixBlendMode="overlay" />

      <div ref={containerRef} className={styles.container} onScroll={handleScroll}>
        <div className={styles.heroBlock}>
          <div className={`${styles.logoCenter} ${isVisible ? styles.logoCenterVisible : ''}`}>
            <Image src={proj.logoImage} alt={`${proj.title} logo`} width={192} height={192} priority />
          </div>
        </div>

        <div className={styles.infoBlock}>
          <InvertRevealGroup
            radius={28}
            smoothing={0.25}
            as="div"
            className={styles.titleRow}
          >
            <InvertReveal>
              <h1 className={styles.projectTitle}>{proj.title.toUpperCase()}</h1>
            </InvertReveal>
            <InvertReveal>
              <a
                href={proj.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.visitLink}
                aria-label={`${pd.visitAria} ${proj.link}`}
              >
                <span>{pd.visitSite}</span>
                <svg
                  className={styles.visitArrow}
                  aria-hidden="true"
                  viewBox="0 0 12 12"
                  focusable="false"
                >
                  <path d="M3 3h6v6" />
                  <path d="M9 3 3 9" />
                </svg>
              </a>
            </InvertReveal>
          </InvertRevealGroup>

          <div className={styles.divider} />

          <div className={styles.infoGrid}>
            <dl className={styles.metaList}>
              <div className={styles.metaItem}>
                <dt className={styles.metaLabel}>{pd.category}</dt>
                <dd className={styles.metaValue}>
                  {categoryParts.map((part) => <span key={part} className={styles.metaChip}>{part}</span>)}
                </dd>
              </div>
              <div className={styles.metaItem}>
                <dt className={styles.metaLabel}>{pd.year}</dt>
                <dd className={styles.metaValue}>{proj.year}</dd>
              </div>
              <div className={styles.metaItem}>
                <dt className={styles.metaLabel}>{pd.role}</dt>
                <dd className={styles.metaValue}>{role}</dd>
              </div>
              <div className={styles.metaItem}>
                <dt className={styles.metaLabel}>{pd.client}</dt>
                <dd className={styles.metaValue}>{client}</dd>
              </div>
            </dl>

            <div className={styles.descColumn}>
              <div className={styles.description}>
                {description.split('\n\n').map((paragraph) => <p key={paragraph} className={styles.descPara}>{paragraph}</p>)}
              </div>
            </div>
          </div>

          <div className={styles.techSection}>
            <span className={styles.techLabel}>{pd.technologies}</span>
            <div className={styles.techList}>
              {proj.technologies.map((tech) => <span key={tech} className={styles.techTag}>{tech}</span>)}
            </div>
          </div>
        </div>

        <section
          ref={galleryRef}
          className={styles.gallery}
          aria-label={`${pd.galleryAria} ${proj.title}`}
          style={{ height: `${proj.images.length * 100}dvh` }}
        >
          <div className={`${styles.galleryStage} ${isPinned ? styles.galleryStagePinned : ''}`}>
            {proj.images.map((src, index) => {
              const distance = index - slidePosition;
              const translateX = Math.max(-100, Math.min(100, distance * 100));
              return (
                <figure
                  key={src}
                  className={styles.galleryItem}
                  aria-hidden={Math.abs(distance) > 0.9}
                  style={{ transform: `translateX(${translateX}%)` }}
                >
                  <div className={styles.galleryImage}>
                    <Image
                      src={src}
                      alt={`${proj.title}: captura ${index + 1}`}
                      width={2938}
                      height={1466}
                      sizes="(max-width: 768px) 100vw, 92vw"
                    />
                  </div>
                </figure>
              );
            })}

            <div className={styles.scrollHint}>
              <svg
                className={styles.scrollHintIcon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 5V19M12 19L6 13M12 19L18 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{pd.scrollHint}</span>
            </div>

            <div className={styles.galleryCounter}>
              <span>{String(Math.min(proj.images.length, Math.max(1, Math.round(slidePosition) + 1))).padStart(2, '0')}</span>
              <span className={styles.counterDivider}>/</span>
              <span>{String(proj.images.length).padStart(2, '0')}</span>
            </div>
          </div>
        </section>

        <div className={styles.backSection}>
          <InvertRevealGroup radius={24} smoothing={0.25} as="div">
            <InvertReveal>
              <button
                type="button"
                onClick={closeProject}
                className={styles.backButton}
                aria-label={pd.backToProjects}
              >
                <svg
                  className={styles.backArrow}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M19 12H5M5 12L12 19M5 12L12 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{pd.backToProjects}</span>
              </button>
            </InvertReveal>
          </InvertRevealGroup>
        </div>
      </div>
    </section>
  );
}


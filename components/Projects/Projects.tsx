'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import Noise from '@/components/Noise/Noise';
import styles from './Projects.module.css';
import InvertRevealGroup from '@/components/InvertReveal/InvertRevealGroup';

const PROJECTS = [
  {
    num: '01',
    title: 'turno.uy',
    category: 'SaaS / Web App',
    image: '/logobien.svg',
  },
];

export default function Projects() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="projects" className={styles.section}>
      <div className={styles.blurOverlay} aria-hidden="true" />
      <Noise patternSize={250} patternRefreshInterval={2} patternAlpha={9} zIndex={2} mixBlendMode="overlay" />

      <div className={styles.inner}>
        <div className={styles.leftColumn}>
          <div className={`${styles.floatingCard} ${activeIndex === null ? styles.floatingCardHidden : ''}`}>
            {PROJECTS.map((p, i) => (
              <div
                key={p.num}
                className={`${styles.cardImage} ${activeIndex === i ? styles.cardImageActive : ''}`}
                style={activeIndex === i ? { backgroundImage: `url(${p.image})` } : {}}
                aria-hidden={activeIndex !== i}
              />
            ))}
            <div className={styles.cardOverlay} aria-hidden="true" />
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.tableWrapper}>
            <div className={styles.listHeader}>
              <h2 className={styles.heading}>{t.projects.heading}</h2>
              <span className={styles.count}>{PROJECTS.length}</span>
            </div>

            <InvertRevealGroup
              radius={28}
              smoothing={0.25}
              as="div"
            >
              <ul
                className={styles.list}
                role="list"
                onMouseLeave={() => setActiveIndex(null)}
              >
                {PROJECTS.map((p, i) => {
                  const isActive = activeIndex === i;
                  return (
                    <li
                      key={p.num}
                      className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
                      onMouseEnter={() => setActiveIndex(i)}
                    >
                      <div className={styles.itemLeft}>
                        <span className={`${styles.arrowBadge} ${isActive ? styles.arrowBadgeActive : ''}`}>
                          -&gt;
                        </span>
                        <span className={styles.title}>{p.title}</span>
                      </div>

                      <span className={styles.category}>{p.category}</span>

                      <div className={styles.itemLine} />
                    </li>
                  );
                })}
              </ul>
            </InvertRevealGroup>
          </div>
        </div>
      </div>
    </section>
  );
}

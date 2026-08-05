'use client';

import { useState } from 'react';
import Noise from '@/components/Hero/Noise';
import styles from './Projects.module.css';

const PROJECTS = [
  {
    num: '01',
    title: 'turno.uy',
    category: 'SaaS / Web App',
    image: '/logobien.svg',
  },
];

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeProject = activeIndex !== null ? PROJECTS[activeIndex] : null;

  return (
    <section id="projects" className={styles.section}>

      {/* ── Capa de Blur & Root BG traslúcido ── */}
      <div className={styles.blurOverlay} aria-hidden="true" />

      {/* ── Noise animado ── */}
      <Noise patternSize={250} patternRefreshInterval={2} patternAlpha={9} zIndex={2} mixBlendMode="overlay" />

      {/* ── Contenido 2 columnas: Tarjeta flotante izquierda | Lista derecha ── */}
      <div className={styles.inner}>

        {/* ── Columna izquierda: Imagen Flotante con bordes redondeados ── */}
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
            {/* Overlay sutil sobre la imagen */}
            <div className={styles.cardOverlay} aria-hidden="true" />
          </div>
        </div>

        {/* ── Columna derecha: Lista de Proyectos ── */}
        <div className={styles.rightColumn}>
          <div className={styles.tableWrapper}>
            <div className={styles.listHeader}>
              <h2 className={styles.heading}>PROYECTOS</h2>
              <span className={styles.count}>{PROJECTS.length}</span>
            </div>

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
                        →
                      </span>
                      <span className={styles.title}>{p.title}</span>
                    </div>

                    <span className={styles.category}>{p.category}</span>

                    {/* Línea divisoria */}
                    <div className={styles.itemLine} />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}

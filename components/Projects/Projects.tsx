'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { useNav } from '@/components/NavContext';
import type { ProjectData } from '@/components/NavContext';
import Noise from '@/components/Noise/Noise';
import styles from './Projects.module.css';
import InvertRevealGroup from '@/components/InvertReveal/InvertRevealGroup';

const PROJECTS: ProjectData[] = [
  {
    id: 'turno-uy',
    title: 'turno.uy',
    category: 'SaaS / Web App',
    year: '2026',
    role: 'Desarrollo full-stack',
    client: 'Proyecto propio',
    description:
      'Turno.uy es una plataforma SaaS de gestión de turnos creada para barberías de Uruguay. Permite que cada negocio tenga su propia página pública de reservas, reciba turnos las 24 horas y administre desde un panel central su agenda, equipo, servicios, clientes, caja y finanzas.\n\nEl sistema está diseñado como una aplicación multi-tenant: cada barbería opera de forma independiente con su propia información, configuración visual, sucursales y usuarios. Los clientes pueden reservar sin crear una cuenta, mediante un enlace directo, código QR o un widget integrable en otros sitios web.\n\nIncluye recordatorios automáticos por WhatsApp y correo, cancelación de reservas, gestión de horarios y bloqueos, perfiles individuales para barberos, sincronización con Google Calendar, estadísticas de negocio, reportes, reseñas, galería, exportación de datos y planes de suscripción con pagos mediante Mercado Pago.',
    technologies: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'PostgreSQL',
      'Prisma ORM',
      'Tailwind CSS',
      'NextAuth',
      'Zod',
      'Mercado Pago',
      'Twilio / WhatsApp',
      'Google Calendar API',
      'Resend',
      'Cloudinary',
      'Vercel Analytics',
      'Google Analytics',
    ],
    link: 'https://turno.uy',
    images: [
      '/proyectos/Turno/1.png',
      '/proyectos/Turno/2.png',
      '/proyectos/Turno/3.png',
      '/proyectos/Turno/4.png',
      '/proyectos/Turno/5.png',
      '/proyectos/Turno/6.png',
      '/proyectos/Turno/7.png',
    ],
    logoImage: '/logobien.svg',
    color: '#c0392b',
  },
];

export default function Projects() {
  const { t } = useLanguage();
  const { openProject, currentView } = useNav();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (currentView === 'projects') {
      // Resetear y re-disparar con doble rAF para garantizar re-render limpio
      setIsAnimating(false);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true));
      });
      return () => cancelAnimationFrame(frame);
    } else {
      setIsAnimating(false);
    }
  }, [currentView]);

  return (
    <section
      id="projects"
      className={`${styles.section} ${isAnimating ? styles.sectionActive : ''}`}
      style={{ '--total-items': PROJECTS.length } as React.CSSProperties}
    >
      <div className={styles.blurOverlay} aria-hidden="true" />
      <Noise patternSize={250} patternRefreshInterval={2} patternAlpha={9} zIndex={2} mixBlendMode="overlay" />

      <div className={styles.inner}>
        <div className={styles.leftColumn}>
          <div className={`${styles.floatingCard} ${activeIndex === null ? styles.floatingCardHidden : ''}`}>
            {PROJECTS.map((p, i) => (
              <div
                key={p.id}
                className={`${styles.cardImage} ${activeIndex === i ? styles.cardImageActive : ''}`}
                style={activeIndex === i ? { backgroundImage: `url(${p.logoImage})` } : {}}
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
                  const isRowActive = activeIndex === i;
                  return (
                    <li
                      key={p.id}
                      className={`${styles.item} ${isRowActive ? styles.itemActive : ''}`}
                      style={{ '--item-index': i } as React.CSSProperties}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => openProject(p)}
                    >
                      <div className={styles.itemLeft}>
                        <span className={`${styles.arrowBadge} ${isRowActive ? styles.arrowBadgeActive : ''}`}>
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

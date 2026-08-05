'use client';
import { useState } from 'react';
import Noise from '@/components/Hero/Noise';
import styles from './About.module.css';
const SKILLS = [
    'TypeScript', 'React', 'Next.js', 'Node.js',
    'Java', 'Javascript', 'C++', 'SQL', 'Git',
    'Python', 'Ada', 'Docker', 'Tailwind', 'MongoDB', 'REST APIs',
];
const DOCUMENTS = [
    {
        id: 1,
        title: 'Mi CV',
        issuer: 'Augusto Ferrari',
        type: 'Curriculum Vitae',
        color: '#00e5ff',
        file: '/docs/cv-augustoferrari.pdf',
        downloadName: 'CV-Augusto-Ferrari.pdf',
    },
    {
        id: 2,
        title: 'Certificado Programador PHP',
        issuer: 'Certificación Oficial',
        type: 'Certificado PHP',
        color: '#2563eb',
        file: '/docs/certificado.pdf',
        downloadName: 'Certificado-PHP-Augusto-Ferrari.pdf',
    },
];
export default function About() {
    const [active, setActive] = useState(0);
    const prev = () => setActive(i => (i - 1 + DOCUMENTS.length) % DOCUMENTS.length);
    const next = () => setActive(i => (i + 1) % DOCUMENTS.length);
    return (
        <section id="about" className={styles.section}>
            {/* ── Capa de Blur & Root BG traslúcido ── */}
            <div className={styles.blurOverlay} aria-hidden="true" />
            {/* ── Noise animado ── */}
            <Noise patternSize={250} patternRefreshInterval={2} patternAlpha={9} zIndex={2} mixBlendMode="overlay" />
            {/* ── Contenido ── */}
            <div className={styles.inner}>
                {/* ── Columna izquierda: Slider de documentos ── */}
                <div className={styles.leftColumn}>
                    {/* Slider visual (Desktop) */}
                    <div className={styles.sliderWrap}>
                        <div className={styles.sliderTrack}>
                            {DOCUMENTS.map((doc, i) => {
                                const offset = i - active;
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
                                            {/* PDF Preview Background */}
                                            <iframe
                                                src={`${doc.file}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                                                className={styles.pdfIframe}
                                                title={doc.title}
                                            />
                                            {/* Overlay con información y botón de descarga */}
                                            <div className={styles.certOverlayText}>
                                                <span className={styles.certTitle}>{doc.title}</span>
                                                <a
                                                    href={doc.file}
                                                    download={doc.downloadName}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.downloadCardBtn}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                        <polyline points="7 10 12 15 17 10" />
                                                        <line x1="12" y1="15" x2="12" y2="3" />
                                                    </svg>
                                                    <span>Descargar PDF</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Indicadores de puntos */}
                        <div className={styles.sliderDots}>
                            {DOCUMENTS.map((_, i) => (
                                <button
                                    key={i}
                                    className={`${styles.sliderDot} ${i === active ? styles.sliderDotActive : ''}`}
                                    onClick={() => setActive(i)}
                                    aria-label={`Ver documento ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                    {/* Controles de navegación en Desktop */}
                    <div className={styles.sliderControls}>
                        <button className={styles.sliderBtn} onClick={prev} aria-label="Anterior">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Anterior</span>
                        </button>
                        <span className={styles.sliderCount}>
                            {String(active + 1).padStart(2, '0')} / {String(DOCUMENTS.length).padStart(2, '0')}
                        </span>
                        <button className={styles.sliderBtn} onClick={next} aria-label="Siguiente">
                            <span>Siguiente</span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    {/* Botones de descarga directa para celulares (Mobile) */}
                    <div className={styles.mobileDocButtons}>
                        {DOCUMENTS.map((doc) => (
                            <a
                                key={doc.id}
                                href={doc.file}
                                download={doc.downloadName}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.mobileDocBtn}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <path d="M12 18v-6" />
                                    <path d="m9 15 3 3 3-3" />
                                </svg>
                                <span>Descargar {doc.title}</span>
                            </a>
                        ))}
                    </div>
                </div>
                {/* ── Columna derecha: Bio + Skills ── */}
                <div className={styles.rightColumn}>
                    {/* Eyebrow */}
                    <span className={styles.eyebrow}>SOBRE MÍ</span>
                    <h2 className={styles.name}>
                        <span className={styles.doubleTextSolid}>Augusto</span>
                        <br />
                        <span className={styles.nameOutline}>Ferrari</span>
                    </h2>
                    <p className={styles.bio}>
                        Estudiante de Ingeniería en Sistemas, enfocado en full-stack, bases de datos y lógica backend. Me gusta entender cómo funciona todo por dentro e innovar constantemente.
                    </p>
                    {/* Línea divisoria */}
                    <div className={styles.divider} />
                    {/* Skills */}
                    <div className={styles.skillsSection}>
                        <span className={styles.skillsLabel}>Tecnologías</span>
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

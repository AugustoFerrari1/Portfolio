'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Preloader.module.css';

type Phase = 'entering' | 'words-in' | 'words-out' | 'curtain' | 'done';

const WORDS = ['SOFTWARE', 'ENGINEER'];

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [phase, setPhase] = useState<Phase>('entering');
  const [counter, setCounter] = useState(0);
  const counterRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // ── Secuencia de animación en cada recarga ──
    // t=50   : palabras entran con slide desde abajo
    // t=1700 : palabras salen hacia arriba
    // t=1950 : cortina sube (translateY -100%) -> hero se revela y comienza su animación
    // t=2700 : overlay se desmonta
    const t1 = setTimeout(() => {
      setPhase('words-in');
      // Contador 0→100% en ~1550ms
      const steps = 100;
      const interval = 1550 / steps;
      let current = 0;
      counterRef.current = setInterval(() => {
        current++;
        setCounter(current);
        if (current >= 100) {
          clearInterval(counterRef.current!);
          counterRef.current = null;
        }
      }, interval);
    }, 50);

    const t2 = setTimeout(() => setPhase('words-out'), 1700);
    const t3 = setTimeout(() => {
      setPhase('curtain');
      onComplete?.();
    }, 1950);
    const t4 = setTimeout(() => setPhase('done'), 2700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      if (counterRef.current) clearInterval(counterRef.current);
    };
  }, []);

  // Una vez terminada la cortina, se desmonta del DOM
  if (phase === 'done') return null;

  const isActive = phase === 'words-in' || phase === 'words-out';

  return (
    <div
      className={`${styles.overlay} ${phase === 'curtain' ? styles.overlayCurtain : ''}`}
      aria-hidden="true"
    >
      {/* ── Texto central ── */}
      <div className={styles.center}>
        <p className={styles.label}>SOFTWARE ENGINEER</p>

        <div className={styles.wordsRow}>
          {WORDS.map((word, i) => {
            let wordClass = styles.word;
            if (isActive) {
              wordClass += ' ' + (phase === 'words-in' ? styles.wordIn : styles.wordOut);
            }
            return (
              <div key={word} className={styles.wordMask}>
                <span
                  className={wordClass}
                  style={{ '--stagger': i } as React.CSSProperties}
                >
                  {word}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Barra de progreso ── */}
      <div className={styles.progressTrack} aria-hidden="true">
        <div className={`${styles.progressFill} ${isActive ? styles.progressRun : ''}`} />
      </div>

      {/* ── Contador ── */}
      <div
        className={`${styles.counter} ${isActive ? styles.counterRun : ''}`}
        aria-hidden="true"
      >
        <span className={styles.counterLabel}>CARGANDO —</span>
        <span className={styles.counterNum}>
          {String(counter).padStart(2, '0')}%
        </span>
      </div>
    </div>
  );
}
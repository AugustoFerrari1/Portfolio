'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import styles from './Preloader.module.css';

type Phase = 'entering' | 'words-in' | 'words-out' | 'curtain' | 'done';

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<Phase>('entering');
  const [counter, setCounter] = useState(0);
  const counterRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase('words-in');
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
      onCompleteRef.current?.();
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

  if (phase === 'done') return null;

  const isActive = phase === 'words-in' || phase === 'words-out';

  return (
    <div
      className={`${styles.overlay} ${phase === 'curtain' ? styles.overlayCurtain : ''}`}
      aria-hidden="true"
    >
      <div className={styles.center}>
        <p className={styles.label}>{t.preloader.label}</p>

        <div className={styles.wordsRow}>
          {t.preloader.words.map((word, i) => {
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

      <div className={styles.progressTrack} aria-hidden="true">
        <div className={`${styles.progressFill} ${isActive ? styles.progressRun : ''}`} />
      </div>

      <div
        className={`${styles.counter} ${isActive ? styles.counterRun : ''}`}
        aria-hidden="true"
      >
        <span className={styles.counterLabel}>{t.preloader.loading}</span>
        <span className={styles.counterNum}>
          {String(counter).padStart(2, '0')}%
        </span>
      </div>
    </div>
  );
}

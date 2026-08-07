'use client';

import type { ReactNode } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import styles from './FrameLayout.module.css';

interface FrameLayoutProps {
  children: ReactNode;
}

export default function FrameLayout({ children }: FrameLayoutProps) {
  const { t } = useLanguage();

  return (
    <div className={styles.wrapper}>
      <div className={styles.frame}>
        <div className={styles.frameContent}>
          {children}
        </div>
      </div>

      <div className={styles.edgeLeft} aria-hidden="true">
        {t.frame.available}
      </div>
      <div className={styles.edgeRight} aria-hidden="true">
        {t.frame.field}
      </div>
      <div className={styles.edgeBottom} aria-hidden="true">
        <span className={styles.edgeBottomDesktop}>{t.frame.personal}</span>
        <span className={styles.edgeBottomMobile}>{t.frame.field}</span>
      </div>
    </div>
  );
}

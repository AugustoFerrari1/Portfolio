'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Read ref INSIDE handler so we always get the current DOM element,
      // even after isVisible flips true and the div mounts for the first time.
      const el = cursorRef.current;
      if (el) {
        el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Always call setIsVisible(true) — React deduplicates if already true
      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest('a, button, [role="button"], input, select, textarea, li, .item, [data-cursor="hover"]')
        );
        setIsHovered(prev => prev !== isClickable ? isClickable : prev);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className={`${styles.cursorWrapper} ${isHovered ? styles.hovered : ''} ${isClicked ? styles.clicked : ''}`}
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
      }}
      aria-hidden="true"
    >
      <svg
        className={styles.svgCursor}
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
      >
        {/* Anillo exterior centrado exactamente en (20,20) */}
        <circle
          className={styles.outerRing}
          cx="20"
          cy="20"
          r="11"
          stroke="rgba(255, 255, 255, 0.75)"
          strokeWidth="1.8"
        />
        {/* Punto central en las mismas coordenadas (20,20) */}
        <circle
          className={styles.innerDot}
          cx="20"
          cy="20"
          r="2.2"
          fill="rgba(255, 255, 255, 0.95)"
        />
      </svg>
    </div>
  );
}

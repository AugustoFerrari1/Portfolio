'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  // Position tracking using refs — completely bypasses React state on mousemove
  const mousePos = useRef({ x: -100, y: -100 });
  const currPos = useRef({ x: -100, y: -100 });
  const lastTarget = useRef<EventTarget | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Keep a ref for isVisible to read inside event handlers and RAF loop without re-subscribing
  const isVisibleRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        currPos.current.x = e.clientX;
        currPos.current.y = e.clientY;
        setIsVisible(true);
      }

      // Optimize closest check: only query DOM when target element actually changes
      if (e.target !== lastTarget.current) {
        lastTarget.current = e.target;
        const target = e.target as HTMLElement | null;
        if (target) {
          const isClickable = Boolean(
            target.closest('a, button, [role="button"], input, select, textarea, li, .item, [data-cursor="hover"]')
          );
          setIsHovered(prev => (prev !== isClickable ? isClickable : prev));
        }
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };
    const handleMouseEnter = () => {
      isVisibleRef.current = true;
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Ultra-fast and smooth RAF render loop for cursor positioning
    const tick = () => {
      if (cursorRef.current && isVisibleRef.current) {
        const dx = mousePos.current.x - currPos.current.x;
        const dy = mousePos.current.y - currPos.current.y;

        if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
          currPos.current.x += dx * 0.4;
          currPos.current.y += dy * 0.4;
          cursorRef.current.style.transform = `translate3d(${currPos.current.x.toFixed(2)}px, ${currPos.current.y.toFixed(2)}px, 0)`;
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className={`${styles.cursorWrapper} ${isHovered ? styles.hovered : ''} ${isClicked ? styles.clicked : ''}`}
      style={{
        transform: `translate3d(${currPos.current.x}px, ${currPos.current.y}px, 0)`,
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

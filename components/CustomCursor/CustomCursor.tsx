'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  // Posición real del mouse (sin suavizar)
  const mousePos = useRef({ x: -100, y: -100 });
  // Posiciones suavizadas, independientes para cada elemento
  const ringPos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const lastTarget = useRef<EventTarget | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isVisibleRef = useRef(false);

  // Factores de suavizado (lerp). Más alto = reacciona más rápido.
  // El punto "lidera" (llega antes al mouse), el anillo se retrasa
  // y ambos convergen naturalmente al mismo lugar cuando el mouse
  // se queda quieto, porque los dos apuntan al mismo target.
  const DOT_EASE = 0.35;
  const RING_EASE = 0.12;

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        // Al aparecer, arrancan ambos ya alineados en la posición actual
        ringPos.current.x = dotPos.current.x = e.clientX;
        ringPos.current.y = dotPos.current.y = e.clientY;
        setIsVisible(true);
      }

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

    const tick = () => {
      if (isVisibleRef.current) {
        // El punto sigue al mouse de cerca
        dotPos.current.x += (mousePos.current.x - dotPos.current.x) * DOT_EASE;
        dotPos.current.y += (mousePos.current.y - dotPos.current.y) * DOT_EASE;

        // El anillo sigue al mouse con más inercia -> se queda atrás
        // al mover rápido, y "alcanza" al punto cuando el mouse frena
        ringPos.current.x += (mousePos.current.x - ringPos.current.x) * RING_EASE;
        ringPos.current.y += (mousePos.current.y - ringPos.current.y) * RING_EASE;

        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${dotPos.current.x.toFixed(2)}px, ${dotPos.current.y.toFixed(2)}px, 0)`;
        }
        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${ringPos.current.x.toFixed(2)}px, ${ringPos.current.y.toFixed(2)}px, 0)`;
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

  const stateClass = `${isHovered ? styles.hovered : ''} ${isClicked ? styles.clicked : ''}`;

  return (
    <>
      <div ref={ringRef} className={`${styles.ringWrapper} ${stateClass}`} aria-hidden="true">
        <svg className={styles.svgCursor} width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle
            className={styles.outerRing}
            cx="20"
            cy="20"
            r="11"
            stroke="rgba(255, 255, 255, 0.75)"
            strokeWidth="1.8"
          />
        </svg>
      </div>
      <div ref={dotRef} className={`${styles.dotWrapper} ${stateClass}`} aria-hidden="true">
        <svg className={styles.svgCursor} width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle
            className={styles.innerDot}
            cx="20"
            cy="20"
            r="2.2"
            fill="rgba(255, 255, 255, 0.95)"
          />
        </svg>
      </div>
    </>
  );
}
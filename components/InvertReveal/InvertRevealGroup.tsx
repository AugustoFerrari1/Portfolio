'use client';

import { useEffect, useMemo, useRef, ReactNode, ElementType } from 'react';
import type { CSSProperties } from 'react';
import {
  InvertRevealGroupContext,
  InvertRevealListener,
} from './InvertRevealContext';
import styles from './InvertRevealGroup.module.css';

interface InvertRevealGroupProps {
  children: ReactNode;
  /** Radio del círculo, compartido por todos los InvertReveal hijos */
  radius?: number;
  /** 0-1. Más alto = reacciona más rápido (menos delay) */
  smoothing?: number;
  /** Color/blendMode default para los hijos (cada uno puede sobreescribirlo) */
  color?: string;
  blendMode?: CSSProperties['mixBlendMode'];
  /** Tag del wrapper. 'span' por defecto para poder usarlo dentro de <h1>, <p>, etc. */
  as?: ElementType;
  className?: string;
}

export default function InvertRevealGroup({
  children,
  radius = 70,
  smoothing = 0.25,
  color = '#ffffff',
  blendMode = 'difference',
  as: Tag = 'span',
  className = '',
}: InvertRevealGroupProps) {
  const wrapperRef = useRef<HTMLElement | null>(null);
  const listeners = useRef<Set<InvertRevealListener>>(new Set());

  // Coordenadas en viewport (clientX/clientY), NO relativas al grupo.
  // Así cada hijo puede convertirlas a su propio espacio local con su
  // propio getBoundingClientRect(), sin importar dónde esté ubicado.
  const target = useRef({ x: -9999, y: -9999, r: 0 });
  const curr = useRef({ x: -9999, y: -9999, r: 0 });
  const rafId = useRef<number | null>(null);
  const isActive = useRef(false);

  const subscribe = (fn: InvertRevealListener) => {
    listeners.current.add(fn);
    return () => listeners.current.delete(fn);
  };

  // Memoizado para no romper el context en cada render
  const contextValue = useMemo(
    () => ({ subscribe, radius, color, blendMode }),
    [radius, color, blendMode]
  );

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const notify = () => {
      const snap = {
        x: curr.current.x,
        y: curr.current.y,
        r: Math.max(curr.current.r, 0),
        active: isActive.current,
      };
      listeners.current.forEach(fn => fn(snap));
    };

    const tick = () => {
      curr.current.x += (target.current.x - curr.current.x) * smoothing;
      curr.current.y += (target.current.y - curr.current.y) * smoothing;
      curr.current.r += (target.current.r - curr.current.r) * smoothing;

      notify();

      const stillMoving =
        Math.abs(target.current.x - curr.current.x) > 0.1 ||
        Math.abs(target.current.y - curr.current.y) > 0.1 ||
        Math.abs(target.current.r - curr.current.r) > 0.1;

      if (isActive.current || stillMoving) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        rafId.current = null;
      }
    };

    const startLoop = () => {
      if (rafId.current === null) rafId.current = requestAnimationFrame(tick);
    };

    const handleEnter = (e: MouseEvent) => {
      isActive.current = true;
      curr.current.x = target.current.x = e.clientX;
      curr.current.y = target.current.y = e.clientY;
      curr.current.r = 0;
      target.current.r = radius;
      startLoop();
    };

    const handleMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      target.current.r = radius;
      startLoop();
    };

    const handleLeave = () => {
      isActive.current = false;
      target.current.r = 0;
      startLoop();
    };

    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mousemove', handleMove, { passive: true });
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mouseenter', handleEnter);
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [radius, smoothing]);

  return (
    <Tag ref={wrapperRef} className={`${styles.group} ${className}`}>
      <InvertRevealGroupContext.Provider value={contextValue}>
        {children}
      </InvertRevealGroupContext.Provider>
    </Tag>
  );
}

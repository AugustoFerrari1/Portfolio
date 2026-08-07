'use client';

import { useContext, useEffect, useRef, ReactNode, ElementType } from 'react';
import type { CSSProperties } from 'react';
import { InvertRevealGroupContext } from './InvertRevealContext';
import styles from './InvertReveal.module.css';

interface InvertRevealProps {
  children: ReactNode;
  /** Ignorado si está dentro de un InvertRevealGroup (el grupo manda) */
  radius?: number;
  /** Ignorado si está dentro de un InvertRevealGroup */
  smoothing?: number;
  /**
   * Espacio extra (px) alrededor del texto donde el círculo puede
   * dibujarse completo sin cortarse contra el borde de la caja.
   * No afecta el layout (se compensa con margin negativo).
   */
  padding?: number;
  /**
   * Color de la copia "revelada" del texto (la que aparece dentro
   * del círculo). Se ignora si pasás `revealClassName`.
   */
  color?: string;
  /**
   * Blend mode opcional para la copia revelada. 'normal' = reemplazo
   * directo de color (recomendado). 'difference'/'exclusion' etc.
   * si además querés un efecto de mezcla sobre ese color.
   */
  blendMode?: CSSProperties['mixBlendMode'];
  /**
   * Clase CSS propia para la copia revelada, para casos con texto en
   * gradiente (background-clip: text) donde `color` no alcanza para
   * pisar el estilo. Ejemplo: definir en tu CSS module algo como
   * `.reveal { background: linear-gradient(...); -webkit-background-clip: text;
   * -webkit-text-fill-color: transparent; }` y pasarlo acá.
   */
  revealClassName?: string;
  /** Tag HTML del wrapper. 'span' para texto inline, 'div' para bloques/botones */
  as?: ElementType;
  className?: string;
}

export default function InvertReveal({
  children,
  radius: ownRadius = 70,
  smoothing: ownSmoothing = 0.25,
  padding,
  color = '#ffffff',
  blendMode = 'normal',
  revealClassName,
  as: Tag = 'span',
  className = '',
}: InvertRevealProps) {
  const group = useContext(InvertRevealGroupContext);

  const radius = group ? group.radius : ownRadius;
  const pad = padding ?? radius;

  const wrapperRef = useRef<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLSpanElement | null>(null);

  // --- MODO GRUPO: solo dibuja, la posición viene del InvertRevealGroup ---
  useEffect(() => {
    if (!group) return;

    const unsubscribe = group.subscribe(snap => {
      const el = wrapperRef.current;
      const overlay = overlayRef.current;
      if (!el || !overlay) return;

      // Convierte la posición global (viewport) a coordenadas locales
      // de ESTE elemento, así el círculo queda continuo entre textos.
      const rect = el.getBoundingClientRect();
      overlay.style.setProperty('--ix', `${snap.x - rect.left}px`);
      overlay.style.setProperty('--iy', `${snap.y - rect.top}px`);
      overlay.style.setProperty('--ir', `${snap.r}px`);
    });

    return unsubscribe;
  }, [group]);

  // --- MODO STANDALONE: sin grupo, rastrea su propio mouse (como antes) ---
  useEffect(() => {
    if (group) return; // el grupo ya se encarga de todo
    const el = wrapperRef.current;
    if (!el) return;

    const target = { x: 0, y: 0, r: 0 };
    const curr = { x: 0, y: 0, r: 0 };
    let rafId: number | null = null;
    let isActive = false;

    const tick = () => {
      curr.x += (target.x - curr.x) * ownSmoothing;
      curr.y += (target.y - curr.y) * ownSmoothing;
      curr.r += (target.r - curr.r) * ownSmoothing;

      if (overlayRef.current) {
        overlayRef.current.style.setProperty('--ix', `${curr.x}px`);
        overlayRef.current.style.setProperty('--iy', `${curr.y}px`);
        overlayRef.current.style.setProperty('--ir', `${Math.max(curr.r, 0)}px`);
      }

      const stillMoving =
        Math.abs(target.x - curr.x) > 0.1 ||
        Math.abs(target.y - curr.y) > 0.1 ||
        Math.abs(target.r - curr.r) > 0.1;

      if (isActive || stillMoving) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    const startLoop = () => {
      if (rafId === null) rafId = requestAnimationFrame(tick);
    };

    const handleEnter = (e: MouseEvent) => {
      isActive = true;
      const rect = el.getBoundingClientRect();
      curr.x = target.x = e.clientX - rect.left;
      curr.y = target.y = e.clientY - rect.top;
      curr.r = 0;
      target.r = radius;
      startLoop();
    };

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
      target.r = radius;
      startLoop();
    };

    const handleLeave = () => {
      isActive = false;
      target.r = 0;
      startLoop();
    };

    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mousemove', handleMove, { passive: true });
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mouseenter', handleEnter);
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [group, radius, ownSmoothing]);

  return (
    <Tag
      ref={wrapperRef}
      className={`${styles.wrapper} ${className}`}
      style={{ padding: pad, margin: -pad }}
    >
      {/* Copia base: siempre visible, con el estilo original */}
      <span className={styles.base}>{children}</span>

      {/* Copia revelada: mismo texto, solo visible dentro del círculo.
          Al ser texto real (no un rectángulo de color), donde no hay
          letra no se pinta nada -> sin "blobs" sobre fondo o huecos. */}
      <span
        ref={overlayRef}
        className={`${styles.overlayText} ${revealClassName ?? ''}`}
        style={
          revealClassName
            ? { mixBlendMode: blendMode }
            : { color, WebkitTextFillColor: color, mixBlendMode: blendMode }
        }
        aria-hidden="true"
      >
        {children}
      </span>
    </Tag>
  );
}
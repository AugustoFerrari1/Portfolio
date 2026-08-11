'use client';

import { useEffect, useRef, ReactNode, ElementType } from 'react';
import type { CSSProperties } from 'react';
import styles from './InvertReveal.module.css';
import { useInvertRevealGroup } from './InvertRevealGroup';

interface InvertRevealProps {
  children: ReactNode;
  /** Radio del círculo de inversión en px (solo en modo standalone) */
  radius?: number;
  /** 0-1. Más alto = el círculo reacciona más rápido (solo en modo standalone) */
  smoothing?: number;
  /**
   * Espacio extra (px) alrededor del texto donde el círculo puede
   * dibujarse completo sin cortarse contra el borde de la caja.
   * Solo tiene efecto en modo standalone.
   */
  padding?: number;
  /**
   * Color del overlay. Por defecto responde al tema via --invert-reveal-color.
   */
  color?: string;
  /**
   * Mix-blend-mode del overlay.
   * - 'difference'  → inversión dura (default)
   * - 'exclusion'   → inversión más suave/lavada
   */
  blendMode?: CSSProperties['mixBlendMode'];
  /** Tag HTML del wrapper */
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

export default function InvertReveal({
  children,
  radius = 70,
  smoothing = 0.25,
  padding,
  color = 'var(--invert-reveal-color)',
  blendMode = 'var(--invert-reveal-blend-mode)' as CSSProperties['mixBlendMode'],
  as: Tag = 'span',
  className = '',
  style,
}: InvertRevealProps) {
  // ── Detectar modo: esclavo (dentro de grupo) vs standalone ──────────────
  const group = useInvertRevealGroup();
  const isSlaved = group !== null;

  const pad = padding ?? radius;

  const wrapperRef = useRef<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // ── Modo esclavo: el InvertRevealGroup tiene su propio overlay unificado.
  // El esclavo solo necesita renderizar su texto; el blend/círculo lo maneja
  // el overlay del grupo. No se necesita isolation ni overlay propio.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isSlaved) return; // noop — el grupo ya maneja el overlay
  }, [isSlaved]);

  // ── Modo standalone: lógica original intacta ────────────────────────────
  const target = useRef({ x: 0, y: 0, r: 0 });
  const curr = useRef({ x: 0, y: 0, r: 0 });
  const rafId = useRef<number | null>(null);
  const isActive = useRef(false);

  useEffect(() => {
    if (isSlaved) return;

    const el = wrapperRef.current;
    if (!el) return;

    const tick = () => {
      curr.current.x += (target.current.x - curr.current.x) * smoothing;
      curr.current.y += (target.current.y - curr.current.y) * smoothing;
      curr.current.r += (target.current.r - curr.current.r) * smoothing;

      if (overlayRef.current) {
        overlayRef.current.style.setProperty('--ix', `${curr.current.x}px`);
        overlayRef.current.style.setProperty('--iy', `${curr.current.y}px`);
        overlayRef.current.style.setProperty('--ir', `${Math.max(curr.current.r, 0)}px`);
      }

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
      const rect = el.getBoundingClientRect();
      curr.current.x = target.current.x = e.clientX - rect.left;
      curr.current.y = target.current.y = e.clientY - rect.top;
      curr.current.r = 0;
      target.current.r = radius;
      startLoop();
    };

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      target.current.x = e.clientX - rect.left;
      target.current.y = e.clientY - rect.top;
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
  }, [radius, smoothing, isSlaved]);

  // ── Render ───────────────────────────────────────────────────────────────

  if (isSlaved) {
    // Modo esclavo: el InvertRevealGroup ya tiene su propio overlay unificado.
    // Solo renderizamos el texto; sin overlay propio ni isolation, para no
    // crear compositing groups independientes que causarían el corte visual.
    return (
      <Tag ref={wrapperRef} className={className} style={style}>
        {children}
      </Tag>
    );
  }

  // Modo standalone: comportamiento original 100% intacto
  return (
    <Tag
      ref={wrapperRef}
      className={`${styles.wrapper} ${className}`}
      style={{ padding: pad, margin: -pad, ...style }}
    >
      {children}
      <div
        ref={overlayRef}
        className={styles.overlay}
        style={{
          backgroundColor: color,
          mixBlendMode: blendMode,
          backdropFilter: 'var(--invert-reveal-backdrop-filter)',
          WebkitBackdropFilter: 'var(--invert-reveal-backdrop-filter)',
        }}
        aria-hidden="true"
      />
    </Tag>
  );
}

'use client';

import {
  createContext,
  useContext,
  useRef,
  useEffect,
  useMemo,
  ReactNode,
  ElementType,
} from 'react';
import type { CSSProperties } from 'react';
import styles from './InvertRevealGroup.module.css';

/* ─────────────────────────────────────────────────────────────
   Emitter — pub/sub sin React state para evitar re-renders
   ───────────────────────────────────────────────────────────── */
type FrameCallback = (ax: number, ay: number, r: number) => void;

interface GroupEmitter {
  subscribe(cb: FrameCallback): () => void;
  notify(ax: number, ay: number, r: number): void;
}

function createEmitter(): GroupEmitter {
  const cbs = new Set<FrameCallback>();
  return {
    subscribe(cb) {
      cbs.add(cb);
      return () => cbs.delete(cb);
    },
    notify(ax, ay, r) {
      cbs.forEach((cb) => cb(ax, ay, r));
    },
  };
}

/* ─────────────────────────────────────────────────────────────
   Context
   ───────────────────────────────────────────────────────────── */
export interface GroupCtx {
  emitter: GroupEmitter;
}

export const InvertRevealGroupCtx = createContext<GroupCtx | null>(null);

export function useInvertRevealGroup() {
  return useContext(InvertRevealGroupCtx);
}

/* ─────────────────────────────────────────────────────────────
   Props
   ───────────────────────────────────────────────────────────── */
interface InvertRevealGroupProps {
  children: ReactNode;
  /** Radio del círculo en px */
  radius?: number;
  /** 0-1. Más alto = reacciona más rápido */
  smoothing?: number;
  /**
   * Color del overlay del grupo. Por defecto responde al tema via --invert-reveal-color.
   */
  color?: string;
  /**
   * Mix-blend-mode del overlay del grupo.
   * - 'difference'  → inversión dura (default)
   * - 'exclusion'   → inversión más suave/lavada
   */
  blendMode?: CSSProperties['mixBlendMode'];
  /** Tag HTML del contenedor */
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

/* ─────────────────────────────────────────────────────────────
   Component
   ───────────────────────────────────────────────────────────── */
export default function InvertRevealGroup({
  children,
  radius = 70,
  smoothing = 0.25,
  color = 'var(--invert-reveal-color)',
  blendMode = 'var(--invert-reveal-blend-mode)' as CSSProperties['mixBlendMode'],
  as: Tag = 'div',
  className = '',
  style,
}: InvertRevealGroupProps) {
  const groupRef = useRef<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Emitter estable: misma instancia durante toda la vida del componente
  const emitter = useRef(createEmitter()).current;
  const ctx = useMemo<GroupCtx>(() => ({ emitter }), [emitter]);

  useEffect(() => {
    const el = groupRef.current;
    if (!el) return;

    // Estado local — no React state para evitar re-renders en cada frame
    const target = { x: 0, y: 0, r: 0 };
    const curr = { x: 0, y: 0, r: 0 };
    let rafId: number | null = null;
    let isActive = false;

    const tick = () => {
      curr.x += (target.x - curr.x) * smoothing;
      curr.y += (target.y - curr.y) * smoothing;
      curr.r += (target.r - curr.r) * smoothing;

      // ── Actualizar los overlays del grupo ─────────────────────
      // Seteamos las vars en el ELEMENTO GRUPO (no en el overlay).
      // Así tanto .groupOverlay como .cloneOverlay las heredan via
      // CSS cascade sin necesitar refs independientes.
      // El inset negativo = radius de ambos overlays ya está
      // compensado sumando radius a ix/iy.
      const rect = el.getBoundingClientRect();
      const r = Math.max(curr.r, 0);
      el.style.setProperty('--ir', `${r}px`);
      el.style.setProperty('--ix', `${curr.x - rect.left + radius}px`);
      el.style.setProperty('--iy', `${curr.y - rect.top + radius}px`);

      // Seguir emitiendo a eventuales esclavos suscritos (por compatibilidad)
      emitter.notify(curr.x, curr.y, Math.max(curr.r, 0));

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
      // Coordenadas absolutas (clientX/Y), no relativas al grupo
      curr.x = target.x = e.clientX;
      curr.y = target.y = e.clientY;
      curr.r = 0;
      target.r = radius;
      startLoop();
    };

    const handleMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
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
  }, [radius, smoothing, emitter]);

  return (
    <InvertRevealGroupCtx.Provider value={ctx}>
      {/* El grupo tiene isolation:isolate y overlays según tema.
          Los hijos InvertReveal en modo esclavo no renderizan overlay propio.
          Dark mode  → .groupOverlay (white + exclusion blend)
          Light mode → .cloneOverlay (children duplicados + filter:invert+brightness)
            El cloneOverlay produce: fondo negro + texto blanco sin backdrop-filter.
            .groupOverlay se oculta en light mode via CSS. */}
      <Tag
        ref={groupRef}
        className={className}
        style={{
          ...style,
          position: 'relative',
          isolation: 'var(--invert-reveal-isolation)' as CSSProperties['isolation'],
        }}
      >
        {children}

        {/* ── Dark mode overlay: white + exclusion ─────────────── */}
        <div
          ref={overlayRef}
          className={styles.groupOverlay}
          style={{
            '--gr': `${radius}px`,
            backgroundColor: color,
            mixBlendMode: blendMode,
            backdropFilter: 'var(--invert-reveal-backdrop-filter)',
            WebkitBackdropFilter: 'var(--invert-reveal-backdrop-filter)',
          } as React.CSSProperties}
          aria-hidden="true"
        />

        {/* ── Light mode clone overlay: invert filter ───────────
            Duplica los children dentro del círculo clipeado.
            filter: invert(1) brightness(2) sobre var(--color-bg):
              bg beige (#e8e8e7) → invertido → near-black (#171817)
              texto lila (#5a5272) → invertido + brightness → white
            display:none en dark mode → cero costo de render.
            cloneInner cancela el inset negativo de cloneOverlay
            con top/left/right/bottom: var(--gr) para que los
            children queden en la misma posición visual que afuera. */}
        <div
          className={styles.cloneOverlay}
          style={{ '--gr': `${radius}px` } as React.CSSProperties}
          aria-hidden="true"
        >
          <div
            className={`${styles.cloneInner} ${className ?? ''}`}
            style={{ position: 'absolute', ...style }}
          >
            {children}
          </div>
        </div>

      </Tag>
    </InvertRevealGroupCtx.Provider>
  );
}

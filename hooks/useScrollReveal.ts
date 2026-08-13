'use client';

import { useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
  /** Porcentaje del elemento que debe ser visible para disparar (0–1). Default: 0.15 */
  threshold?: number;
  /** Dispara sólo una vez y no se revierte. Default: true */
  once?: boolean;
}

/**
 * Devuelve [ref, isVisible].
 * Adjunta el ref al contenedor raíz de la sección.
 * `isVisible` pasa a true cuando el elemento cruza el viewport.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>({
  threshold = 0.15,
  once = true,
}: UseScrollRevealOptions = {}) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return [ref, isVisible] as const;
}

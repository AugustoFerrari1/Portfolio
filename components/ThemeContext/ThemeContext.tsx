'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { flushSync } from 'react-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: (event?: React.MouseEvent | MouseEvent) => void;
  isLight: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
  isLight: false,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'portfolio-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  // On mount: read persisted value or default to dark
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      applyTheme(stored);
      setTheme(stored);
    } else {
      applyTheme('dark');
      setTheme('dark');
    }
  }, []);

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    if (t === 'light') {
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    } else {
      root.removeAttribute('data-theme');
      root.style.colorScheme = 'dark';
    }
  };

  const toggleTheme = useCallback((event?: React.MouseEvent | MouseEvent) => {
    /** Aplica el cambio de tema en React + DOM */
    const doToggle = () => {
      // flushSync garantiza que React actualiza el DOM ANTES de que
      // View Transitions capture el snapshot "after"
      flushSync(() => {
        setTheme(prev => {
          const next: Theme = prev === 'dark' ? 'light' : 'dark';
          applyTheme(next);
          localStorage.setItem(STORAGE_KEY, next);
          return next;
        });
      });
    };

    // Pasamos las coordenadas del click como variables CSS para que
    // el blob nazca exactamente desde el botón pulsado.
    // Si no hay evento (p.ej. teclado), el blob nace desde el centro (50% 50%).
    if (event && typeof document !== 'undefined') {
      const clientX = 'clientX' in event ? event.clientX : window.innerWidth / 2;
      const clientY = 'clientY' in event ? event.clientY : window.innerHeight / 2;
      const xPct = ((clientX / window.innerWidth) * 100).toFixed(2) + '%';
      const yPct = ((clientY / window.innerHeight) * 100).toFixed(2) + '%';
      document.documentElement.style.setProperty('--vt-x', xPct);
      document.documentElement.style.setProperty('--vt-y', yPct);
    }

    // View Transitions API — Chrome 111+, Edge 111+, Safari 18+
    // Se usa en todos los dispositivos. En mobile el CSS define
    // una duración más corta (250ms) para hardware limitado.
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (document as any).startViewTransition(doToggle);
    } else {
      doToggle();
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isLight: theme === 'light' }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTheme() {
  return useContext(ThemeContext);
}

import { createContext } from 'react';
import type { CSSProperties } from 'react';

export interface InvertRevealSnapshot {
  /** clientX suavizado (coordenadas de viewport) */
  x: number;
  /** clientY suavizado (coordenadas de viewport) */
  y: number;
  /** radio actual suavizado, en px */
  r: number;
  active: boolean;
}

export type InvertRevealListener = (snapshot: InvertRevealSnapshot) => void;

export interface InvertRevealGroupContextValue {
  /** Se llama en cada frame del loop del grupo con la posición/radio actual */
  subscribe: (fn: InvertRevealListener) => () => void;
  radius: number;
  color: string;
  blendMode: CSSProperties['mixBlendMode'];
}

export const InvertRevealGroupContext =
  createContext<InvertRevealGroupContextValue | null>(null);

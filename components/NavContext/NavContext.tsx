'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

export type ViewId = 'home' | 'projects' | 'about' | 'contact';

interface NavContextValue {
  currentView: ViewId;
  navigate: (view: ViewId) => void;
}

const NavContext = createContext<NavContextValue>({
  currentView: 'home',
  navigate: () => {},
});

export function NavProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<ViewId>('home');

  return (
    <NavContext.Provider value={{ currentView, navigate: setCurrentView }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  return useContext(NavContext);
}

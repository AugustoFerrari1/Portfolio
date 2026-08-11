'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

export type ViewId = 'home' | 'projects' | 'about' | 'contact' | 'project-detail';

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  year: string;
  role: string;
  client: string;
  description: string;
  technologies: string[];
  link: string;
  images: string[];
  logoImage: string;
  color: string;
}

interface NavContextValue {
  currentView: ViewId;
  navigate: (view: ViewId) => void;
  selectedProject: ProjectData | null;
  openProject: (project: ProjectData) => void;
  closeProject: () => void;
}

const NavContext = createContext<NavContextValue>({
  currentView: 'home',
  navigate: () => {},
  selectedProject: null,
  openProject: () => {},
  closeProject: () => {},
});

export function NavProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<ViewId>('home');
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  const openProject = (project: ProjectData) => {
    setSelectedProject(project);
    setCurrentView('project-detail');
  };

  const closeProject = () => {
    setSelectedProject(null);
    setCurrentView('projects');
  };

  return (
    <NavContext.Provider value={{ currentView, navigate: setCurrentView, selectedProject, openProject, closeProject }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  return useContext(NavContext);
}

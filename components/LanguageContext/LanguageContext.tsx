'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Language = 'en' | 'es';

export const copy = {
  en: {
    frame: {
      available: 'Available for work - 2027',
      field: 'Engineering & Software',
      personal: '@aguferrari1',
    },
    nav: {
      toggleLanguage: 'Switch language',
      toggleTheme: 'Toggle theme',
      openMenu: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
      tooltipOpen: 'Menu',
      tooltipClose: 'Close',
    },
    menu: {
      items: {
        home: 'Home',
        projects: 'Projects',
        about: 'About me',
        contact: 'Contact',
      },
    },
    hero: {
      line1Outline: 'HI, I AM',
      line1Solid: 'AUGUSTO FERRARI',
      line2Outline: 'SYSTEMS',
      line2Solid: 'ENGINEER',
      descriptionLine1: 'I am a systems engineering student and backend developer',
      descriptionLine2: '& infrastructure and database architect',
      projectsCta: 'my projects',
      aboutCta: 'learn more',
    },
    preloader: {
      label: 'SOFTWARE ENGINEER',
      words: ['SOFTWARE', 'ENGINEER'],
      loading: 'LOADING -',
    },
    projects: {
      heading: 'PROJECTS',
    },
    about: {
      documents: [
        {
          title: 'My Resume',
          issuer: 'Augusto Ferrari',
          type: 'Curriculum Vitae',
        },
        {
          title: 'PHP Programmer Certificate',
          issuer: 'Official Certification',
          type: 'PHP Certificate',
        },
      ],
      downloadPdf: 'Download PDF',
      viewDocument: 'View document',
      previous: 'Previous',
      next: 'Next',
      download: 'Download',
      eyebrow: 'ABOUT ME',
      bio: 'Systems Engineering student focused on full-stack development, databases, and backend logic. I enjoy understanding how things work under the hood and constantly finding ways to innovate.',
      technologies: 'Technologies',
    },
    contact: {
      aria: 'Contact',
      heading: 'CONTACT',
      emailLabel: 'E-MAIL',
      emailAria: 'Send email to',
      socialLabel: 'SOCIAL MEDIA',
      socialAria: 'Visit',
    },
  },
  es: {
    frame: {
      available: 'Disponible para trabajar - 2027',
      field: 'Ingenieria & Software',
      personal: '@aguferrari1',
    },
    nav: {
      toggleLanguage: 'Cambiar idioma',
      toggleTheme: 'Cambiar tema',
      openMenu: 'Abrir menu de navegacion',
      closeMenu: 'Cerrar menu de navegacion',
      tooltipOpen: 'Menu',
      tooltipClose: 'Cerrar',
    },
    menu: {
      items: {
        home: 'Inicio',
        projects: 'Proyectos',
        about: 'Sobre mi',
        contact: 'Contacto',
      },
    },
    hero: {
      line1Outline: 'HOLA, SOY',
      line1Solid: 'AUGUSTO FERRARI',
      line2Outline: 'INGENIERO EN',
      line2Solid: 'SISTEMAS',
      descriptionLine1: 'Soy estudiante de ingenieria en sistemas, backend developer',
      descriptionLine2: '& arquitecto de infraestructura y bases de datos',
      projectsCta: 'mis proyectos',
      aboutCta: 'saber mas',
    },
    preloader: {
      label: 'SOFTWARE ENGINEER',
      words: ['SOFTWARE', 'ENGINEER'],
      loading: 'CARGANDO -',
    },
    projects: {
      heading: 'PROYECTOS',
    },
    about: {
      documents: [
        {
          title: 'Mi CV',
          issuer: 'Augusto Ferrari',
          type: 'Curriculum Vitae',
        },
        {
          title: 'Certificado Programador PHP',
          issuer: 'Certificacion Oficial',
          type: 'Certificado PHP',
        },
      ],
      downloadPdf: 'Descargar PDF',
      viewDocument: 'Ver documento',
      previous: 'Anterior',
      next: 'Siguiente',
      download: 'Descargar',
      eyebrow: 'SOBRE MI',
      bio: 'Estudiante de Ingenieria en Sistemas, enfocado en full-stack, bases de datos y logica backend. Me gusta entender como funciona todo por dentro e innovar constantemente.',
      technologies: 'Tecnologias',
    },
    contact: {
      aria: 'Contacto',
      heading: 'CONTACTO',
      emailLabel: 'E-MAIL',
      emailAria: 'Enviar email a',
      socialLabel: 'REDES SOCIALES',
      socialAria: 'Visitar',
    },
  },
} as const;

type Copy = typeof copy[Language];

interface LanguageContextValue {
  language: Language;
  label: 'EN' | 'ES';
  t: Copy;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  label: 'EN',
  t: copy.en,
  toggleLanguage: () => { },
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => {
    const label = language === 'en' ? 'EN' : 'ES';

    return {
      language,
      label,
      t: copy[language],
      toggleLanguage: () => setLanguage(current => (current === 'en' ? 'es' : 'en')),
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

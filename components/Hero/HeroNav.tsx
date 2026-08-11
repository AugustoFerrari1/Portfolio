'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/components/LanguageContext';
import { useNav } from '@/components/NavContext';
import { useTheme } from '@/components/ThemeContext';
import AnimatedBurgerIcon from '../BurgerThings/AnimatedBurgerIcon';
import styles from './Hero.module.css';

interface HeroNavProps {
    isOpen: boolean;
    onToggle: () => void;
}

/**
 * HeroNav — Barra de navegación superior dentro de Hero
 */
export default function HeroNav({ isOpen, onToggle }: HeroNavProps) {
    const [hovered, setHovered] = useState(false);
    const { label, t, toggleLanguage } = useLanguage();
    const { navigate } = useNav();
    const { isLight, toggleTheme } = useTheme();

    function handleLogoClick() {
        if (isOpen) onToggle();
        navigate('home');
    }

    return (
        <header className={styles.nav}>
            {/* Logo de la firma */}
            <div
                className={styles.navLogo}
                aria-label="Augusto Ferrari"
                onClick={handleLogoClick}
                style={{ cursor: 'pointer' }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleLogoClick();
                    }
                }}
            >
                <Image
                    src="/logofir.png"
                    alt="Augusto Ferrari"
                    width={779}
                    height={607}
                    className={styles.navLogoImage}
                    priority
                />
            </div>

            {/* Controles de la derecha: EN/ES, Luna, Burger */}
            <div className={styles.navRightControls}>
                {/* Idioma ES/EN */}
                <button
                    className={styles.langBtn}
                    onClick={toggleLanguage}
                    aria-label={t.nav.toggleLanguage}
                >
                    {label}
                </button>

                {/* Toggle Tema (Luna / Sol) */}
                <button className={styles.themeBtn} onClick={toggleTheme} aria-label={t.nav.toggleTheme}>
                    {isLight ? (
                        /* Sol — light mode activo */
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="4" />
                            <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                        </svg>
                    ) : (
                        /* Luna — dark mode activo */
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    )}
                </button>

                {/* Burger con animación */}
                <button
                    id="menu-toggle"
                    className={`${styles.menuBtn} ${isOpen ? styles.menuBtnActive : ''}`}
                    onClick={onToggle}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    aria-label={isOpen ? t.nav.closeMenu : t.nav.openMenu}
                    aria-expanded={isOpen}
                >
                    <AnimatedBurgerIcon isHovered={hovered} isOpen={isOpen} />
                    <span className={`${styles.menuTooltip} ${hovered ? styles.menuTooltipVisible : ''}`}>
                        {isOpen ? t.nav.tooltipClose : t.nav.tooltipOpen}
                    </span>
                </button>
            </div>
        </header>
    );
}

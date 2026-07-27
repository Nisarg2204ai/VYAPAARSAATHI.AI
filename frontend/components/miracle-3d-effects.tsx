'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Ultra-lightweight, zero-lag visual performance component.
 * Completely removed heavy canvas loops, mousemove event listeners, and floating toggle menus.
 * Native hardware-accelerated rendering optimized for low-end devices.
 */
export function Miracle3DEffects() {
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Add clean, hardware-accelerated styles
    document.documentElement.classList.add('miracle-3d-active', 'miracle-3d-smooth');
    document.body.classList.add('miracle-3d-active', 'miracle-3d-smooth');

    // Throttled native scroll progress bar (ultra low CPU footprint)
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
          if (totalScroll > 0 && progressBarRef.current) {
            const scrollPercent = (window.scrollY / totalScroll) * 100;
            progressBarRef.current.style.width = `${scrollPercent}%`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Lightweight native IntersectionObserver for smooth scroll reveal
    const revealElements = document.querySelectorAll<HTMLElement>('section, article, .glass-card, .card');
    revealElements.forEach((el) => el.classList.add('miracle-reveal-item'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('miracle-revealed');
          }
        });
      },
      { threshold: 0.05 }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Lightweight 3px top scroll progress bar */}
      <div ref={progressBarRef} className="miracle-scroll-progress" />
    </>
  );
}

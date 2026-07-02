import { useEffect, useRef } from 'react';

export default function useParallax(speed = 0.3) {
  const ref = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const effectiveSpeed = isMobile ? speed * 0.3 : speed;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (ref.current) {
            const scrollY = window.scrollY;
            const offset = scrollY * effectiveSpeed;
            ref.current.style.transform = `translate3d(0, ${offset}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return ref;
}

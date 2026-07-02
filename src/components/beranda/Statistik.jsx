import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

const statistikData = [
  {
    angka: 63,
    label: 'Anggota Aktif',
    suffix: '+',
    ikon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    angka: 7,
    label: 'Divisi',
    suffix: '',
    ikon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    angka: 5,
    label: 'Program Kerja',
    suffix: '+',
    ikon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    angka: 2,
    label: 'Event Tahunan',
    suffix: '+',
    ikon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

function animateCounter(el, target, suffix, delay) {
  const duration = 2000;
  const startTime = performance.now() + delay;

  const tick = (currentTime) => {
    const elapsed = currentTime - startTime;
    if (elapsed < 0) {
      requestAnimationFrame(tick);
      return;
    }
    const progress = Math.min(elapsed / duration, 1);
    // outExpo easing
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

export default function Statistik() {
  const headingRef = useRef(null);
  const containerRef = useRef(null);
  const numberRefs = useRef([]);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const headingObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(headingRef.current, {
              opacity: [0, 1],
              translateY: [40, 0],
              duration: 1000,
              ease: 'outExpo',
            });
            headingObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (headingRef.current) {
      headingRef.current.style.opacity = '0';
      headingObs.observe(headingRef.current);
    }

    const containerObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;

            // Animate container card
            animate(containerRef.current, {
              opacity: [0, 1],
              translateY: [30, 0],
              scale: [0.98, 1],
              duration: 800,
              ease: 'outExpo',
            });

            // Animate counters
            statistikData.forEach((item, i) => {
              const el = numberRefs.current[i];
              if (el) {
                animateCounter(el, item.angka, item.suffix, i * 200);
              }
            });

            containerObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      containerRef.current.style.opacity = '0';
      containerObs.observe(containerRef.current);
    }

    return () => {
      headingObs.disconnect();
      containerObs.disconnect();
    };
  }, []);

  return (
    <section className="py-20 lg:py-28">
      {/* Section Header */}
      <div ref={headingRef} className="text-center mb-16 lg:mb-24">
        <p className="text-sm font-semibold tracking-[0.3em] uppercase text-green-600 mb-4">
          Dalam Angka
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-green-900">
          Statistik HIMA TI
        </h2>
        <div className="mt-4 mx-auto w-20 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full" />
      </div>

      {/* Stats Container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden bg-white/30 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] rounded-2xl p-8 sm:p-12"
      >
        {/* Decorative blur */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-green-200/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-yellow-200/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {statistikData.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center shadow-lg mb-4">
                {item.ikon}
              </div>

              {/* Number */}
              <span
                ref={(el) => (numberRefs.current[idx] = el)}
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-green-900"
              >
                0{item.suffix}
              </span>

              {/* Label */}
              <span className="text-sm sm:text-base text-green-800/70 font-medium mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

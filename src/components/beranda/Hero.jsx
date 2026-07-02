import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { animate } from 'animejs';
import useParallax from './useParallax';
import bgBeranda from '../../assets/Background-beranda.webp';

export default function Hero() {
  const parallax1 = useParallax(0.2);
  const parallax2 = useParallax(0.4);
  const parallax3 = useParallax(0.15);

  const badgeRef = useRef(null);
  const headingRef = useRef(null);
  const taglineRef = useRef(null);
  const accentRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const elements = [
      { ref: badgeRef, props: { opacity: [0, 1], translateY: [30, 0], duration: 800, ease: 'outExpo' } },
      { ref: headingRef, props: { opacity: [0, 1], translateY: [40, 0], duration: 1000, ease: 'outExpo', delay: 200 } },
      { ref: taglineRef, props: { opacity: [0, 1], translateY: [30, 0], duration: 900, ease: 'outExpo', delay: 500 } },
      { ref: accentRef, props: { opacity: [0, 1], scaleX: [0, 1], duration: 800, ease: 'outExpo', delay: 700 } },
      { ref: ctaRef, props: { opacity: [0, 1], translateY: [20, 0], duration: 800, ease: 'outExpo', delay: 900 } },
      { ref: scrollRef, props: { opacity: [0, 1], duration: 600, ease: 'outExpo', delay: 1500 } },
    ];

    elements.forEach(({ ref, props }) => {
      if (ref.current) {
        ref.current.style.opacity = '0';
        animate(ref.current, props);
      }
    });
  }, []);

  return (
    <section
      id="beranda"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-20 sm:pt-28"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img
          src={bgBeranda}
          alt=""
          fetchpriority="high"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/55 to-white/75" />
      </div>
      {/* Parallax decorative blobs */}
      <div
        ref={parallax1}
        className="absolute top-20 -right-20 w-48 sm:w-72 h-48 sm:h-72 bg-green-300/20 rounded-full blur-3xl will-change-transform pointer-events-none"
      />
      <div
        ref={parallax2}
        className="absolute bottom-20 -left-16 w-40 sm:w-60 h-40 sm:h-60 bg-yellow-300/15 rounded-full blur-3xl will-change-transform pointer-events-none"
      />
      <div
        ref={parallax3}
        className="absolute top-1/3 right-1/4 w-28 sm:w-40 h-28 sm:h-40 bg-green-400/10 rounded-full blur-2xl will-change-transform pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <p
          ref={badgeRef}
          className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-green-800 mb-6 drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]"
        >
          Himpunan Mahasiswa Teknik Informatika
        </p>

        <h1
          ref={headingRef}
          className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-green-950 mb-6 drop-shadow-[0_4px_12px_rgba(255,255,255,0.95)]"
        >
          Kabinet Perkasa
        </h1>

        <p
          ref={taglineRef}
          className="text-lg sm:text-xl lg:text-2xl text-green-900 font-bold leading-relaxed mb-8 drop-shadow-[0_2px_6px_rgba(255,255,255,0.9)]"
        >
          Bersama Membangun, Berdampak Nyata
        </p>

        <div
          ref={accentRef}
          className="mx-auto w-20 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mb-10"
        />

        <Link
          ref={ctaRef}
          to="/tentang"
          className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-green-900 font-bold px-8 py-4 rounded-2xl text-base sm:text-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          Jelajahi Lebih Lanjut
        </Link>
      </div>

      {/* Scroll indicator */}
      <div 
        ref={scrollRef} 
        onClick={() => document.getElementById('beranda-content')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-300 z-10"
      >
        <span className="text-[10px] tracking-[0.25em] font-extrabold uppercase text-green-950/60 select-none">
          Scroll Down
        </span>
        <div className="w-6 h-10 border-2 border-green-800/40 rounded-full flex justify-center p-1.5 shadow-[0_2px_10px_rgba(255,255,255,0.4)] bg-white/20 backdrop-blur-[1px]">
          <div className="w-1.5 h-2 bg-green-900 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}

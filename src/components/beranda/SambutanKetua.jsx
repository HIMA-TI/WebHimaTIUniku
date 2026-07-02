import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

const sambutanData = {
  nama: 'Muhammad Fauzan',
  jabatan: 'Ketua HIMA TI Kabinet Perkasa',
  inisial: 'MF',
  pesan:
    'Assalamualaikum Warahmatullahi Wabarakatuh. Dengan penuh rasa syukur, kami menyambut seluruh civitas akademika Teknik Informatika. Kabinet Perkasa hadir dengan semangat baru untuk membangun organisasi yang dinamis, efektif, dan berdampak positif. Mari bersama-sama kita wujudkan HIMA TI yang lebih baik, lebih kuat, dan lebih bermanfaat bagi seluruh anggota. Salam Perkasa!',
};

export default function SambutanKetua() {
  const headingRef = useRef(null);
  const avatarRef = useRef(null);
  const nameRef = useRef(null);
  const quoteRef = useRef(null);

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

    const contentObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (avatarRef.current) {
              animate(avatarRef.current, {
                opacity: [0, 1],
                scale: [0.8, 1],
                duration: 800,
                ease: 'outExpo',
              });
            }
            if (nameRef.current) {
              animate(nameRef.current, {
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 700,
                ease: 'outExpo',
                delay: 300,
              });
            }
            if (quoteRef.current) {
              animate(quoteRef.current, {
                opacity: [0, 1],
                translateX: [40, 0],
                duration: 900,
                ease: 'outExpo',
                delay: 400,
              });
            }
            contentObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const cardEl = avatarRef.current?.closest('[data-sambutan-card]');
    if (cardEl) {
      [avatarRef, nameRef, quoteRef].forEach((ref) => {
        if (ref.current) ref.current.style.opacity = '0';
      });
      contentObs.observe(cardEl);
    }

    return () => {
      headingObs.disconnect();
      contentObs.disconnect();
    };
  }, []);

  return (
    <section className="py-20 lg:py-28">
      {/* Section Header */}
      <div ref={headingRef} className="text-center mb-16 lg:mb-24">
        <p className="text-sm font-semibold tracking-[0.3em] uppercase text-green-600 mb-4">
          Pesan Ketua
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-green-900">
          Sambutan Ketua Umum
        </h2>
        <div className="mt-4 mx-auto w-20 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full" />
      </div>

      {/* Content Card */}
      <div
        data-sambutan-card
        className="relative overflow-hidden bg-white/30 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] rounded-2xl p-8 sm:p-12"
      >
        {/* Decorative blur */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-green-200/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-yellow-200/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left - Avatar & Info */}
          <div className="flex flex-col items-center text-center flex-shrink-0">
            <div
              ref={avatarRef}
              className="w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center shadow-xl mb-4"
            >
              <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                {sambutanData.inisial}
              </span>
            </div>
            <div ref={nameRef}>
              <h3 className="text-xl font-bold text-green-900">{sambutanData.nama}</h3>
              <p className="text-sm text-green-600 font-medium mt-1">{sambutanData.jabatan}</p>
            </div>
          </div>

          {/* Right - Quote */}
          <div ref={quoteRef} className="relative flex-1">
            {/* Opening quote mark */}
            <span className="absolute -top-4 -left-2 text-6xl sm:text-7xl leading-none text-green-300/30 font-serif select-none">
              &ldquo;
            </span>

            <p className="text-base sm:text-lg text-green-800/80 leading-relaxed italic pl-8 sm:pl-10">
              {sambutanData.pesan}
            </p>

            {/* Closing quote mark */}
            <span className="absolute -bottom-8 right-0 text-6xl sm:text-7xl leading-none text-green-300/30 font-serif select-none">
              &rdquo;
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

const nilaiData = [
  {
    label: 'Nilai',
    nama: 'Progresif',
    isi: 'Memiliki pola pikir yang maju, terbuka terhadap inovasi, dan terus berusaha untuk berkembang serta melakukan perbaikan.',
    ukuran: 'sm:col-span-2 sm:row-span-2',
    warna: 'from-green-600 to-green-700',
    ikon: (
      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    label: 'Nilai',
    nama: 'Kolaboratif',
    isi: 'Memahami bahwa hasil terbaik dicapai melalui kombinasi keahlian dan sumber daya yang beragam.',
    ukuran: 'sm:col-span-2',
    warna: 'from-green-500 to-green-600',
    ikon: (
      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

const budayaData = [
  {
    nama: 'Edukatif',
    isi: 'Organisasi berfungsi sebagai wahana pembelajaran dan pengembangan kapasitas bagi seluruh anggotanya.',
    ukuran: 'col-span-1',
    warna: 'from-yellow-400 to-yellow-500',
    ikonWarnaTeks: 'text-green-900',
    ikon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    nama: 'Responsif',
    isi: 'Cepat tanggap terhadap dinamika internal organisasi dan eksternal.',
    ukuran: 'col-span-1',
    warna: 'from-emerald-400 to-emerald-500',
    ikonWarnaTeks: 'text-white',
    ikon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    nama: 'Aktif',
    isi: 'Memiliki semangat dan inisiatif tinggi untuk berkontribusi secara nyata.',
    ukuran: 'col-span-1',
    warna: 'from-orange-400 to-orange-500',
    ikonWarnaTeks: 'text-white',
    ikon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
    ),
  },
  {
    nama: 'Solutif',
    isi: 'Berfokus pada pencarian solusi dan penyelesaian masalah.',
    ukuran: 'col-span-1',
    warna: 'from-teal-400 to-teal-500',
    ikonWarnaTeks: 'text-white',
    ikon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    nama: 'Adaptif',
    isi: 'Mudah menyesuaikan diri dengan perubahan, situasi, atau kondisi baru secara efektif.',
    ukuran: 'sm:col-span-2',
    warna: 'from-violet-400 to-violet-500',
    ikonWarnaTeks: 'text-white',
    ikon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
];

export default function NilaiBudaya() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cardRefs.current.forEach((el, i) => {
              if (el) {
                animate(el, {
                  opacity: [0, 1],
                  scale: [0.9, 1],
                  translateY: [30, 0],
                  duration: 600,
                  ease: 'outExpo',
                  delay: i * 100,
                });
              }
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    cardRefs.current.forEach((el) => {
      if (el) el.style.opacity = '0';
    });

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = (el) => {
    if (!el) return;
    animate(el, {
      translateY: -6,
      scale: 1.02,
      duration: 350,
      ease: 'outExpo',
    });
  };

  const handleMouseLeave = (el) => {
    if (!el) return;
    animate(el, {
      translateY: 0,
      scale: 1,
      duration: 350,
      ease: 'outExpo',
    });
  };

  const allItems = [...nilaiData, ...budayaData];
  let refIdx = 0;

  return (
    <section ref={sectionRef} className="py-20 lg:py-28">
      {/* Section header */}
      <div className="text-center mb-14">
        <p className="text-sm font-semibold tracking-[0.3em] uppercase text-green-600 mb-4">
          Fondasi Organisasi
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-green-900">
          Nilai & Budaya
        </h2>
        <div className="mt-4 mx-auto w-20 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full" />
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">
        {allItems.map((item, idx) => {
          const currentRef = refIdx++;
          const isNilai = idx < nilaiData.length;

          return (
            <div
              key={idx}
              ref={(el) => (cardRefs.current[currentRef] = el)}
              className={`${item.ukuran} cursor-default`}
              onMouseEnter={(e) => handleMouseEnter(e.currentTarget)}
              onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
            >
              <div
                className={`h-full relative overflow-hidden bg-white/30 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] rounded-2xl ${
                  isNilai ? 'p-8 sm:p-10' : 'p-6 sm:p-8'
                }`}
              >
                {/* Top accent bar */}
                <div
                  className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${item.warna}`}
                />

                {/* Decorative blur */}
                <div
                  className={`absolute -top-12 -right-12 w-28 h-28 rounded-full blur-3xl opacity-15 bg-gradient-to-br ${item.warna}`}
                />

                <div className="relative">
                  {/* Badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.warna} flex items-center justify-center shadow-md ${
                        item.ikonWarnaTeks || 'text-white'
                      }`}
                    >
                      {item.ikon}
                    </div>
                    {isNilai && (
                      <span className="text-[10px] font-bold tracking-widest uppercase text-green-600/60 bg-green-100/50 px-2 py-0.5 rounded-full">
                        {item.label}
                      </span>
                    )}
                    {!isNilai && (
                      <span className="text-[10px] font-bold tracking-widest uppercase text-green-600/60 bg-green-100/50 px-2 py-0.5 rounded-full">
                        Budaya
                      </span>
                    )}
                  </div>

                  <h3
                    className={`font-bold text-green-900 mb-2 ${
                      isNilai ? 'text-xl sm:text-2xl' : 'text-lg'
                    }`}
                  >
                    {item.nama}
                  </h3>

                  <p
                    className={`text-green-800/70 leading-relaxed ${
                      isNilai ? 'text-base' : 'text-sm'
                    }`}
                  >
                    {item.isi}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

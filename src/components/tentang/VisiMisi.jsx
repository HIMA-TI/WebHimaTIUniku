import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

const misiList = [
  {
    nomor: '01',
    isi: 'Membangun aspirasi, kolaborasi dalam inovasi, dan kreativitas mahasiswa, serta memperkuat ikatan kesatuan dan persatuan Mahasiswa Teknik Informatika.',
  },
  {
    nomor: '02',
    isi: 'Meningkatkan Soft Skill serta eksplorasi pengembangan minat, bakat, dan potensi akademik maupun non-akademik.',
  },
  {
    nomor: '03',
    isi: 'Mendorong mahasiswa Teknik Informatika untuk mengamalkan dan menjalankan Tri Dharma Perguruan Tinggi.',
  },
];

export default function VisiMisi() {
  const sectionRef = useRef(null);
  const visiCardRef = useRef(null);
  const misiRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate visi card
            if (entry.target === visiCardRef.current) {
              animate(visiCardRef.current, {
                opacity: [0, 1],
                translateY: [50, 0],
                scale: [0.95, 1],
                duration: 800,
                ease: 'outExpo',
              });
            }
            // Animate misi cards with stagger
            if (entry.target === sectionRef.current) {
              misiRefs.current.forEach((el, i) => {
                if (el) {
                  animate(el, {
                    opacity: [0, 1],
                    translateY: [40, 0],
                    duration: 700,
                    ease: 'outExpo',
                    delay: 300 + i * 150,
                  });
                }
              });
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (visiCardRef.current) {
      visiCardRef.current.style.opacity = '0';
      observer.observe(visiCardRef.current);
    }

    misiRefs.current.forEach((el) => {
      if (el) el.style.opacity = '0';
    });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Anime.js hover handlers
  const handleMouseEnter = (el) => {
    if (!el) return;
    animate(el, {
      translateY: -8,
      scale: 1.02,
      duration: 400,
      ease: 'outExpo',
    });
  };

  const handleMouseLeave = (el) => {
    if (!el) return;
    animate(el, {
      translateY: 0,
      scale: 1,
      duration: 400,
      ease: 'outExpo',
    });
  };

  return (
    <section ref={sectionRef} className="py-20 lg:py-28">
      {/* Section header */}
      <div className="text-center mb-14">
        <p className="text-sm font-semibold tracking-[0.3em] uppercase text-green-600 mb-4">
          Arah Pergerakan
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-green-900">
          Visi & Misi
        </h2>
        <div className="mt-4 mx-auto w-20 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full" />
      </div>

      {/* Visi Card */}
      <div
        ref={visiCardRef}
        className="mb-10 cursor-default"
        onMouseEnter={() => handleMouseEnter(visiCardRef.current)}
        onMouseLeave={() => handleMouseLeave(visiCardRef.current)}
      >
        <div className="relative overflow-hidden bg-white/30 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] rounded-2xl p-8 sm:p-10 lg:p-12">
          {/* Decorative accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-600 via-green-500 to-yellow-400" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-200/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-200/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-green-900 tracking-wide uppercase">
                Visi
              </h3>
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-green-900 leading-relaxed">
              &ldquo;Terwujudnya Himpunan Mahasiswa Teknik Informatika yang berpedoman pada{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-green-500">
                Tri Dharma Perguruan Tinggi
              </span>{' '}
              serta menjadikan Himpunan Mahasiswa Teknik Informatika yang{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-600 font-extrabold">
                PERKASA
              </span>
              .&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Misi Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {misiList.map((misi, idx) => (
          <div
            key={idx}
            ref={(el) => (misiRefs.current[idx] = el)}
            className="group cursor-default"
            onMouseEnter={(e) => handleMouseEnter(e.currentTarget)}
            onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
          >
            <div className="h-full relative overflow-hidden bg-white/30 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] rounded-2xl p-6 sm:p-8">
              {/* Decorative */}
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-green-200/15 rounded-full blur-2xl group-hover:bg-green-200/30 transition-colors duration-500" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg">
                    <span className="text-green-900 font-extrabold text-sm">{misi.nomor}</span>
                  </div>
                  <h3 className="text-lg font-bold text-green-900 tracking-wide uppercase">
                    Misi
                  </h3>
                </div>
                <p className="text-green-800/80 leading-relaxed">
                  {misi.isi}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

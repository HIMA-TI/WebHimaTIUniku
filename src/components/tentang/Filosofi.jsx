import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

const narasi = [
  {
    judul: 'Kabinet Perkasa',
    isi: 'Kabinet Perkasa bukan sekadar tentang kekuatan, ketangguhan, ataupun keberanian. Nama ini membawa makna yang jauh lebih mendalam dari sekadar kata.',
  },
  {
    judul: 'Kerangka Kerja Ideal',
    isi: 'Kabinet ini hadir dengan fokus pada kerangka kerja dan tata kelola organisasi yang ideal — terlahir dari keberhasilan signifikan Kabinet Progresif yang telah membuka jalan sebelumnya.',
  },
  {
    judul: 'Dinamis, Efektif, Berdampak',
    isi: 'Prinsip utamanya adalah menciptakan organisasi yang dinamis, efektif, dan berdampak positif bagi seluruh civitas akademika Teknik Informatika.',
  },
  {
    judul: 'Lebih dari Mimpi',
    isi: 'Kabinet Perkasa tidak hanya bermimpi tentang perubahan — kami membangun kapasitas anggota, peka terhadap lingkungan, bekerja dengan cerdas, penuh energi, dan berorientasi pada hasil yang nyata.',
  },
  {
    judul: 'Kompas Kolektif',
    isi: 'Prinsip inilah yang menjadi kompas dalam setiap pengambilan keputusan dan tindakan kolektif, sehingga dampaknya maksimal dan berkelanjutan bagi seluruh ekosistem HIMA TI.',
  },
];

export default function Filosofi() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    // Animate heading on mount
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

    // Animate each narasi item on scroll
    const itemObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.idx);
            animate(entry.target, {
              opacity: [0, 1],
              translateX: [idx % 2 === 0 ? -60 : 60, 0],
              duration: 900,
              ease: 'outExpo',
              delay: 100,
            });
            itemObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    itemRefs.current.forEach((el) => {
      if (el) {
        el.style.opacity = '0';
        itemObs.observe(el);
      }
    });

    return () => {
      headingObs.disconnect();
      itemObs.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28">
      {/* Heading */}
      <div ref={headingRef} className="text-center mb-16 lg:mb-24">
        <p className="text-sm font-semibold tracking-[0.3em] uppercase text-green-600 mb-4">
          Filosofi Kabinet
        </p>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-green-900">
          PERKASA
        </h2>
        <div className="mt-4 mx-auto w-20 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full" />
      </div>

      {/* Narasi Items */}
      <div className="max-w-3xl mx-auto space-y-12 lg:space-y-16">
        {narasi.map((item, idx) => (
          <div
            key={idx}
            ref={(el) => (itemRefs.current[idx] = el)}
            data-idx={idx}
            className={`flex flex-col ${
              idx % 2 === 0 ? 'items-start text-left' : 'items-end text-right'
            }`}
          >
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-3">
                {idx % 2 !== 0 && (
                  <div className="flex-1 h-px bg-gradient-to-l from-green-600/40 to-transparent" />
                )}
                <span className="text-xs font-bold tracking-widest uppercase text-green-600/70">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                {idx % 2 === 0 && (
                  <div className="flex-1 h-px bg-gradient-to-r from-green-600/40 to-transparent" />
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-green-900 mb-2">
                {item.judul}
              </h3>
              <p className="text-base sm:text-lg text-green-800/70 leading-relaxed">
                {item.isi}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

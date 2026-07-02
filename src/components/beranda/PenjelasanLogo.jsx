import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

import logoLingkaran from '../../assets/logo-lingkaran.png';
import logoRodaGerigi from '../../assets/loho-roda gerigi.png';
import logoPCB from '../../assets/logo - printed circuit board.png';
import logoUniku from '../../assets/logo-uniku.png';

const logoElements = [
  {
    gambar: logoLingkaran,
    judul: 'Lingkaran',
    deskripsi:
      'Lingkaran biru melambangkan persatuan dan kesatuan seluruh anggota HIMA TI. Bentuk tanpa sudut mencerminkan solidaritas yang utuh dan ikatan kekeluargaan yang kuat dalam organisasi.',
    warna: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
  },
  {
    gambar: logoRodaGerigi,
    judul: 'Roda Gerigi',
    deskripsi:
      'Roda gerigi berwarna emas melambangkan semangat kerja keras, inovasi, dan dinamika dunia teknik. Setiap gigi roda mencerminkan kolaborasi antar anggota yang saling menggerakkan kemajuan bersama.',
    warna: 'from-yellow-500 to-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
  },
  {
    gambar: logoPCB,
    judul: 'Printed Circuit Board',
    deskripsi:
      'Jalur sirkuit biru di sisi kiri dan kanan melambangkan konektivitas dan dunia teknologi informasi. Menunjukkan bahwa HIMA TI senantiasa terhubung dengan perkembangan teknologi digital terkini.',
    warna: 'from-cyan-500 to-blue-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    text: 'text-cyan-700',
  },
  {
    gambar: logoUniku,
    judul: 'Lambang Universitas Kuningan',
    deskripsi:
      'Lambang di bagian tengah merepresentasikan identitas Universitas Kuningan sebagai almamater. Sayap dan kepala kuda Kuningan mencerminkan semangat kepahlawanan dan kebanggaan institusi.',
    warna: 'from-red-500 to-blue-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-700',
  },
];

export default function PenjelasanLogo() {
  const headingRef = useRef(null);
  const cardRefs = useRef([]);

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

    const cardObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.idx);
            const fromLeft = idx % 2 === 0;
            animate(entry.target, {
              opacity: [0, 1],
              translateX: [fromLeft ? -80 : 80, 0],
              duration: 900,
              ease: 'outExpo',
              delay: 150 + idx * 100,
            });
            cardObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    cardRefs.current.forEach((el) => {
      if (el) {
        el.style.opacity = '0';
        cardObs.observe(el);
      }
    });

    return () => {
      headingObs.disconnect();
      cardObs.disconnect();
    };
  }, []);

  return (
    <section className="py-20 lg:py-28">
      {/* Section Header */}
      <div ref={headingRef} className="text-center mb-16 lg:mb-24">
        <p className="text-sm font-semibold tracking-[0.3em] uppercase text-green-600 mb-4">
          Identitas Kami
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-green-900">
          Makna Logo HIMA TI
        </h2>
        <div className="mt-4 mx-auto w-20 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full" />
      </div>

      {/* Logo Elements */}
      <div className="space-y-8 lg:space-y-12">
        {logoElements.map((item, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div
              key={item.judul}
              ref={(el) => (cardRefs.current[idx] = el)}
              data-idx={idx}
              className={`relative overflow-hidden bg-white/30 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] rounded-2xl p-6 sm:p-8 lg:p-10`}
            >
              {/* Decorative blur */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-green-200/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-yellow-200/10 rounded-full blur-3xl pointer-events-none" />

              <div
                className={`relative flex flex-col ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } items-center gap-8 lg:gap-12`}
              >
                {/* Logo Image */}
                <div className="flex-shrink-0 w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56">
                  <img
                    src={item.gambar}
                    alt={item.judul}
                    className="w-full h-full object-contain drop-shadow-lg"
                  />
                </div>

                {/* Text Content */}
                <div className="flex-1 text-center lg:text-left">
                  <div className={`inline-flex items-center gap-2 ${item.bg} ${item.border} border px-4 py-1.5 rounded-full mb-4`}>
                    <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${item.warna}`} />
                    <span className={`text-sm font-bold ${item.text}`}>
                      Elemen {idx + 1}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-green-900 mb-3">
                    {item.judul}
                  </h3>
                  <p className="text-base text-green-800/70 leading-relaxed max-w-xl">
                    {item.deskripsi}
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

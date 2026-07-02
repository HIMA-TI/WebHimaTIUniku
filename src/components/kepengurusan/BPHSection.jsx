import { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import logo from '../../assets/logo1.png';
import romiImg from '../../assets/kahim.webp';
import raihanImg from '../../assets/wakahim.webp';
import naylaImg from '../../assets/sekum1.webp';
import haqilImg from '../../assets/sekum2.webp';
import yeyenImg from '../../assets/yeyenBendum1.webp';
import salwaImg from '../../assets/bendum2.webp';

const bphData = [
  { nama: 'Romi Ahmad Al-Malik', jabatan: 'Ketua', foto: romiImg },
  { nama: 'Muhammad Raihan Dhenda', jabatan: 'Wakil Ketua', foto: raihanImg },
  { nama: 'Nayla Nur Alvi', jabatan: 'Sekretaris I', foto: naylaImg },
  { nama: 'Muhammad Haqil Abdillah', jabatan: 'Sekretaris II', foto: haqilImg },
  { nama: 'Yeyen Ai Nurhidayati', jabatan: 'Bendahara I', foto: yeyenImg },
  { nama: 'Salwa Hamdunah', jabatan: 'Bendahara II', foto: salwaImg },
];

export default function BPHSection() {
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
            animate(entry.target, {
              opacity: [0, 1],
              translateY: [40, 0],
              scale: [0.95, 1],
              duration: 700,
              ease: 'outExpo',
              delay: 200 + idx * 120,
            });
            cardObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
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
          Pengurus Inti
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-green-900">
          Badan Pengurus Harian
        </h2>
        <div className="mt-4 mx-auto w-20 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full" />
      </div>

      {/* BPH Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bphData.map((member, idx) => (
          <div
            key={idx}
            ref={(el) => (cardRefs.current[idx] = el)}
            data-idx={idx}
            className="relative overflow-hidden rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] h-80 sm:h-96 group cursor-default"
          >
            {/* Photo Background */}
            {member.foto ? (
              <img
                src={member.foto}
                alt={`Foto ${member.nama}`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                <img
                  src={logo}
                  alt="Foto pengurus"
                  className="w-32 h-32 sm:w-40 sm:h-40 object-contain opacity-20 group-hover:opacity-25 transition-opacity duration-500"
                />
              </div>
            )}

            {/* Top accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-600 to-yellow-400 z-10" />

            {/* Bottom-heavy gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-green-950/95 via-green-950/40 to-transparent z-0" />

            {/* Name and position at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-center z-10">
              <h3 className="text-lg sm:text-xl font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                {member.nama}
              </h3>
              <div className="mt-3 inline-block bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1 rounded-full">
                <p className="text-xs sm:text-sm text-yellow-300 font-bold tracking-wider uppercase">
                  {member.jabatan}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import { useState } from 'react';
import logo from '../../assets/logo1.png';

export default function FlipCard({ divisi }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`flip-card h-80 sm:h-96 cursor-pointer select-none rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.12)] ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50 group ${isFlipped ? 'is-flipped' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
      role="button"
      tabIndex={0}
      aria-label={`Detail divisi ${divisi.nama}`}
      aria-pressed={isFlipped}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsFlipped((prev) => !prev);
        }
      }}
    >
      <div className="flip-card-inner">
        {/* === FRONT FACE === */}
        <div className="flip-card-front">
          {/* Photo Background (dummy logo) */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
            <img
              src={logo}
              alt="Foto divisi"
              className="w-32 h-32 sm:w-40 sm:h-40 object-contain opacity-15"
            />
          </div>

          {/* Top accent bar */}
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${divisi.warna} z-10`} />

          {/* Bottom gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/85 via-green-900/25 to-transparent" />

          {/* Content at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-center z-10">
            {/* Icon */}
            <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-gradient-to-br ${divisi.warna} flex items-center justify-center shadow-xl mb-4 transition-transform duration-300 group-hover:scale-[1.03]`}>
              {divisi.ikon}
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white drop-shadow-lg">{divisi.nama}</h3>
            <p className="text-sm text-green-200/80 font-medium mt-1">{divisi.namaLengkap}</p>

            {/* Interaction hint */}
            <p className="mt-3 inline-flex items-center justify-center text-xs text-white/70 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
              Hover / tap untuk detail
            </p>
          </div>
        </div>

        {/* === BACK FACE === */}
        <div className={`flip-card-back bg-gradient-to-br ${divisi.warna}`}>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6 sm:p-8">
            {/* Decorative blur */}
            <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none" />

            <h3 className="text-xl sm:text-2xl font-bold mb-2 relative">{divisi.nama}</h3>
            <p className="text-white/60 text-sm font-medium mb-4 relative">{divisi.namaLengkap}</p>
            <p className="text-white/90 leading-relaxed text-sm sm:text-base relative">{divisi.deskripsi}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

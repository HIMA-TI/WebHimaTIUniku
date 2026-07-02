import { useState } from 'react';

export default function ProgramFlipCard({ program }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`program-flip-card h-64 sm:h-72 cursor-pointer ${isFlipped ? 'is-flipped' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="program-flip-card-inner">
        {/* Front: Image + Title */}
        <div className="program-flip-card-front">
          <img
            src={program.gambar}
            alt={program.judul}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="text-lg font-bold text-white drop-shadow-lg">
              {program.judul}
            </h3>
          </div>
        </div>

        {/* Back: Description + Optional Link */}
        <div className="program-flip-card-back bg-gradient-to-br from-green-600 to-green-800 flex flex-col justify-center items-center text-center p-6">
          <h3 className="text-lg font-bold text-white mb-3">{program.judul}</h3>
          <p className="text-white/85 text-sm leading-relaxed mb-4 line-clamp-4">
            {program.deskripsi}
          </p>
          {program.link && (
            <a
              href={program.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Lihat Detail
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

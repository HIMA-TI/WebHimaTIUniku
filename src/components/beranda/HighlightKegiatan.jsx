import { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import usePrograms from '../../hooks/usePrograms';
import ProgramFlipCard from './ProgramFlipCard';

const MAX_DISPLAY = 6;

export default function HighlightKegiatan() {
  const headingRef = useRef(null);
  const cardRefs = useRef([]);
  const emptyRef = useRef(null);
  const { programs } = usePrograms();

  const displayPrograms = programs.slice(0, MAX_DISPLAY);

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

    if (displayPrograms.length === 0 && emptyRef.current) {
      const emptyObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate(emptyRef.current, {
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 800,
                ease: 'outExpo',
              });
              emptyObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      emptyRef.current.style.opacity = '0';
      emptyObs.observe(emptyRef.current);
      return () => {
        headingObs.disconnect();
        emptyObs.disconnect();
      };
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
  }, [displayPrograms.length]);

  return (
    <section className="py-20 lg:py-28">
      {/* Section Header */}
      <div ref={headingRef} className="text-center mb-16 lg:mb-24">
        <p className="text-sm font-semibold tracking-[0.3em] uppercase text-green-600 mb-4">
          Program Unggulan
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-green-900">
          Kegiatan & Program
        </h2>
        <div className="mt-4 mx-auto w-20 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full" />
      </div>

      {/* Empty State */}
      {displayPrograms.length === 0 && (
        <div ref={emptyRef} className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <p className="text-green-800/50 text-lg font-medium">
            Belum ada program yang ditambahkan
          </p>
          <p className="text-green-800/40 text-sm mt-2">
            Program akan muncul di sini setelah ditambahkan melalui Portal Pengurus
          </p>
        </div>
      )}

      {/* Program Cards Grid */}
      {displayPrograms.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPrograms.map((program, idx) => (
              <div
                key={program.id}
                ref={(el) => (cardRefs.current[idx] = el)}
                data-idx={idx}
              >
                <ProgramFlipCard program={program} />
              </div>
            ))}
          </div>

          {/* "Lihat Semua" button if more than MAX_DISPLAY */}
          {programs.length > MAX_DISPLAY && (
            <div className="text-center mt-10">
              <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-green-900 font-bold px-8 py-3 rounded-xl text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                Lihat Semua Program
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

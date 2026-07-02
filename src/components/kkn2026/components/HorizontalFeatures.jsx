import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalFeatures({ setCurrentTab }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      const scrollAnim = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: '#kkn-features',
          pin: '#kkn-horizontal-pin',
          start: 'top top',
          end: () => `+=${track.scrollWidth * 1.15}`,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });

      const textElements = gsap.utils.toArray('.home-animate__text-group > span') || [];
      textElements.forEach((el) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            containerAnimation: scrollAnim,
            start: 'left 95%',
            end: 'right 5%',
            scrub: 1,
          }
        });

        const randRotate = gsap.utils.random(-15, 15);
        tl.fromTo(el,
          { y: 80, opacity: 0, scale: 0.8, rotateZ: randRotate },
          { y: 0, opacity: 1, scale: 1, rotateZ: 0, ease: 'back.out(1.2)', duration: 0.3 }
        )
        .to(el, { opacity: 1, duration: 0.4 })
        .to(el,
          { y: -80, opacity: 0, scale: 0.8, rotateZ: -randRotate, ease: 'back.in(1.2)', duration: 0.3 }
        );
      });
    });

    mm.add('(max-width: 767px)', () => {
      const marginRight = 40;
      const endX = Math.max(0, track.scrollWidth - window.innerWidth - marginRight);
      const scrollAnim = gsap.to(track, {
        x: -endX,
        ease: 'none',
        scrollTrigger: {
          trigger: '#kkn-features',
          pin: '#kkn-horizontal-pin',
          start: 'top top',
          end: '+=100%',
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });

      gsap.utils.toArray('.home-animate__text-group > span').forEach((el) => {
        gsap.timeline({
          scrollTrigger: {
            trigger: el,
            containerAnimation: scrollAnim,
            start: 'left 95%',
            end: 'right 5%',
            scrub: 1,
          }
        })
        .fromTo(el, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.15 })
        .to(el, { opacity: 1, duration: 0.2 })
        .to(el, { y: -30, opacity: 0, duration: 0.15 });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="kkn-features" className="relative overflow-hidden bg-white border-b border-gray-100">
      <div id="kkn-horizontal-pin" className="h-screen flex flex-col justify-center overflow-hidden py-16 md:py-0">
        <div className="w-full relative flex-1 flex flex-col md:flex-row items-start md:items-center z-10 h-full">
          <div
            ref={trackRef}
            id="kkn-horizontal-track"
            className="flex flex-row items-center h-full gap-0 md:gap-16 w-max px-0 md:pl-[var(--desktop-padding,24px)] md:pr-[var(--desktop-padding,24px)] md:whitespace-nowrap"
            style={{ willChange: 'transform' }}
          >
            {/* Panel 1 */}
            <div className="w-screen md:w-[calc(100vw-var(--desktop-padding,24px))] md:max-w-[calc(100vw-var(--desktop-padding,24px))] h-full flex items-center shrink-0 pr-0 md:pr-[var(--desktop-padding,24px)] whitespace-normal px-6 md:px-0">
              <div className="flex flex-col md:flex-row items-center justify-between gap-12 w-full">
                <div className="max-w-2xl space-y-6">
                  <span className="px-4 py-1.5 bg-wk-purple-light text-wk-purple-primary font-bold text-sm rounded-full inline-block">
                    Aset Digital Siap Pakai
                  </span>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                    Gak Perlu Coding<br />
                    <span className="text-wk-purple-primary font-display italic">Tinggal Pake</span> Aja!
                  </h2>
                  <p className="text-gray-500 font-bold text-base md:text-lg leading-relaxed">
                    Web Library Inventaris IPTEK HIMA TI kumpulan aplikasi, website, dan AR siap pakai buat siapa aja.
                  </p>

                  <button
                    onClick={() => {
                      setCurrentTab('aset-digital');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-extrabold rounded-full transition-all duration-300 shadow-md hover:shadow-lg text-sm cursor-pointer border-0"
                  >
                    Jelajahi Katalog ↓
                  </button>
                </div>

                <div className="w-full md:w-64 md:h-64 relative flex items-center justify-center shrink-0">
                  <div className="w-32 h-32 md:w-48 md:h-48 text-pink-500 opacity-90 flex items-center justify-center">
                    <svg viewBox="0 0 124 124" className="w-full h-full">
                      <path fill="currentColor" d="m43.18 54.2-35.55.13a7.65 7.65 0 0 0 0 15.31l35.55.14-25.04 25.24a7.65 7.65 0 0 0 10.82 10.82l25.24-25.04.13 35.55a7.65 7.65 0 0 0 15.31 0l.14-35.55 25.24 25.04a7.65 7.65 0 0 0 10.82-10.82l-25.04-25.24 35.55-.14a7.65 7.65 0 0 0 0-15.31l-35.55-.14 25.04-25.24a7.65 7.65 0 0 0-10.82-10.82l-25.24 25.04-.14-35.55a7.65 7.65 0 0 0-15.31 0l-.14 35.55-25.24-25.04a7.65 7.65 0 0 0-10.82 10.82l25.04 25.24Z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Group 1: Nice */}
            <p className="home-animate__text-group home-animate__text-group--nice shrink-0 snap-center flex flex-wrap justify-center gap-2 md:gap-0 px-6 md:px-0" aria-hidden="true">
              <span className="home-animate__text home-animate__text--green-gradient home-animate__text--large">
                <span>Memanfaatkan</span>
              </span>
              <span className="home-animate__icon text-wk-yellow-primary opacity-80 mx-2" style={{ width: '4rem', height: '4rem', transform: 'translateY(1rem)' }}>
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 10 50 Q 25 20 40 50 T 70 50 T 100 50" />
                </svg>
              </span>
              <span className="home-animate__text home-animate__text--purple-gradient">
                <span>Inventaris</span>
              </span>
            </p>

            {/* Group 2: Add */}
            <p className="home-animate__text-group home-animate__text-group--add shrink-0 snap-center flex flex-wrap justify-center gap-2 md:gap-0 px-6 md:px-0" aria-hidden="true">
              <span className="font-extrabold text-gray-400">aplikasi</span>
              <span className="home-animate__personality-wrap flex items-center">
                <span className="home-animate__icon home-animate__icon--hand text-wk-yellow-primary opacity-90">
                  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
                    <path d="M 10 50 C 30 10, 80 10, 50 50 C 20 90, 80 90, 90 40" />
                  </svg>
                </span>
                <span className="font-extrabold text-wk-purple-primary">&nbsp;Divisi IPTEK&nbsp;</span>
                <span className="home-animate__icon home-animate__icon--circle text-wk-yellow-primary opacity-90" style={{ animationDuration: '8s' }}>
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" strokeDasharray="10 10" fill="none" />
                  </svg>
                </span>
              </span>
              <span className="font-extrabold text-gray-400">&nbsp;HIMA TI&nbsp;</span>
              <span className="font-extrabold text-gray-900">&nbsp;untuk&nbsp;</span>
            </p>

            {/* Group 3: Super */}
            <p className="home-animate__text-group home-animate__text-group--super shrink-0 snap-center flex flex-wrap justify-center gap-2 md:gap-0 px-6 md:px-0" aria-hidden="true">
              <span className="home-animate__icon home-animate__icon--asterisk text-pink-500 opacity-90">
                <svg viewBox="0 0 124 124" className="w-full h-full">
                  <path fill="currentColor" d="m43.18 54.2-35.55.13a7.65 7.65 0 0 0 0 15.31l35.55.14-25.04 25.24a7.65 7.65 0 0 0 10.82 10.82l25.24-25.04.13 35.55a7.65 7.65 0 0 0 15.31 0l.14-35.55 25.24 25.04a7.65 7.65 0 0 0 10.82-10.82l-25.04-25.24 35.55-.14a7.65 7.65 0 0 0 0-15.31l-35.55-.14 25.04-25.24a7.65 7.65 0 0 0-10.82-10.82l-25.24 25.04-.14-35.55a7.65 7.65 0 0 0-15.31 0l-.14 35.55-25.24-25.04a7.65 7.65 0 0 0-10.82 10.82l25.04 25.24Z" />
                </svg>
              </span>
              <span className="home-animate__text home-animate__text--green home-animate__text--large">
                <span>mahasiswa</span>
              </span>
              <span className="home-animate__plug-and-play-wrap">
                <span className="home-animate__text home-animate__text--pink home-animate__text--large">
                  <span><span>KKN</span></span>
                </span>
              </span>
              <span className="home-animate__icon home-animate__icon--curve text-wk-yellow-primary">
                <svg viewBox="0 0 191 149" className="w-full h-full" fill="none">
                  <path d="M3 146C116.996 146 74.3933 3 188 3" stroke="currentColor" strokeWidth="6" />
                </svg>
              </span>
            </p>

            {/* Group 4: Eases */}
            <p className="home-animate__text-group home-animate__text-group--eases shrink-0 snap-center flex flex-wrap justify-center gap-2 md:gap-0 px-6 md:px-0" aria-hidden="true">
              <span className="home-animate__text home-animate__text--pink home-animate__text--large">
                <span>Universitas</span>
              </span>
              <span className="home-animate__icon text-wk-yellow-primary opacity-90 mx-4" style={{ width: '4rem', height: '4rem' }}>
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 10 80 C 40 10, 80 10, 50 50 C 30 80, 80 80, 90 40" />
                  <path d="M 75 40 L 90 40 L 95 55" />
                </svg>
              </span>
            </p>

            {/* Group 5: Snap */}
            <p className="home-animate__text-group home-animate__text-group--snap shrink-0 snap-center pr-0 md:pr-8 flex flex-wrap justify-center gap-2 md:gap-0 px-6 md:px-0" aria-hidden="true">
              <span className="home-animate__snap">
                <span>Kuningan!</span>
                <span>Kuningan!</span>
              </span>
              <span className="home-animate__icon text-wk-yellow-primary opacity-80 mx-4" style={{ width: '4rem', height: '4rem', transform: 'translateY(-1rem)' }}>
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round">
                  <path d="M 50 10 L 50 90 M 10 50 L 90 50 M 20 20 L 80 80 M 20 80 L 80 20" />
                </svg>
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

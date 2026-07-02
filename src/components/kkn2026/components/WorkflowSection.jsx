import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const workflowSteps = [
  { step: '01', title: 'Pilih & Ajukan Aset', desc: 'Jelajahi galeri di tab Aset Digital, tentukan aplikasi yang paling sesuai dengan kebutuhanmu, lalu ajukan melalui form yang tersedia.' },
  { step: '02', title: 'Verifikasi & Setup', desc: 'Tim Divisi IPTEK HIMA TI akan memverifikasi pengajuanmu dan segera menyiapkan sistem aplikasinya.' },
  { step: '03', title: 'Siap Digunakan!', desc: 'Aset digital telah siap di-deploy dan dapat langsung digunakan untuk mendukung kegiatanmu.' }
];

export default function WorkflowSection() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.workflow-card',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.25, duration: 0.8, ease: 'back.out(1.2)',
          scrollTrigger: { trigger: '#kkn-workflow', start: 'top 75%' } }
      );

      ['#workflow-progress-vertical', '#workflow-progress-vertical-mobile'].forEach((sel) => {
        const el = document.querySelector(sel);
        if (el) {
          gsap.to(el, {
            height: '100%', ease: 'none',
            scrollTrigger: { trigger: '#kkn-workflow-container', start: 'top 40%', end: 'bottom 60%', scrub: true }
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="kkn-workflow" className="container mx-auto px-6 py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-wk-text-dark leading-tight mb-4">
          Gimana <span className="text-wk-purple-primary font-display italic">Caranya?</span>
        </h2>
        <p className="text-wk-text-light font-bold text-lg">Ikuti 3 langkah mudah ini untuk deploy aset digital di desa kamu.</p>
      </div>

      <div id="kkn-workflow-container" className="relative max-w-4xl mx-auto mt-20">
        {/* Desktop connector */}
        <div className="absolute left-6 md:left-1/2 top-0 w-1 bg-gray-100 -translate-x-1/2 hidden md:block" style={{ height: '100%' }}>
          <div id="workflow-progress-vertical" className="absolute left-0 top-0 w-full bg-wk-purple-primary origin-top" style={{ height: '0%' }} />
        </div>
        {/* Mobile connector */}
        <div className="absolute left-6 md:left-1/2 top-0 w-1 bg-gray-100 -translate-x-1/2 block md:hidden" style={{ height: '100%' }}>
          <div id="workflow-progress-vertical-mobile" className="absolute left-0 top-0 w-full bg-wk-purple-primary origin-top" style={{ height: '0%' }} />
        </div>

        {workflowSteps.map((item, index) => {
          const isEven = index % 2 === 0;
          return (
            <div key={item.step} className="workflow-card relative flex flex-col md:flex-row items-center gap-8 mb-16 last:mb-0">
              {isEven ? (
                <div className="w-full md:w-1/2 flex md:justify-end md:text-right pl-16 md:pl-0 pr-0 md:pr-12">
                  <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs hover:shadow-md transition-shadow duration-300 max-w-md relative">
                    <span className="text-5xl font-extrabold text-wk-purple-light block mb-2">{item.step}</span>
                    <h4 className="text-xl font-bold text-wk-text-dark mb-2">{item.title}</h4>
                    <p className="text-gray-500 font-semibold text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ) : (
                <div className="hidden md:block w-1/2" />
              )}

              <div className="absolute left-6 md:left-1/2 top-12 md:top-1/2 w-10 h-10 rounded-full border-4 border-white bg-wk-purple-primary -translate-x-1/2 -translate-y-1/2 shadow-md z-20 flex items-center justify-center">
                <span className="text-xs font-extrabold text-white">{index + 1}</span>
              </div>

              {isEven ? (
                <div className="hidden md:block w-1/2" />
              ) : (
                <div className="w-full md:w-1/2 flex md:justify-start md:text-left pl-16 md:pl-12 pr-0">
                  <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs hover:shadow-md transition-shadow duration-300 max-w-md relative">
                    <span className="text-5xl font-extrabold text-wk-purple-light block mb-2">{item.step}</span>
                    <h4 className="text-xl font-bold text-wk-text-dark mb-2">{item.title}</h4>
                    <p className="text-gray-500 font-semibold text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

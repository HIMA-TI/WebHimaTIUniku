import Hero from './Hero';
import HighlightKegiatan from './HighlightKegiatan';
import Statistik from './Statistik';
import PenjelasanLogo from './PenjelasanLogo';

export default function Beranda() {
  return (
    <section id="beranda">
      <Hero />

      <div id="beranda-content" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-green-300/50 to-transparent" />

        <div style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 500px' }}>
          <HighlightKegiatan />
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-green-300/50 to-transparent" />

        <div style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 400px' }}>
          <Statistik />
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-green-300/50 to-transparent" />

        <div style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 600px' }}>
          <PenjelasanLogo />
        </div>
      </div>
    </section>
  );
}

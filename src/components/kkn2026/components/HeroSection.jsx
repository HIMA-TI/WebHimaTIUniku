import { ArrowUpRight } from 'lucide-react';
import InteractiveBackground from './InteractiveBackground';

export default function HeroSection({ setCurrentTab }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 border-b border-gray-100 relative overflow-hidden">
      <InteractiveBackground />
      <header className="flex-1 flex items-center justify-center w-full max-w-7xl mx-auto px-6 pt-32 pb-20 md:pt-36 z-10">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-extrabold leading-tight mb-8">
            Upgrade Proker KKN<br />
            Kamu <span className="handwriting inline-block -rotate-2">Biar Makin</span>{' '}
            <span className="text-wk-yellow-primary font-display inline-block rotate-3">Keren!</span>
          </h1>

          <p className="text-base md:text-lg text-wk-text-light max-w-2xl mx-auto mb-10 font-bold leading-relaxed">
  Ruang kolaborasi Divisi IPTEK HIMA TI & mahasiswa Teknik Informatika. Temukan Website, Game Edukasi, atau AR yang pas untuk proker KKN kamu. Tinggal pilih, ajukan izin, dan pakai gratis!
</p>

          <button
            onClick={() => {
              setCurrentTab('aset-digital');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-3 bg-wk-purple-primary text-white font-bold text-lg py-4 px-8 rounded-full hover:bg-wk-purple-dark hover:scale-105 transition-all shadow-xl shadow-wk-purple-primary/30 group cursor-pointer bg-transparent border-0"
          >
            Cek Katalog Digital
            <span className="w-8 h-8 bg-white text-wk-purple-primary rounded-full flex items-center justify-center group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </header>
    </div>
  );
}

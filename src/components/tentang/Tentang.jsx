import Filosofi from './Filosofi';
import VisiMisi from './VisiMisi';
import NilaiBudaya from './NilaiBudaya';

export default function Tentang() {
  return (
    <section id="tentang" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-28 sm:pt-32">
      {/* Divider dari konten atas */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-green-300/50 to-transparent" />

      <Filosofi />

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-green-300/50 to-transparent" />

      <VisiMisi />

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-green-300/50 to-transparent" />

      <NilaiBudaya />
    </section>
  );
}

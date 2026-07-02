import BPHSection from './BPHSection';
import DivisiSection from './DivisiSection';

export default function Kepengurusan() {
  return (
    <section id="kepengurusan" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-28 sm:pt-32">
      <BPHSection />

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-green-300/50 to-transparent" />

      <DivisiSection />
    </section>
  );
}

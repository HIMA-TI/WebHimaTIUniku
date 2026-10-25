import { useEffect } from 'react';

export default function TechnoversaryRedirect() {
  useEffect(() => {
    // Direct browser navigation to the standalone Technoversary landing page
    window.location.replace('/technoversary/index.html');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFB82E]">
      <div className="flex flex-col items-center gap-4 text-center px-4">
        <div className="w-12 h-12 border-4 border-[#38096B] border-t-transparent rounded-full animate-spin" />
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-[#38096B] tracking-tight">
            TECHNOVERSARY VOL. II
          </h2>
          <p className="text-xs font-semibold text-[#38096B]/80">
            Membuka landing page...
          </p>
        </div>
      </div>
    </div>
  );
}

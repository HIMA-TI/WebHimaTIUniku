import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE } from '../config/api';
import logo from '../assets/logo1.png';

export default function ShortUrlRedirect() {
  const { code } = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const res = await fetch(`${API_BASE}/short-url/redirect/${code}`);
        const data = await res.json();
        
        if (data.success && data.data?.original_url) {
          window.location.href = data.data.original_url;
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      }
    };

    fetchAndRedirect();
  }, [code]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 px-4">
        <div className="text-center max-w-md bg-white p-8 rounded-3xl shadow-xl border border-red-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tautan Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">Maaf, tautan pendek yang Anda tuju mungkin salah ketik, sudah dihapus, atau tidak pernah ada.</p>
          <a href="/" className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg">
            Kembali ke Beranda
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 overflow-hidden relative">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
         <div className="w-[30rem] h-[30rem] bg-green-300 rounded-full blur-[100px] mix-blend-multiply translate-x-20 translate-y-10 animate-pulse" style={{ animationDuration: '4s' }}></div>
         <div className="w-[20rem] h-[20rem] bg-yellow-200 rounded-full blur-[80px] mix-blend-multiply -translate-x-20 -translate-y-20 animate-pulse" style={{ animationDuration: '5s' }}></div>
      </div>
      
      <div className="z-10 flex flex-col items-center">
        {/* Animated Logo Container */}
        <div className="relative mb-10 flex justify-center items-center">
          <div className="absolute w-36 h-36 bg-white rounded-full blur-2xl opacity-80 animate-pulse" style={{ animationDuration: '2s' }}></div>
          
          <div className="w-28 h-28 bg-white/90 backdrop-blur-sm rounded-[2rem] shadow-2xl p-5 relative z-10 flex items-center justify-center border border-white/50 rotate-3 hover:rotate-0 transition-transform duration-500">
            <img src={logo} alt="HIMA TI" className="w-full h-full object-contain drop-shadow-md" />
          </div>

          {/* Dual Spinning Rings */}
          <div className="absolute inset-[-12px] border-[3px] border-green-500/80 border-t-transparent border-l-transparent rounded-[2.5rem] animate-spin" style={{ animationDuration: '1.5s' }}></div>
          <div className="absolute inset-[-22px] border-[3px] border-yellow-400/80 border-b-transparent border-r-transparent rounded-[3rem] animate-spin" style={{ animationDuration: '2.5s', animationDirection: 'reverse' }}></div>
        </div>

        {/* Brand Name */}
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-900 tracking-tight mb-4 drop-shadow-sm">
          HIMA TI UNIKU
        </h2>
        
        {/* Loading Indicator */}
        <div className="flex items-center gap-3 text-green-800 font-semibold bg-white/70 backdrop-blur-md px-6 py-3 rounded-2xl shadow-sm border border-white">
          <svg className="w-5 h-5 animate-spin text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="animate-pulse tracking-wide">Mengarahkan ke tujuan...</span>
        </div>
      </div>
    </div>
  );
}

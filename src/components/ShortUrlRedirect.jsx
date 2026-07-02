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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        <img 
          src={logo} 
          alt="HIMA TI" 
          className="w-28 h-28 object-contain animate-pulse" 
          style={{ animationDuration: '2s' }}
        />
        <p className="text-gray-400 font-medium tracking-widest text-sm animate-pulse">
          Mengarahkan...
        </p>
      </div>
    </div>
  );
}

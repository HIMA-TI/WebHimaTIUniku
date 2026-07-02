import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function ShortUrlRedirect() {
  const { code } = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/short-url/redirect/${code}`);
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
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tautan Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-8">Maaf, tautan pendek yang Anda tuju mungkin salah ketik, sudah dihapus, atau tidak pernah ada.</p>
          <a href="/" className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors">
            Kembali ke Beranda
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-green-100 rounded-full"></div>
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="text-sm text-neutral-600 font-medium animate-pulse">Mengarahkan ke tautan tujuan...</p>
      </div>
    </div>
  );
}

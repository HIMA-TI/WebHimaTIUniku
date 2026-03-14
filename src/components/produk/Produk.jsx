import { useEffect } from 'react';
import useProducts from '../../hooks/useProducts';
import Navbar from '../Navbar';
import Footer from '../Footer';

export default function Produk() {
  const { products, loading, refresh } = useProducts();

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <>
      <Navbar />
      <div className="pt-24 pb-20 min-h-screen bg-neutral-50 flex flex-col">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-10 flex-grow">
          
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-5xl font-extrabold text-green-900 mb-4 inline-block relative">
              Katalog Produk
              <div className="absolute -bottom-2 left-1/4 right-1/4 h-1.5 bg-yellow-400 rounded-full"></div>
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto mt-6">
              Dukung HIMA TI dengan membeli produk-produk *merchandise* resmi berkualitas. Kami menyediakan berbagai pilihan menarik untuk Anda!
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <svg className="animate-spin h-10 w-10 text-green-700" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-neutral-100 max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">Belum ada produk</h3>
              <p className="text-neutral-500">Saat ini belum ada produk yang tersedia di katalog. Nantikan *update* selanjutnya!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] transition-all duration-300 group flex flex-col h-full border border-neutral-100">
                  <div className="aspect-square w-full overflow-hidden relative bg-neutral-100">
                    <img 
                      src={item.gambar || 'https://via.placeholder.com/400x400?text=No+Image'} 
                      alt={item.nama} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-green-800 shadow-sm">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.harga || 0)}
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-neutral-800 mb-2 group-hover:text-green-700 transition-colors line-clamp-2">
                      {item.nama}
                    </h3>
                    <p className="text-neutral-600 text-sm mb-6 flex-grow line-clamp-3">
                      {item.deskripsi}
                    </p>
                    
                    <a 
                      href={item.linkOrder || '#'} 
                      target={item.linkOrder ? "_blank" : "_self"}
                      rel="noreferrer"
                      className="mt-auto w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-4 rounded-xl text-center transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                    >
                      <span>Pesan Sekarang</span>
                      <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

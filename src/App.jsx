import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Beranda from './components/beranda/Beranda'
import Tentang from './components/tentang/Tentang'
import Kepengurusan from './components/kepengurusan/Kepengurusan'
import Kontak from './components/kontak/Kontak'
import Produk from './components/produk/Produk'
import Aspirasi from './components/aspirasi/Aspirasi'
import AiraAssistant from './components/AiraAssistant'
import './App.css'

import KKN2026 from './components/kkn2026/KKN2026'
import ShortUrlRedirect from './components/ShortUrlRedirect'

const Portal = lazy(() => import('./components/portal/Portal'))

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-neutral-500 font-medium">Memuat...</p>
      </div>
    </div>
  )
}

function App() {
  const location = useLocation()
  const isPortal = location.pathname.startsWith('/portal')
  const isKKN = location.pathname.startsWith('/kkn-uniku-2026')
  const isStandalone = isPortal || isKKN

  useEffect(() => {
    const titles = {
      '/': 'Beranda | HIMA TI Universitas Kuningan',
      '/tentang': 'Tentang Kami | HIMA TI Universitas Kuningan',
      '/kepengurusan': 'Kepengurusan BPH & Divisi | HIMA TI Universitas Kuningan',
      '/produk': 'Produk & Karya Mahasiswa | HIMA TI Universitas Kuningan',
      '/aspirasi': 'Aspirasi & Masukan Mahasiswa | HIMA TI Universitas Kuningan',
      '/kontak': 'Hubungi Kami | HIMA TI Universitas Kuningan',
      '/portal': 'Portal Pengurus | HIMA TI Universitas Kuningan',
      '/kkn-uniku-2026': 'Inventaris IPTEK HIMA-TI | HIMA TI Universitas Kuningan',
    };

    const title = titles[location.pathname] || 'HIMA TI Universitas Kuningan';
    document.title = title;

    // Dynamic Meta Description for SEO
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }

    const descriptions = {
      '/': 'Website Resmi Himpunan Mahasiswa Teknik Informatika (HIMA TI) Universitas Kuningan. Kabinet Perkasa - Bersama Membangun, Berdampak Nyata.',
      '/tentang': 'Pelajari visi, misi, nilai budaya, dan filosofi lambang HIMA TI Universitas Kuningan.',
      '/kepengurusan': 'Kenali jajaran Badan Pengurus Harian (BPH) dan Divisi-Divisi kerja HIMA TI Universitas Kuningan Kabinet Perkasa.',
      '/produk': 'Karya, inovasi, produk, dan kreativitas mahasiswa Teknik Informatika Universitas Kuningan.',
      '/aspirasi': 'Sampaikan aspirasi, kritik, saran, keluhan, dan masukan Anda untuk kemajuan Teknik Informatika Universitas Kuningan.',
      '/kontak': 'Hubungi kami melalui email resmi, media sosial, WhatsApp, atau langsung kunjungi sekretariat kami di Kampus 2 UNIKU.',
      '/portal': 'Halaman administrasi khusus untuk pengurus HIMA TI Universitas Kuningan.',
      '/kkn-uniku-2026': 'Inventaris IPTEK HIMA-TI — perpustakaan inventaris aplikasi, website, dan AR open-source hasil karya Divisi IPTEK HIMA TI dan kontribusi mahasiswa.',
    };

    metaDescription.setAttribute('content', descriptions[location.pathname] || 'Website Resmi Himpunan Mahasiswa Teknik Informatika (HIMA TI) Universitas Kuningan.');
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <ScrollToTop />
      {!isStandalone && <Navbar />}

      <main>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Beranda />} />
            <Route path="/tentang" element={<Tentang />} />
            <Route path="/kepengurusan" element={<Kepengurusan />} />
            <Route path="/produk" element={<Produk />} />
            <Route path="/kontak" element={<Kontak />} />
            <Route path="/aspirasi" element={<Aspirasi />} />
            <Route path="/portal" element={<Portal />} />
            <Route path="/kkn-uniku-2026" element={<KKN2026 />} />
            <Route path="/s/:code" element={<ShortUrlRedirect />} />
            <Route path="/:code" element={<ShortUrlRedirect />} />
          </Routes>
        </Suspense>
      </main>

      <Analytics />

      {!isStandalone && <AiraAssistant />}
      {!isStandalone && <Footer />}
    </div>
  )
}

export default App

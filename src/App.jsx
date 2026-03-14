import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Beranda from './components/beranda/Beranda'
import Tentang from './components/tentang/Tentang'
import Kepengurusan from './components/kepengurusan/Kepengurusan'
import Kontak from './components/kontak/Kontak'
import Portal from './components/portal/Portal'
import Produk from './components/produk/Produk'
import Aspirasi from './components/aspirasi/Aspirasi'
import './App.css'

function App() {
  const location = useLocation()
  const isPortal = location.pathname.startsWith('/portal')

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <ScrollToTop />
      {!isPortal && <Navbar />}

      <main>
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/tentang" element={<Tentang />} />
          <Route path="/kepengurusan" element={<Kepengurusan />} />
          <Route path="/produk" element={<Produk />} />
          <Route path="/kontak" element={<Kontak />} />
          <Route path="/aspirasi" element={<Aspirasi />} />
          <Route path="/portal" element={<Portal />} />
        </Routes>
      </main>

      {!isPortal && <Footer />}
    </div>
  )
}

export default App

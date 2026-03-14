import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo1.png';

const navItems = [
  { to: '/', label: 'Beranda' },
  { to: '/tentang', label: 'Tentang' },
  { to: '/kepengurusan', label: 'Kepengurusan' },
  { to: '/produk', label: 'Produk' },
  { to: '/kontak', label: 'Kontak' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMobileMenu = () => setIsOpen(false);

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-sm ${
      isActive
        ? 'bg-white/50 text-green-900 shadow-sm'
        : 'hover:bg-white/40 text-green-900'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-xl text-base font-semibold transition-colors ${
      isActive
        ? 'bg-white/60 text-green-900'
        : 'text-green-900 hover:bg-white/60'
    }`;

  return (
    <div className="w-full fixed top-0 sm:top-4 z-50 flex justify-center px-4 sm:px-6 lg:px-8">
      <nav className="w-full max-w-7xl bg-white/30 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] rounded-2xl text-green-900 transition-all duration-300">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo / Brand */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-3 cursor-pointer group hover:opacity-90 transition-opacity">
                <img
                  src={logo}
                  alt="Logo Hima TI"
                  style={{ width: '75px', height: '63px' }}
                />
                <span className="font-bold text-xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-green-900 to-green-600 drop-shadow-sm hidden sm:block">
                  HIMA TI
                </span>
              </Link>
            </div>

            {/* Menu Desktop */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.to === '/'} className={navLinkClass}>
                  {item.label}
                </NavLink>
              ))}
              <Link to="/portal" className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-green-900 font-bold px-4 lg:px-5 py-2.5 rounded-xl text-sm ml-2 lg:ml-4 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5">
                Portal Pengurus
              </Link>
            </div>

            {/* Tombol Hamburger untuk Mobile */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-green-900 hover:bg-white/40 focus:outline-none transition-all duration-300"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Menu Mobile */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 pt-2 pb-4 space-y-1 mx-2 mb-2 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 shadow-inner">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={mobileNavLinkClass} onClick={closeMobileMenu}>
                {item.label}
              </NavLink>
            ))}
            <Link to="/portal" onClick={closeMobileMenu} className="block w-full text-center mt-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-900 font-bold px-4 py-3 rounded-xl text-base shadow-md hover:shadow-lg transition-all">
              Portal Pengurus
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

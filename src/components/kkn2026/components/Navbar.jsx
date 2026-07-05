import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { supabase } from '../../../config/supabase';

export default function Navbar({ currentTab, setCurrentTab, session }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTab = (tab) => {
    setCurrentTab(tab);
    setIsMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToFAQ = () => {
    setIsMobileOpen(false);
    setCurrentTab('beranda');
    setTimeout(() => {
      const element = document.getElementById('kkn-faq');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${isScrolled
      ? 'bg-white/85 backdrop-blur-md border-b border-gray-100/80 py-3 shadow-sm'
      : 'bg-transparent border-b border-transparent py-5 shadow-none'
      }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <button
          onClick={() => handleTab('beranda')}
          className="flex items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer bg-transparent border-0"
        >
          <img src="/logo.png" alt="HIMA TI Logo" className="w-9 h-9 object-contain" />
          <span className="font-display text-xl tracking-wide text-gray-900">HIMA TI</span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 bg-white px-8 py-3 rounded-full shadow-sm border border-gray-100">
          <button
            onClick={() => handleTab('beranda')}
            className={`font-semibold cursor-pointer transition-colors text-sm bg-transparent border-none ${currentTab === 'beranda' ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-600'
              }`}
          >
            Beranda
          </button>
          <button
            onClick={() => handleTab('aset-digital')}
            className={`font-semibold cursor-pointer transition-colors text-sm bg-transparent border-none ${currentTab === 'aset-digital' ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-600'
              }`}
          >
            Aset Digital
          </button>
          <button
            onClick={scrollToFAQ}
            className="font-semibold cursor-pointer text-gray-500 hover:text-emerald-600 transition-colors text-sm bg-transparent border-none"
          >
            FAQ
          </button>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3">
              {session.user?.user_metadata?.avatar_url ? (
                <img
                  src={session.user.user_metadata.avatar_url}
                  alt={session.user.user_metadata.full_name || 'User'}
                  className="w-9 h-9 rounded-full border border-emerald-500 shadow-xs"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-800 text-sm">
                  {(session.user?.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="hidden lg:block text-left">
                <p className="text-[10px] font-bold text-gray-400 leading-none">Mahasiswa</p>
                <p className="text-xs font-bold text-gray-700 leading-tight mt-1">{session.user?.user_metadata?.full_name || session.user?.email}</p>
              </div>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                }}
                className="text-xs font-bold text-red-500 hover:text-red-700 underline ml-2 cursor-pointer bg-transparent border-0"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <a className="font-semibold text-wk-text-dark hover:text-wk-purple-primary transition-colors hidden sm:block text-sm" href="https://hima-ti.uniku.ac.id" target="_blank" rel="noopener noreferrer">Official Web</a>
              <a className="items-center gap-2 border-2 border-wk-purple-primary text-wk-purple-primary font-bold py-2 px-6 rounded-full hover:bg-wk-purple-primary hover:text-white transition-all group text-sm hidden md:inline-flex" href="https://github.com/HIMA-TI" target="_blank" rel="noopener noreferrer">
                HIMA TI GitHub
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                </svg>
              </a>
            </>
          )}
          {/* Hamburger */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-emerald-600 transition-colors cursor-pointer bg-transparent border-0"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm px-6 py-4 flex flex-col gap-3">
          <button
            onClick={() => handleTab('beranda')}
            className={`w-full text-left py-3 px-4 rounded-2xl font-bold text-sm transition-colors cursor-pointer bg-transparent border-0 ${currentTab === 'beranda' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            Beranda
          </button>
          <button
            onClick={() => handleTab('aset-digital')}
            className={`w-full text-left py-3 px-4 rounded-2xl font-bold text-sm transition-colors cursor-pointer bg-transparent border-0 ${currentTab === 'aset-digital' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            Aset Digital
          </button>
          <button
            onClick={scrollToFAQ}
            className="w-full text-left py-3 px-4 rounded-2xl font-bold text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer bg-transparent border-0"
          >
            FAQ
          </button>
          <hr className="border-gray-100 my-1" />
          {session ? (
            <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-2xl">
              {session.user?.user_metadata?.avatar_url ? (
                <img
                  src={session.user.user_metadata.avatar_url}
                  alt={session.user.user_metadata.full_name || 'User'}
                  className="w-9 h-9 rounded-full border border-emerald-500 shadow-xs"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-800 text-sm">
                  {(session.user?.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-left flex-1 min-w-0">
                <p className="text-[10px] font-bold text-gray-400 leading-none">Mahasiswa</p>
                <p className="text-xs font-bold text-gray-700 leading-tight mt-1 truncate">{session.user?.user_metadata?.full_name || session.user?.email}</p>
              </div>
              <button
                onClick={async () => {
                  setIsMobileOpen(false);
                  await supabase.auth.signOut();
                }}
                className="text-xs font-bold text-red-500 hover:text-red-700 underline cursor-pointer bg-transparent border-0"
              >
                Logout
              </button>
            </div>
          ) : (
            <a
              href="https://github.com/HIMA-TI"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 py-3 px-4 rounded-2xl font-bold text-sm text-wk-purple-primary hover:bg-purple-50 transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
              </svg>
              HIMA TI GitHub
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}

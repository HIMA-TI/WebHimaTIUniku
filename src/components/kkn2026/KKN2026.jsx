import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { gsap } from 'gsap';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './KKN2026.css';

import Navbar from './components/Navbar';
import AssetDetail from './components/AssetDetail';
import HeroSection from './components/HeroSection';
import HorizontalFeatures from './components/HorizontalFeatures';
import WorkflowSection from './components/WorkflowSection';
import FAQSection from './components/FAQSection';
import AssetShowcase from './components/AssetShowcase';
import KKNFooter from './components/KKNFooter';
import useDigitalAssets from '../../hooks/useDigitalAssets';
import { supabase } from '../../config/supabase';

gsap.registerPlugin(ScrollTrigger);

export default function KKN2026() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'beranda';
  const [selectedAsset, setSelectedAsset] = useState(null);
  const { digitalAssets, loading, likeAsset } = useDigitalAssets();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session: activeSession } } = await supabase.auth.getSession();
      if (activeSession) {
        if (activeSession.user.email.endsWith('@uniku.ac.id')) {
          setSession(activeSession);
        } else {
          await supabase.auth.signOut();
          alert('Akses ditolak! Hanya email uniku.ac.id yang diperbolehkan.');
        }
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, activeSession) => {
      if (activeSession) {
        if (activeSession.user.email.endsWith('@uniku.ac.id')) {
          setSession(activeSession);
        } else {
          await supabase.auth.signOut();
          alert('Akses ditolak! Hanya email uniku.ac.id yang diperbolehkan.');
        }
      } else {
        setSession(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const setCurrentTab = (tab) => {
    setSearchParams({ tab });
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  useEffect(() => {
    const preconnectGstatic = document.createElement('link');
    preconnectGstatic.rel = 'preconnect';
    preconnectGstatic.href = 'https://fonts.gstatic.com';
    preconnectGstatic.crossOrigin = 'anonymous';
    document.head.appendChild(preconnectGstatic);

    const preconnectGfonts = document.createElement('link');
    preconnectGfonts.rel = 'preconnect';
    preconnectGfonts.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnectGfonts);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap';
    document.head.appendChild(link);
    document.title = 'Inventaris IPTEK HIMA-TI | HIMA TI Universitas Kuningan';

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

    const elements = document.querySelectorAll('.home-animate__text-group');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      document.head.removeChild(link);
      document.head.removeChild(preconnectGfonts);
      document.head.removeChild(preconnectGstatic);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedAsset]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    const gsapTicker = (time) => { lenis.raf(time * 1000); };
    gsap.ticker.add(gsapTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(gsapTicker);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (document.querySelector('.kkn2026-page header h1')) {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo('.kkn2026-page header h1', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
          .fromTo('.kkn2026-page header p', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.6')
          .fromTo('.kkn2026-page header button', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6 }, '-=0.4');
      }

      if (document.querySelector('#kkn-showcase')) {
        gsap.fromTo('#kkn-showcase .grid > div',
          { scale: 0.9, opacity: 0, y: 40 },
          { scale: 1, opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'power2.out',
            scrollTrigger: { trigger: '#kkn-showcase', start: 'top 75%' } }
        );
      }
    });

    return () => ctx.revert();
  }, [selectedAsset, currentTab]);

  if (selectedAsset) {
    // Find the latest version of the selected asset from state to ensure likes/requestCount are up to date
    const currentAsset = digitalAssets.find(a => a.id === selectedAsset.id) || selectedAsset;
    
    return (
      <AssetDetail
        selectedAsset={currentAsset}
        setSelectedAsset={setSelectedAsset}
        likeAsset={likeAsset}
        session={session}
      />
    );
  }

  return (
    <div className="kkn2026-page bg-gray-50 text-wk-text-dark font-sans antialiased selection:bg-emerald-100 selection:text-emerald-700 min-h-screen relative">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} session={session} />

      {currentTab === 'beranda' && (
        <>
          <HeroSection setCurrentTab={setCurrentTab} />
          <HorizontalFeatures setCurrentTab={setCurrentTab} />
          <WorkflowSection />
          <FAQSection />
        </>
      )}
      {currentTab === 'aset-digital' && (
        <AssetShowcase onSelectAsset={setSelectedAsset} digitalAssets={digitalAssets} loading={loading} />
      )}

      <KKNFooter />
    </div>
  );
}

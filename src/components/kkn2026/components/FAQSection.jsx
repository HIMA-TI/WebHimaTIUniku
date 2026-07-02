import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HelpCircle, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  { 
    q: 'Apa itu Inventaris IPTEK HIMA-TI?', 
    a: 'Inventaris IPTEK HIMA-TI adalah direktori koleksi aplikasi, website desa, dan inovasi AR (Augmented Reality) open-source buatan Divisi IPTEK HIMA TI Universitas Kuningan dan kontributor mahasiswa Teknik Informatika. Semuanya bisa kamu pakai gratis, cukup ajukan izin aja!' 
  },
  { 
    q: 'Semua aset di sini murni buatan Divisi IPTEK?', 
    a: 'Nggak kok, platform ini adalah ruang kolaborasi. Isinya perpaduan antara karya teman-teman Divisi IPTEK dan kontribusi dari mahasiswa Teknik Informatika lainnya. Jadi, kalau kamu punya project keren yang nganggur, yuk mending dipamerin di sini!' 
  },
  { 
    q: 'Ada biaya untuk pakai asetnya?', 
    a: '100% Gratis! Semua aset digital di sini bebas kamu pakai tanpa ditarik biaya sepeser pun. Cukup isi form izin guna yang udah disediain, dan aset siap kamu eksekusi.' 
  },
  { 
    q: 'Bisa request buatin aplikasi baru dari nol?', 
    a: 'Mohon maaf banget, saat ini belum bisa. Platform ini murni beroperasi sebagai inventaris. Tapi jangan khawatir, kamu bebas pilih aset yang paling mendekati kebutuhanmu dari katalog yang udah ada.' 
  },
  { 
    q: 'Gimana alur pemakaian asetnya?', 
    a: 'Gampang banget! Tinggal klik aset yang ditaksir, baca deskripsi singkatnya, lalu klik tombol "Ajukan" buat dapat aksesnya. Tenang aja, panduan pemakaian (dokumentasi) udah kita siapin di setiap halaman detail aset.' 
  },
  { 
    q: 'Boleh ikut nyumbang karya buat dipajang di sini?', 
    a: 'Boleh banget dong, khususnya buat warga Teknik Informatika! Kirim aja project digital andalan kamu (web, game, AR, atau tools lain) ke tim Divisi IPTEK HIMA TI. Setelah lewat proses review singkat, karya kamu bakal otomatis nampang di katalog ini.' 
  },
];

function AccordionItem({ faq, isOpen, onToggle }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-4 p-6 text-left cursor-pointer bg-transparent border-0 hover:bg-gray-50/50 transition-colors"
      >
        <div className="w-10 h-10 shrink-0 bg-emerald-50 rounded-xl flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-bold text-wk-text-dark leading-snug pr-2">{faq.q}</h4>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 shrink-0 mt-2 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className="transition-all duration-300 ease-in-out"
        style={{ maxHeight: height + 'px', overflow: 'hidden' }}
      >
        <div ref={contentRef} className="px-6 pb-6 pl-16">
          <p className="text-gray-500 font-semibold text-sm leading-relaxed">{faq.a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('#kkn-faq .faq-wrapper > *',
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.12, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: '#kkn-faq', start: 'top 85%' } }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="kkn-faq" className="w-full bg-gray-50 py-24 border-t border-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-16 text-center text-wk-text-dark">
          Sering <span className="text-emerald-600 font-display italic">Ditanyain</span>
        </h2>
        <div className="faq-wrapper flex flex-col gap-4 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              faq={faq}
              isOpen={openIndex === idx}
              onToggle={() => toggleFAQ(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

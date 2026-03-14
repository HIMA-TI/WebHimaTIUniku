import { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';

const kontakItems = [
  {
    label: 'Alamat',
    value: 'Kampus 2 UNIKU, Jl. Pramuka No. 67, Purwawinangun, Kec. Kuningan, Kabupaten Kuningan, Jawa Barat 45512',
    ikon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    value: 'hima.ti@uniku.ac.id',
    href: 'mailto:hima.ti@uniku.ac.id',
    ikon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const socialLinks = [
  {
    nama: 'Instagram',
    url: 'https://www.instagram.com/hima.ti.uniku',
    ikon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    nama: 'YouTube',
    url: 'https://youtube.com/@himatifkomuniku1470?si=9o2JV8xtpokfMe1n',
    ikon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    nama: 'WhatsApp Community',
    url: 'https://whatsapp.com/channel/0029Vb3xkSr8KMqk8Pl6pz0B',
    ikon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
];

export default function KontakInfo() {
  const headingRef = useRef(null);
  const contentRef = useRef(null);
  const [formData, setFormData] = useState({ nama: '', email: '', pesan: '' });

  useEffect(() => {
    const headingObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(headingRef.current, {
              opacity: [0, 1],
              translateY: [40, 0],
              duration: 1000,
              ease: 'outExpo',
            });
            headingObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (headingRef.current) {
      headingRef.current.style.opacity = '0';
      headingObs.observe(headingRef.current);
    }

    const contentObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(contentRef.current, {
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
              ease: 'outExpo',
            });
            contentObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (contentRef.current) {
      contentRef.current.style.opacity = '0';
      contentObs.observe(contentRef.current);
    }

    return () => {
      headingObs.disconnect();
      contentObs.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nama, email, pesan } = formData;
    const subject = encodeURIComponent(`Pesan dari ${nama}`);
    const body = encodeURIComponent(`Nama: ${nama}\nEmail: ${email}\n\nPesan:\n${pesan}`);
    window.location.href = `mailto:hima.ti@uniku.ac.id?subject=${subject}&body=${body}`;
    
    // Clear form after attempting to send
    setFormData({ nama: '', email: '', pesan: '' });
  };

  return (
    <section className="py-20 lg:py-28">
      {/* Section Header */}
      <div ref={headingRef} className="text-center mb-16 lg:mb-24">
        <p className="text-sm font-semibold tracking-[0.3em] uppercase text-green-600 mb-4">
          Hubungi Kami
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-green-900">
          Kontak
        </h2>
        <div className="mt-4 mx-auto w-20 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full" />
      </div>

      {/* Two-column layout */}
      <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: Contact Info + Social */}
        <div className="relative overflow-hidden bg-white/30 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] rounded-2xl p-8 sm:p-10">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-600 to-yellow-400" />
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-green-200/15 rounded-full blur-2xl pointer-events-none" />

          <h3 className="text-xl font-bold text-green-900 mb-6">Informasi Kontak</h3>

          <div className="space-y-6">
            {kontakItems.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center shadow-lg flex-shrink-0">
                  {item.ikon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-900">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-green-800/70 hover:text-green-600 text-sm mt-0.5 transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-green-800/70 text-sm mt-0.5">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Social Media */}
          <div className="mt-10 pt-6 border-t border-green-200/30">
            <p className="text-sm font-semibold text-green-900 mb-4">Ikuti Kami</p>
            <div className="flex gap-3">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.nama}
                  className="w-10 h-10 rounded-xl bg-white/50 border border-white/60 flex items-center justify-center text-green-700 hover:bg-green-600 hover:text-white hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {social.ikon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Contact Form */}
        <div className="relative overflow-hidden bg-white/30 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] rounded-2xl p-8 sm:p-10">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-400 to-green-600" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-yellow-200/10 rounded-full blur-2xl pointer-events-none" />

          <h3 className="text-xl font-bold text-green-900 mb-6">Kirim Pesan</h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-green-900 mb-2">Nama</label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl text-green-900 placeholder-green-400/50 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 transition-all"
                placeholder="Nama lengkap"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-green-900 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl text-green-900 placeholder-green-400/50 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 transition-all"
                placeholder="email@contoh.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-green-900 mb-2">Pesan</label>
              <textarea
                rows={5}
                value={formData.pesan}
                onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl text-green-900 placeholder-green-400/50 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 transition-all resize-none"
                placeholder="Tulis pesan Anda..."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-green-900 font-bold px-6 py-3.5 rounded-xl text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Kirim Pesan
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

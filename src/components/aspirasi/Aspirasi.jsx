import { useEffect, useMemo, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import useAspirasi from '../../hooks/useAspirasi';
import aspirasiBG from '../../assets/aspirasiBG.webp';
import ImageUpload from '../portal/ImageUpload';

const KATEGORI_ASPIRASI = [
  'Akademik (Dosen, materi, jadwal kuliah)',
  'Fasilitas kampus',
  'Administrasi akademik',
  'Kegiatan mahasiswa/organisasi',
  'Pelayanan kampus',
  'Yang lain',
];

const PUBLIC_CARD_LIMIT = 6;

function maskName(rawName) {
  const value = String(rawName || 'Anonim').trim();
  if (!value) return 'Anonim';
  if (value.length === 1) return '*';
  if (value.length === 2) return `${value[0]}*`;
  return `${value[0]}${'*'.repeat(value.length - 2)}${value[value.length - 1]}`;
}

function truncateText(value, maxLength) {
  const text = String(value || '').trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

function formatAspirasiDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function AspirasiCard({ children, className = '' }) {
  return (
    <div
      className={`overflow-hidden rounded-3xl border border-white/40 bg-white/75 backdrop-blur-xl shadow-xl ${className}`}
    >
      <div className="p-6 sm:p-10">{children}</div>
    </div>
  );
}

export default function Aspirasi() {
  const { aspirasi, loading, addAspirasi } = useAspirasi({ allowPublicRead: true });

  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);
  const successAlertRef = useRef(null);
  const recaptchaRef = useRef(null);

  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState('');
  const [topik, setTopik] = useState('');
  const [judul, setJudul] = useState('');
  const [pesan, setPesan] = useState('');
  const [lampiran, setLampiran] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);

  const [errorObj, setErrorObj] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAspirasi, setSelectedAspirasi] = useState(null);

  const aspirasiPublik = useMemo(() => {
    const filled = aspirasi
      .filter((item) => String(item?.description || item?.pesan || '').trim().length > 0)
      .slice(0, PUBLIC_CARD_LIMIT);

    const placeholders = Array.from({ length: Math.max(0, PUBLIC_CARD_LIMIT - filled.length) }, (_, index) => ({
      id: `placeholder-${index}`,
      placeholder: true,
    }));

    return [...filled, ...placeholders];
  }, [aspirasi]);

  useEffect(() => {
    if (!showForm) return;
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [showForm]);

  useEffect(() => {
    if (!successMsg || !successAlertRef.current) return;

    const animation = successAlertRef.current.animate(
      [
        { opacity: 0, transform: 'translateY(10px) scale(0.96)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' },
      ],
      {
        duration: 420,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }
    );

    return () => animation.cancel();
  }, [successMsg]);

  const openForm = () => {
    if (showForm) {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorObj(null);
    setSuccessMsg('');

    if (!kategori || !topik.trim() || !judul.trim() || !pesan.trim()) {
      setErrorObj({ type: 'form', message: 'Harap lengkapi semua field yang wajib diisi.' });
      return;
    }

    if (!captchaToken) {
      setErrorObj({ type: 'form', message: 'Harap verifikasi CAPTCHA terlebih dahulu.' });
      return;
    }

    setIsSubmitting(true);

    try {
      await addAspirasi({
        nama: nama.trim() || null,
        kategori,
        topik: topik.trim(),
        judul: judul.trim(),
        pesan: pesan.trim(),
        lampiran,
      });
      setSuccessMsg('Aspirasi Anda berhasil dikirim! Terima kasih atas partisipasi Anda.');
      setNama('');
      setKategori('');
      setTopik('');
      setJudul('');
      setPesan('');
      setLampiran('');
      setCaptchaToken(null);      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }    } catch {
      setErrorObj({ type: 'server', message: 'Terjadi kesalahan saat mengirim aspirasi.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative pt-24 pb-16 min-h-screen overflow-hidden bg-neutral-950">
      <img
        src={aspirasiBG}
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/60"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="text-center mb-10 text-white drop-shadow-lg">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Aspirasi</h1>
          <p className="text-lg opacity-80 max-w-xl mx-auto">
            Wadah resmi untuk menyampaikan saran, keluhan, dan masukan. Biar kami bisa evaluasi dan tindak lanjuti dengan lebih terarah.
          </p>
        </div>

        {/* INFO + CTA */}
        <AspirasiCard>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-green-900">Apa itu Aspirasi?</h2>
              <p className="mt-2 text-sm sm:text-base text-neutral-700 leading-relaxed">
                Aspirasi adalah tempat kamu menyuarakan hal-hal yang perlu diperbaiki atau ditingkatkan. Bisa berupa kritik, saran,
                atau laporan kendala yang kamu alami di lingkungan kampus/organisasi.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-green-100 bg-green-50/50 p-4">
                <h3 className="font-bold text-green-900">Untuk apa?</h3>
                <ul className="mt-2 space-y-2 text-sm text-neutral-700 list-disc pl-5">
                  <li>Jadi bahan evaluasi dan perbaikan layanan.</li>
                  <li>Biar masalah kamu cepat masuk ke pihak yang tepat.</li>
                  <li>Kalau perlu, kamu bisa lampirin bukti (foto/screenshot).</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-yellow-100 bg-yellow-50/50 p-4">
                <h3 className="font-bold text-green-900">Kategori yang tersedia</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {KATEGORI_ASPIRASI.map((k) => (
                    <span
                      key={k}
                      className="text-xs font-semibold px-3 py-1 rounded-full bg-white/80 border border-neutral-200 text-neutral-700"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-sm text-neutral-700">
                <span className="font-bold text-green-900">Catatan:</span> Gunakan bahasa yang sopan dan jelas. Hindari membagikan data sensitif.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={openForm}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-extrabold px-7 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                Suarakan Aspirasi mu
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </AspirasiCard>

        {/* FORM */}
        {showForm && (
          <div ref={formRef} className="mt-8">
            <AspirasiCard>
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-extrabold text-green-900">Form Aspirasi</h2>
                <p className="text-sm text-neutral-600 mt-1">Isi singkat, jelas, dan pilih kategori yang paling sesuai.</p>
              </div>

              {successMsg && (
                <div
                  ref={successAlertRef}
                  className="mb-6 p-4 bg-green-50 text-green-800 rounded-xl border border-green-200 flex items-center gap-3 shadow-[0_12px_30px_-18px_rgba(22,163,74,0.7)]"
                >
                  <div className="relative shrink-0">
                    <span className="absolute inset-0 rounded-full bg-green-300/60 animate-ping" aria-hidden="true" />
                    <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white shadow-sm">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.4}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                  </div>
                  <span className="font-semibold">{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* NAMA (Opsional) */}
                  <div>
                    <label htmlFor="nama" className="block text-sm font-semibold text-green-900 mb-2">
                      Nama (Opsional)
                    </label>
                    <input
                      type="text"
                      id="nama"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Masukkan nama Anda"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all placeholder:text-neutral-400"
                    />
                  </div>

                  {/* KATEGORI */}
                  <div>
                    <label htmlFor="kategori" className="block text-sm font-semibold text-green-900 mb-2">
                      Kategori Aspirasi (Wajib)
                    </label>
                    <select
                      id="kategori"
                      value={kategori}
                      onChange={(e) => setKategori(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                    >
                      <option value="" disabled>
                        Pilih Kategori Aspirasi
                      </option>
                      {KATEGORI_ASPIRASI.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-neutral-500">Pilih kategori yang paling sesuai biar cepat ditindaklanjuti.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* TOPIK */}
                  <div>
                    <label htmlFor="topik" className="block text-sm font-semibold text-green-900 mb-2">
                      Topik (Wajib)
                    </label>
                    <input
                      type="text"
                      id="topik"
                      value={topik}
                      onChange={(e) => setTopik(e.target.value)}
                      required
                      placeholder="Contoh: Jadwal kuliah, Dosen, Fasilitas lab"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all placeholder:text-neutral-400"
                    />
                  </div>

                  {/* JUDUL */}
                  <div>
                    <label htmlFor="judul" className="block text-sm font-semibold text-green-900 mb-2">
                      Judul (Wajib)
                    </label>
                    <input
                      type="text"
                      id="judul"
                      value={judul}
                      onChange={(e) => setJudul(e.target.value)}
                      required
                      placeholder="Singkat & jelas"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all placeholder:text-neutral-400"
                    />
                  </div>
                </div>

                {/* PESAN */}
                <div>
                  <label htmlFor="pesan" className="block text-sm font-semibold text-green-900 mb-2">
                    Saran / Keluhan / Masukan (Wajib)
                  </label>
                  <textarea
                    id="pesan"
                    value={pesan}
                    onChange={(e) => setPesan(e.target.value)}
                    required
                    rows="6"
                    placeholder="Sampaikan detail aspirasi Anda di sini..."
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none placeholder:text-neutral-400"
                  ></textarea>
                </div>

                {/* LAMPIRAN GAMBAR */}
                <div>
                  <label className="block text-sm font-semibold text-green-900 mb-2">Lampiran Gambar (Opsional)</label>
                  <ImageUpload value={lampiran} onChange={setLampiran} />
                  <p className="mt-1 text-xs text-neutral-500">Opsional. Lampirkan screenshot/foto pendukung (maks 2MB).</p>
                </div>

                {/* RECAPTCHA */}
                <div className="flex justify-center my-4">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey="6LdnxcUsAAAAAIBCNW5My472YKimxZxj_3zjAVan"
                    onChange={(token) => setCaptchaToken(token)}
                  />
                </div>

                {/* FORM ERROR */}
                {errorObj?.type === 'form' && (
                  <p className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-xl">{errorObj.message}</p>
                )}

                {/* SERVER ERROR */}
                {errorObj?.type === 'server' && (
                  <p className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-xl">{errorObj.message}</p>
                )}

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? 'bg-neutral-400 cursor-not-allowed'
                      : 'bg-green-700 hover:bg-green-800 hover:-translate-y-1 hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <span>Kirim Aspirasi</span>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </AspirasiCard>
          </div>
        )}
      </div>

      <div className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-lg">Aspirasi Terkini</h2>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {aspirasiPublik.map((item, index) => {
            const cloudStyle = {
              '--cloud-delay': `${index * 0.24}s`,
              '--cloud-duration': `${6.2 + (index % 3) * 0.85}s`,
            };

            if (item.placeholder) {
              return (
                <div
                  key={item.id}
                  style={cloudStyle}
                  className="aspirasi-cloud aspirasi-cloud--placeholder p-4 sm:p-5 min-h-[175px] flex items-center justify-center"
                >
                  <p className="text-sm text-neutral-600 text-center">Menunggu aspirasi terbaru...</p>
                </div>
              );
            }

            return (
              <article
                key={item.id}
                style={cloudStyle}
                onClick={() => setSelectedAspirasi(item)}
                className="aspirasi-cloud p-4 sm:p-5 min-h-[175px] flex flex-col cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-xl active:scale-95"
              >
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="text-xs font-bold text-green-700 bg-green-100/50 px-2 py-1 rounded-md line-clamp-1 max-w-[75%]">
                    {item.category || item.kategori || '-'}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-neutral-800 leading-relaxed flex-1 mt-1">
                  {truncateText(item.description || item.pesan, 145)}
                </p>

                <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between gap-3 text-xs text-neutral-600">
                  <span className="font-semibold text-neutral-700">✍ {maskName(item.name || item.nama || 'Anonim')}</span>
                  <span>{formatAspirasiDate(item.created_at || item.createdAt)}</span>
                </div>
              </article>
            );
          })}
        </div>

        {loading && aspirasi.length === 0 && (
          <p className="mt-4 text-xs text-white/80">Memuat aspirasi publik...</p>
        )}
      </div>

      {selectedAspirasi && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 sm:px-12 backdrop-blur-sm bg-black/60 transition-all duration-300">
          <style>{`
            @keyframes modalZoomCenter {
              0% { opacity: 0; transform: scale(0.9) translateY(15px); }
              100% { opacity: 1; transform: scale(1) translateY(0); }
            }
            .animate-modalZoom {
              animation: modalZoomCenter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>
          
          <div 
            className="absolute inset-0 cursor-pointer" 
            onClick={() => setSelectedAspirasi(null)} 
          />

          <div className="relative animate-modalZoom bg-white w-full max-w-2xl rounded-[2rem] shadow-[0_15px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[85vh]">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-yellow-400 to-green-600"></div>
            
            <div className="p-6 sm:p-8 flex-1 overflow-y-auto overflow-x-hidden">
              <div className="flex justify-between items-start gap-4 mb-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-green-900 leading-tight">
                    {selectedAspirasi.topic || selectedAspirasi.judul || 'Aspirasi'}
                  </h3>
                  <span className="inline-block mt-3 px-3 py-1.5 bg-green-100/80 text-green-800 text-xs font-bold rounded-xl border border-green-200">
                    {selectedAspirasi.category || selectedAspirasi.kategori || '-'}
                  </span>
                </div>
                
                <button 
                  onClick={() => setSelectedAspirasi(null)}
                  className="p-2 sm:p-2.5 -mr-2 bg-neutral-100 hover:bg-neutral-200 hover:text-red-500 text-neutral-500 rounded-2xl transition-all duration-300 hover:rotate-90"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="prose prose-sm sm:prose-base max-w-none text-neutral-700 whitespace-pre-wrap leading-relaxed">
                {selectedAspirasi.description || selectedAspirasi.pesan || '-'}
              </div>
              
              {selectedAspirasi.file_url && (
                <div className="mt-8 rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-50 p-2 shadow-inner">
                  <p className="text-xs font-bold text-neutral-400 mb-3 ml-2 uppercase tracking-wider">Lampiran Pendukung</p>
                  <img 
                    src={selectedAspirasi.file_url} 
                    alt="Lampiran" 
                    className="w-full h-auto rounded-xl object-contain max-h-[40vh]" 
                    loading="lazy" 
                  />
                </div>
              )}
            </div>
            
            <div className="bg-neutral-50 p-5 sm:p-6 border-t border-neutral-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold shadow-md text-sm sm:text-base">
                  {maskName(selectedAspirasi.name || selectedAspirasi.nama || 'Anonim')[0]}
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-medium">Pengirim</p>
                  <span className="font-semibold text-neutral-800 text-sm sm:text-base truncate max-w-[120px] sm:max-w-[200px] block">
                    {maskName(selectedAspirasi.name || selectedAspirasi.nama || 'Anonim')}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xs text-neutral-400 font-medium mb-0.5">Tanggal</p>
                <span className="text-neutral-600 font-semibold text-xs sm:text-sm bg-white px-3 py-1.5 rounded-lg border border-neutral-200 shadow-sm inline-block">
                  {formatAspirasiDate(selectedAspirasi.created_at || selectedAspirasi.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

import { useEffect, useRef, useState } from 'react';
import useAspirasi from '../../hooks/useAspirasi';
import ImageUpload from '../portal/ImageUpload';

const KATEGORI_ASPIRASI = [
  'Akademik (Dosen, materi, jadwal kuliah)',
  'Fasilitas kampus',
  'Administrasi akademik',
  'Kegiatan mahasiswa/organisasi',
  'Pelayanan kampus',
  'Yang lain',
];

export default function Aspirasi() {
  const { addAspirasi } = useAspirasi();

  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);

  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState('');
  const [topik, setTopik] = useState('');
  const [judul, setJudul] = useState('');
  const [pesan, setPesan] = useState('');
  const [lampiran, setLampiran] = useState('');

  const [errorObj, setErrorObj] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!showForm) return;
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [showForm]);

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

    if (!nama.trim() || !kategori || !topik.trim() || !judul.trim() || !pesan.trim()) {
      setErrorObj({ type: 'form', message: 'Harap lengkapi semua field yang wajib diisi.' });
      return;
    }

    setIsSubmitting(true);

    try {
      await addAspirasi({
        nama: nama.trim(),
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
    } catch {
      setErrorObj({ type: 'server', message: 'Terjadi kesalahan saat mengirim aspirasi.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="pt-24 pb-16 min-h-screen bg-green-50/50">
      <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="text-center mb-10 text-green-900">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Aspirasi</h1>
          <p className="text-lg opacity-80 max-w-xl mx-auto">
            Wadah resmi untuk menyampaikan saran, keluhan, dan masukan. Biar kami bisa evaluasi dan tindak lanjuti dengan lebih terarah.
          </p>
        </div>

        {/* INFO + CTA */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-green-100 relative overflow-hidden">
          {/* Dekorasi BG */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 bg-opacity-20 rounded-bl-full -z-10 mix-blend-multiply blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-400 bg-opacity-20 rounded-tr-full -z-10 mix-blend-multiply blur-2xl"></div>

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
        </div>

        {/* FORM */}
        {showForm && (
          <div ref={formRef} className="mt-8 bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-green-100 relative overflow-hidden">
            {/* Dekorasi BG */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-400 bg-opacity-10 rounded-bl-full -z-10 mix-blend-multiply blur-2xl"></div>

            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-green-900">Form Aspirasi</h2>
              <p className="text-sm text-neutral-600 mt-1">Isi singkat, jelas, dan pilih kategori yang paling sesuai.</p>
            </div>

            {successMsg && (
              <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-xl border border-green-200 flex items-center gap-3">
                <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* NAMA (Wajib) */}
                <div>
                  <label htmlFor="nama" className="block text-sm font-semibold text-green-900 mb-2">
                    Nama (Wajib)
                  </label>
                  <input
                    type="text"
                    id="nama"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    required
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
          </div>
        )}
      </div>
    </section>
  );
}

import { useState } from 'react';
import useAspirasi from '../../hooks/useAspirasi';
import Navbar from '../Navbar';
import Footer from '../Footer';

export default function Aspirasi() {
  const { addAspirasi } = useAspirasi();

  const [nim, setNim] = useState('');
  const [nama, setNama] = useState('');
  const [angkatan, setAngkatan] = useState('');
  const [kelas, setKelas] = useState('');
  const [judul, setJudul] = useState('');
  const [pesan, setPesan] = useState('');
  
  const [errorObj, setErrorObj] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate format NIM Teknik Informatika
  // e.g., 2024 + 081 + 0091
  const validateNim = (val) => {
    // Regex matches: 4 digits (year), 081, followed by 1-4 digits
    const regex = /^\d{4}081\d{1,5}$/;
    return regex.test(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorObj(null);
    setSuccessMsg('');

    if (!validateNim(nim)) {
      setErrorObj({ type: 'nim', message: 'NIM tidak valid. Harus mengandung kode TI (081).' });
      return;
    }
    
    if (!angkatan || !kelas) {
      setErrorObj({ type: 'kelas', message: 'Harap pilih angkatan dan kelas Anda.' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addAspirasi({
        nim: nim,
        nama: nama.trim(),
        angkatan: angkatan,
        kelas: kelas,
        judul: judul.trim(),
        pesan: pesan.trim(),
      });
      setSuccessMsg('Aspirasi Anda berhasil dikirim! Terima kasih atas partisipasi Anda.');
      setNim('');
      setNama('');
      setAngkatan('');
      setKelas('');
      setJudul('');
      setPesan('');
    } catch (err) {
      setErrorObj({ type: 'server', message: 'Terjadi kesalahan saat mengirim aspirasi.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-24 pb-16 min-h-screen bg-green-50/50 flex flex-col items-center">
        <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          
          <div className="text-center mb-10 text-green-900">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Kotak Aspirasi</h1>
            <p className="text-lg opacity-80 max-w-xl mx-auto">
              Sampaikan keluh kesah, saran, dan masukan Anda untuk kemajuan HIMA TI dan jurusan. Suara Anda sangat berarti!
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-green-100 relative overflow-hidden">
            {/* Dekorasi BG */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 bg-opacity-20 rounded-bl-full -z-10 mix-blend-multiply blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-400 bg-opacity-20 rounded-tr-full -z-10 mix-blend-multiply blur-2xl"></div>

            {successMsg && (
              <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-xl border border-green-200 flex items-center gap-3">
                <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* NIM */}
                <div>
                  <label htmlFor="nim" className="block text-sm font-semibold text-green-900 mb-2">NIM (Wajib)</label>
                  <input
                    type="text"
                    id="nim"
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    required
                    maxLength="20"
                    placeholder="Contoh: 20240810091"
                    className={`w-full px-4 py-3 rounded-xl border ${errorObj?.type === 'nim' ? 'border-red-500 bg-red-50 focus:ring-red-500' : 'border-neutral-200 bg-neutral-50 focus:border-green-500'} focus:ring-2 focus:ring-green-200 outline-none transition-all placeholder:text-neutral-400`}
                  />
                  {errorObj?.type === 'nim' && (
                    <p className="mt-2 text-sm text-red-600">{errorObj.message}</p>
                  )}
                  <p className="mt-1 text-xs text-neutral-500">Hanya NIM Teknik Informatika yang diizinkan.</p>
                </div>
                
                {/* NAMA (Wajib) */}
                <div>
                  <label htmlFor="nama" className="block text-sm font-semibold text-green-900 mb-2">Nama Lengkap (Wajib)</label>
                  <input
                    type="text"
                    id="nama"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    required
                    placeholder="Masukkan nama lengkap Anda"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all placeholder:text-neutral-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* ANGKATAN */}
                <div>
                  <label htmlFor="angkatan" className="block text-sm font-semibold text-green-900 mb-2">Tahun Angkatan (Wajib)</label>
                  <select
                    id="angkatan"
                    value={angkatan}
                    onChange={(e) => setAngkatan(e.target.value)}
                    required
                    className={`w-full px-4 py-3 rounded-xl border ${errorObj?.type === 'kelas' && !angkatan ? 'border-red-500 bg-red-50' : 'border-neutral-200 bg-neutral-50 focus:border-green-500'} focus:ring-2 focus:ring-green-200 outline-none transition-all`}
                  >
                    <option value="" disabled>Pilih Tahun Angkatan</option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </select>
                </div>

                {/* KELAS */}
                <div>
                  <label htmlFor="kelas" className="block text-sm font-semibold text-green-900 mb-2">Kelas (Wajib)</label>
                  <select
                    id="kelas"
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    required
                    className={`w-full px-4 py-3 rounded-xl border ${errorObj?.type === 'kelas' && !kelas ? 'border-red-500 bg-red-50' : 'border-neutral-200 bg-neutral-50 focus:border-green-500'} focus:ring-2 focus:ring-green-200 outline-none transition-all`}
                  >
                    <option value="" disabled>Pilih Kelas</option>
                    <option value="TI 1">TI 1</option>
                    <option value="TI 2">TI 2</option>
                    <option value="TI 3">TI 3</option>
                    <option value="TI 4">TI 4</option>
                    <option value="TI 5">TI 5</option>
                  </select>
                </div>
              </div>
              
              {errorObj?.type === 'kelas' && (
                <p className="mt-1 text-sm text-red-600">{errorObj.message}</p>
              )}

               {/* JUDUL */}
               <div>
                <label htmlFor="judul" className="block text-sm font-semibold text-green-900 mb-2">Topik / Judul (Wajib)</label>
                <input
                  type="text"
                  id="judul"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  required
                  placeholder="Singkat dan jelas mengenai aspirasi Anda"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all placeholder:text-neutral-400"
                />
              </div>

              {/* PESAN */}
              <div>
                <label htmlFor="pesan" className="block text-sm font-semibold text-green-900 mb-2">Saran / Keluhan / Masukan (Wajib)</label>
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
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <span>Kirim Aspirasi</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

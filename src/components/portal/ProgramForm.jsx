import { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';

export default function ProgramForm({ program, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    gambar: '',
    link: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (program) {
      setFormData({
        judul: program.judul || '',
        deskripsi: program.deskripsi || '',
        gambar: program.gambar || '',
        link: program.link || '',
      });
    }
  }, [program]);

  const validate = () => {
    const newErrors = {};
    if (!formData.judul.trim()) newErrors.judul = 'Judul wajib diisi';
    if (!formData.deskripsi.trim()) newErrors.deskripsi = 'Deskripsi wajib diisi';
    if (!formData.gambar) newErrors.gambar = 'Gambar wajib diupload';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900">
            {program ? 'Edit Program' : 'Tambah Program'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Program</label>
            <input
              type="text"
              value={formData.judul}
              onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all ${
                errors.judul ? 'border-red-400' : 'border-gray-200'
              }`}
              placeholder="Nama program atau kegiatan"
            />
            {errors.judul && <p className="text-red-500 text-xs mt-1">{errors.judul}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
            <textarea
              rows={4}
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all resize-none ${
                errors.deskripsi ? 'border-red-400' : 'border-gray-200'
              }`}
              placeholder="Deskripsi singkat tentang program"
            />
            {errors.deskripsi && <p className="text-red-500 text-xs mt-1">{errors.deskripsi}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Gambar</label>
            <ImageUpload
              value={formData.gambar}
              onChange={(val) => setFormData({ ...formData, gambar: val })}
            />
            {errors.gambar && <p className="text-red-500 text-xs mt-1">{errors.gambar}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Link <span className="text-gray-400 font-normal">(Opsional)</span>
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
              placeholder="https://github.com/contoh"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold rounded-xl transition-all shadow-md"
            >
              {program ? 'Simpan Perubahan' : 'Tambah Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

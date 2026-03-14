import { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';

export default function ProductForm({ product, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    harga: '',
    gambar: '',
    linkOrder: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        nama: product.nama || '',
        deskripsi: product.deskripsi || '',
        harga: product.harga || '',
        gambar: product.gambar || '',
        linkOrder: product.linkOrder || '',
      });
    }
  }, [product]);

  const validate = () => {
    const newErrors = {};
    if (!formData.nama.trim()) newErrors.nama = 'Nama produk wajib diisi';
    if (!formData.deskripsi.trim()) newErrors.deskripsi = 'Deskripsi wajib diisi';
    if (!formData.harga || isNaN(formData.harga)) newErrors.harga = 'Harga wajib diisi dengan angka';
    if (!formData.gambar) newErrors.gambar = 'Gambar wajib diupload';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...formData,
      harga: parseInt(formData.harga, 10)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900">
            {product ? 'Edit Produk' : 'Tambah Produk'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Produk</label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all ${
                errors.nama ? 'border-red-400' : 'border-gray-200'
              }`}
              placeholder="Contoh: Kemeja HIMA TI"
            />
            {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Harga (Rp)</label>
            <input
              type="number"
              value={formData.harga}
              onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all ${
                errors.harga ? 'border-red-400' : 'border-gray-200'
              }`}
              placeholder="Contoh: 150000"
            />
            {errors.harga && <p className="text-red-500 text-xs mt-1">{errors.harga}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
            <textarea
              rows={3}
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all resize-none ${
                errors.deskripsi ? 'border-red-400' : 'border-gray-200'
              }`}
              placeholder="Deskripsi singkat produk"
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
              Link Order (WhatsApp/Shopee) <span className="text-gray-400 font-normal">(Opsional)</span>
            </label>
            <input
              type="url"
              value={formData.linkOrder}
              onChange={(e) => setFormData({ ...formData, linkOrder: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
              placeholder="https://wa.me/..."
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
              {product ? 'Simpan Perubahan' : 'Tambah Produk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

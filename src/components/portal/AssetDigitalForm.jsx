import { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';

export default function AssetDigitalForm({
  asset,
  onSubmit,
  onCancel,
  submitting = false,
  submitError = ''
}) {
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    category: '',
    type: 'web',
    image: '',
    repo_url: '',
    guide_url: '',
    demo_url: '',
    tech_stack: '[]',
    features: '[]',
    is_hot: false,
    is_recommended: false
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (asset) {
      setFormData({
        title: asset.title || '',
        desc: asset.desc || '',
        category: asset.cat || '', 
        type: asset.type || 'web',
        image: asset.image || '',
        repo_url: asset.repoUrl || '',
        guide_url: asset.guideUrl || '',
        demo_url: asset.demoUrl || '',
        tech_stack: (asset.techStack || []).join(', '),
        features: (asset.features || []).join(', '),
        is_hot: asset.isHot || false,
        is_recommended: asset.isRecommended || false
      });
    }
  }, [asset]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Judul wajib diisi';
    if (!formData.desc.trim()) newErrors.desc = 'Deskripsi wajib diisi';
    if (!formData.category.trim()) newErrors.category = 'Kategori wajib diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;

    const parsedTechStack = JSON.stringify(formData.tech_stack.split(',').map(s => s.trim()).filter(Boolean));
    const parsedFeatures = JSON.stringify(formData.features.split(',').map(s => s.trim()).filter(Boolean));

    const data = new FormData();
    data.append('title', formData.title);
    data.append('desc', formData.desc);
    data.append('category', formData.category);
    data.append('type', formData.type);
    data.append('tech_stack', parsedTechStack);
    data.append('features', parsedFeatures);
    data.append('repo_url', formData.repo_url);
    data.append('guide_url', formData.guide_url);
    data.append('demo_url', formData.demo_url);
    data.append('is_hot', formData.is_hot);
    data.append('is_recommended', formData.is_recommended);

    if (formData.image instanceof File) {
      data.append('image', formData.image);
    } else if (typeof formData.image === 'string' && formData.image) {
      // If it's a URL string (not a new file upload), backend will ignore it or we can pass it
      // Actually backend only handles `body.image instanceof File`
    }

    await onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => {
          if (submitting) return;
          onCancel();
        }}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl z-10 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">
            {asset ? 'Edit Aset Digital' : 'Tambah Aset Digital'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Aset *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={submitting}
                className={`w-full px-4 py-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all ${errors.title ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori *</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                disabled={submitting}
                placeholder="Contoh: Modul Desa"
                className={`w-full px-4 py-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all ${errors.category ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Singkat *</label>
            <textarea
              rows={2}
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              disabled={submitting}
              className={`w-full px-4 py-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all resize-none ${errors.desc ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.desc && <p className="text-red-500 text-xs mt-1">{errors.desc}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Gambar Banner</label>
            <ImageUpload
              value={formData.image}
              onChange={(val) => setFormData({ ...formData, image: val })}
              disabled={submitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">URL Demo</label>
              <input
                type="url"
                value={formData.demo_url}
                onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                disabled={submitting}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">URL Repo</label>
              <input
                type="url"
                value={formData.repo_url}
                onChange={(e) => setFormData({ ...formData, repo_url: e.target.value })}
                disabled={submitting}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">URL Panduan</label>
              <input
                type="url"
                value={formData.guide_url}
                onChange={(e) => setFormData({ ...formData, guide_url: e.target.value })}
                disabled={submitting}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tech Stack <span className="text-gray-400 font-normal">(Pisahkan dengan koma)</span></label>
              <textarea
                rows={2}
                value={formData.tech_stack}
                onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                disabled={submitting}
                placeholder="React, Tailwind CSS, Supabase"
                className={`w-full px-4 py-2 border rounded-xl text-sm ${errors.tech_stack ? 'border-red-400' : 'border-gray-200'}`}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fitur Utama <span className="text-gray-400 font-normal">(Pisahkan dengan koma)</span></label>
              <textarea
                rows={2}
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                disabled={submitting}
                placeholder="Katalog produk dengan foto, Filter kategori"
                className={`w-full px-4 py-2 border rounded-xl text-sm ${errors.features ? 'border-red-400' : 'border-gray-200'}`}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
              <input type="checkbox" checked={formData.is_hot} onChange={(e) => setFormData({ ...formData, is_hot: e.target.checked })} className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" />
              Tandai Populer (Hot)
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
              <input type="checkbox" checked={formData.is_recommended} onChange={(e) => setFormData({ ...formData, is_recommended: e.target.checked })} className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" />
              Tandai Rekomendasi
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-70"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Aset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

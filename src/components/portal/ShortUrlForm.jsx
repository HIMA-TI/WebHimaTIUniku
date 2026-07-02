import { useState, useEffect } from 'react';

export default function ShortUrlForm({ shortUrl, onSubmit, onCancel, submitting, submitError }) {
  const [formData, setFormData] = useState({
    short_code: '',
    original_url: ''
  });
  
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (shortUrl) {
      setFormData({
        short_code: shortUrl.short_code || '',
        original_url: shortUrl.original_url || ''
      });
    }
  }, [shortUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'short_code') {
      // Hilangkan spasi dan karakter aneh saat mengetik
      const cleanValue = value.replace(/[^a-zA-Z0-9-_]/g, '');
      setFormData({ ...formData, [name]: cleanValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.short_code.trim() || !formData.original_url.trim()) {
      setLocalError('Semua field wajib diisi');
      return;
    }
    if (!formData.original_url.startsWith('http://') && !formData.original_url.startsWith('https://')) {
      setLocalError('URL asli harus diawali dengan http:// atau https://');
      return;
    }
    
    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">
            {shortUrl ? 'Edit URL Pendek' : 'Tambah URL Pendek Baru'}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {(localError || submitError) && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start gap-2">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span>{localError || submitError}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Short Code
            </label>
            <div className="flex rounded-xl shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 sm:text-sm">
                hima-ti.uniku.ac.id/s/
              </span>
              <input
                type="text"
                name="short_code"
                value={formData.short_code}
                onChange={handleChange}
                className="flex-1 min-w-0 block w-full px-3 py-2.5 rounded-none rounded-r-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-shadow outline-none"
                placeholder="kkn-2026"
                required
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-500">Hanya boleh huruf, angka, strip (-), dan underscore (_).</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              URL Asli (Tujuan)
            </label>
            <input
              type="url"
              name="original_url"
              value={formData.original_url}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow text-sm"
              placeholder="https://docs.google.com/forms/d/e/..."
              required
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-50 hover:bg-gray-100 font-semibold rounded-xl transition-colors text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all text-sm disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan URL'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

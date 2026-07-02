import { useState } from 'react';
import usePrograms from '../../hooks/usePrograms';
import useProducts from '../../hooks/useProducts';
import useAspirasi from '../../hooks/useAspirasi';
import usePesan from '../../hooks/usePesan';
import useAssetRequests from '../../hooks/useAssetRequests';
import useDigitalAssets from '../../hooks/useDigitalAssets';
import ProgramForm from './ProgramForm';
import ProductForm from './ProductForm';
import AssetDigitalForm from './AssetDigitalForm';
import ShortUrlForm from './ShortUrlForm';
import DeleteConfirmModal from './DeleteConfirmModal';
import useShortUrls from '../../hooks/useShortUrls';

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('program'); // 'program', 'produk', 'aspirasi'

  // --- PROGRAM STATES ---
  const { programs, addProgram, updateProgram, deleteProgram, reorderPrograms } = usePrograms();
  const [showProgramForm, setShowProgramForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [deleteProgramTarget, setDeleteProgramTarget] = useState(null);

  // --- PRODUCT STATES ---
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteProductTarget, setDeleteProductTarget] = useState(null);
  const [productSubmitting, setProductSubmitting] = useState(false);
  const [productSubmitError, setProductSubmitError] = useState('');

  // --- ASPIRASI STATES ---
  const { aspirasi, deleteAspirasi, exportCsv } = useAspirasi();
  const [deleteAspirasiTarget, setDeleteAspirasiTarget] = useState(null);

  // --- PESAN STATES ---
  const { pesanList, deletePesan } = usePesan();
  const [deletePesanTarget, setDeletePesanTarget] = useState(null);

  // --- IZIN ASET STATES ---
  const { requests, updateStatus, deleteRequest } = useAssetRequests();
  const [deleteRequestTarget, setDeleteRequestTarget] = useState(null);

  // --- KELOLA ASET STATES ---
  const { digitalAssets, addAsset, updateAsset, deleteAsset } = useDigitalAssets();
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [deleteAssetTarget, setDeleteAssetTarget] = useState(null);
  const [assetSubmitting, setAssetSubmitting] = useState(false);
  const [assetSubmitError, setAssetSubmitError] = useState('');

  // --- SHORT URL STATES ---
  const { shortUrls, addShortUrl, updateShortUrl, deleteShortUrl } = useShortUrls();
  const [showShortUrlForm, setShowShortUrlForm] = useState(false);
  const [editingShortUrl, setEditingShortUrl] = useState(null);
  const [deleteShortUrlTarget, setDeleteShortUrlTarget] = useState(null);
  const [shortUrlSubmitting, setShortUrlSubmitting] = useState(false);
  const [shortUrlSubmitError, setShortUrlSubmitError] = useState('');

  const openCreateAssetForm = () => {
    setAssetSubmitError('');
    setShowAssetForm(true);
  };

  const openEditAssetForm = (asset) => {
    setAssetSubmitError('');
    setEditingAsset(asset);
  };

  const handleAddAsset = async (data) => {
    setAssetSubmitting(true);
    setAssetSubmitError('');
    const result = await addAsset(data);
    setAssetSubmitting(false);
    if (result?.success) {
      setShowAssetForm(false);
      return true;
    }
    setAssetSubmitError(result?.error || 'Gagal menambahkan aset');
    return false;
  };

  const handleUpdateAsset = async (data) => {
    if (!editingAsset) return false;
    setAssetSubmitting(true);
    setAssetSubmitError('');
    const result = await updateAsset(editingAsset.id, data);
    setAssetSubmitting(false);
    if (result?.success) {
      setEditingAsset(null);
      return true;
    }
    setAssetSubmitError(result?.error || 'Gagal memperbarui aset');
    return false;
  };

  const openCreateProductForm = () => {
    setProductSubmitError('');
    setShowProductForm(true);
  };

  const openEditProductForm = (product) => {
    setProductSubmitError('');
    setEditingProduct(product);
  };

  const handleAddProduct = async (data) => {
    setProductSubmitting(true);
    setProductSubmitError('');

    const result = await addProduct(data);

    setProductSubmitting(false);
    if (result?.success) {
      setShowProductForm(false);
      return true;
    }

    setProductSubmitError(result?.error || 'Gagal menambahkan produk');
    return false;
  };

  const handleUpdateProduct = async (data) => {
    if (!editingProduct) return false;

    setProductSubmitting(true);
    setProductSubmitError('');

    const result = await updateProduct(editingProduct.id, data);

    setProductSubmitting(false);
    if (result?.success) {
      setEditingProduct(null);
      return true;
    }

    setProductSubmitError(result?.error || 'Gagal memperbarui produk');
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-green-200/50 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-green-900">Portal Pengurus</h1>
            <p className="text-green-600 text-sm">HIMA TI - {activeTab === 'program' ? 'Kelola Program' : activeTab === 'produk' ? 'Kelola Produk' : activeTab === 'aspirasi' ? 'Kelola Aspirasi' : activeTab === 'izin_aset' ? 'Kelola Izin Aset' : activeTab === 'kelola_aset' ? 'Kelola Aset Digital' : activeTab === 'short_url' ? 'Kelola URL Pendek' : 'Kelola Pesan'}</p>
          </div>

          <div className="flex bg-green-100/50 p-1 rounded-xl overflow-x-auto whitespace-nowrap hide-scrollbar">
            {['program', 'produk', 'aspirasi', 'pesan', 'kelola_aset', 'izin_aset', 'short_url'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`capitalize px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab ? 'bg-white text-green-800 shadow-sm' : 'text-green-600 hover:text-green-800 hover:bg-green-50/50'
                }`}
              >
                {tab === 'izin_aset' ? 'Izin Aset' : tab === 'kelola_aset' ? 'Kelola Aset' : tab === 'short_url' ? 'Short URL' : tab}
              </button>
            ))}
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            Keluar
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ===================== TAB PROGRAM ===================== */}
        {activeTab === 'program' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-green-900">Daftar Program</h2>
                <p className="text-green-600/60 text-sm">{programs.length} program terdaftar</p>
              </div>
              <button
                onClick={() => setShowProgramForm(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Tambah Program
              </button>
            </div>

            {programs.length === 0 && (
              <div className="bg-white rounded-2xl border border-green-200/50 shadow-sm p-12 text-center">
                <p className="text-green-900 font-semibold mb-1">Belum ada program</p>
              </div>
            )}

            {programs.length > 0 && (
              <div className="space-y-3">
                {programs.map((prog, idx) => (
                  <div key={prog.id} className="bg-white rounded-xl border border-green-200/50 shadow-sm p-4 flex items-center gap-4">
                    <img src={prog.gambar} alt={prog.judul} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-green-900 truncate">{prog.judul}</h3>
                      <p className="text-green-600/60 text-sm truncate">{prog.deskripsi}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => {
                        if (idx === 0) return;
                        const ids = programs.map((p) => p.id);
                        [ids[idx - 1], ids[idx]] = [ids[idx], ids[idx - 1]];
                        reorderPrograms(ids);
                      }} disabled={idx === 0} className="p-2 rounded-lg hover:bg-green-50 text-green-600 disabled:opacity-30">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
                      </button>
                      <button onClick={() => {
                        if (idx === programs.length - 1) return;
                        const ids = programs.map((p) => p.id);
                        [ids[idx], ids[idx + 1]] = [ids[idx + 1], ids[idx]];
                        reorderPrograms(ids);
                      }} disabled={idx === programs.length - 1} className="p-2 rounded-lg hover:bg-green-50 text-green-600 disabled:opacity-30">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                      </button>
                      <button onClick={() => setEditingProgram(prog)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                      </button>
                      <button onClick={() => setDeleteProgramTarget(prog)} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ===================== TAB PRODUK ===================== */}
        {activeTab === 'produk' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-green-900">Daftar Produk</h2>
                <p className="text-green-600/60 text-sm">{products.length} produk terdaftar</p>
              </div>
              <button
                onClick={openCreateProductForm}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Tambah Produk
              </button>
            </div>

            {products.length === 0 && (
              <div className="bg-white rounded-2xl border border-green-200/50 shadow-sm p-12 text-center">
                <p className="text-green-900 font-semibold mb-1">Belum ada produk</p>
              </div>
            )}

            {products.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((prod) => (
                  <div key={prod.id} className="bg-white rounded-xl border border-green-200/50 shadow-sm p-4 flex items-center gap-4">
                    <img src={prod.gambar} alt={prod.nama} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-green-900 truncate">{prod.nama}</h3>
                      <p className="text-green-700 font-bold text-sm mb-1">Rp {prod.harga?.toLocaleString('id-ID')}</p>
                      <p className="text-green-600/60 text-xs truncate">{prod.deskripsi}</p>
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <button onClick={() => openEditProductForm(prod)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                      </button>
                      <button onClick={() => setDeleteProductTarget(prod)} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ===================== TAB ASPIRASI ===================== */}
        {activeTab === 'aspirasi' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-green-900">Daftar Aspirasi</h2>
                <p className="text-green-600/60 text-sm">{aspirasi.length} pesan masuk</p>
              </div>
              <button
                onClick={exportCsv}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                Export CSV
              </button>
            </div>

            {aspirasi.length === 0 && (
              <div className="bg-white rounded-2xl border border-green-200/50 shadow-sm p-12 text-center">
                <p className="text-green-900 font-semibold mb-1">Belum ada aspirasi</p>
              </div>
            )}

            {aspirasi.length > 0 && (
              <div className="space-y-4">
                {aspirasi.map((asp) => (
                  <div key={asp.id} className="bg-white rounded-xl border border-green-200/50 shadow-sm p-5 relative">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-green-900 text-lg">{asp.topic || asp.judul}</h3>
                        <p className="text-sm text-neutral-600 mt-1">Oleh: <span className="font-semibold">{asp.name || asp.nama || 'Anonim'}</span> &bull; Kategori: <span className="font-semibold text-green-700">{asp.category || asp.kategori || '-'}</span></p>
                        <p className="text-xs text-neutral-400 mt-1">{new Date(asp.created_at || asp.createdAt).toLocaleDateString('id-ID')}</p>
                      </div>
                      <button onClick={() => setDeleteAspirasiTarget(asp)} className="p-2 rounded-lg hover:bg-red-50 text-red-500" title="Hapus">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    </div>
                    <div className="bg-neutral-50 p-4 border border-neutral-100 rounded-lg text-sm text-neutral-800 whitespace-pre-wrap">
                      {asp.description || asp.pesan}
                    </div>

                    {(asp.file_url || asp.lampiran?.dataUrl) && (
                      <div className="mt-4">
                        <p className="text-xs text-neutral-500 mb-2">Lampiran</p>
                        <a
                          href={asp.file_url || asp.lampiran?.dataUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                          title={asp.lampiran?.name || 'Buka lampiran'}
                        >
                          <img
                            src={asp.file_url || asp.lampiran?.dataUrl}
                            alt={asp.lampiran?.name ? `Lampiran - ${asp.lampiran.name}` : 'Lampiran aspirasi'}
                            className="w-full max-h-80 object-contain rounded-lg border border-neutral-100 bg-neutral-50"
                            loading="lazy"
                          />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ===================== TAB PESAN ===================== */}
        {activeTab === 'pesan' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-green-900">Daftar Pesan Kontak</h2>
                <p className="text-green-600/60 text-sm">{pesanList.length} pesan masuk dari halaman kontak</p>
              </div>
            </div>

            {pesanList.length === 0 && (
              <div className="bg-white rounded-2xl border border-green-200/50 shadow-sm p-12 text-center">
                <p className="text-green-900 font-semibold mb-1">Belum ada pesan</p>
              </div>
            )}

            {pesanList.length > 0 && (
              <div className="space-y-4">
                {pesanList.map((msg) => (
                  <div key={msg.id} className="bg-white rounded-xl border border-green-200/50 shadow-sm p-5 relative">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-green-900 text-lg">{msg.nama}</h3>
                        <p className="text-sm text-neutral-600 mt-1">
                          <a href={`mailto:${msg.email}`} className="text-blue-500 hover:underline">{msg.email}</a> &bull; {new Date(msg.createdAt).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <button onClick={() => setDeletePesanTarget(msg)} className="p-2 rounded-lg hover:bg-red-50 text-red-500" title="Hapus">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    </div>
                    <div className="bg-neutral-50 p-4 border border-neutral-100 rounded-lg text-sm text-neutral-800 whitespace-pre-wrap">
                      {msg.pesan}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ===================== TAB IZIN ASET ===================== */}
        {activeTab === 'izin_aset' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-green-900">Daftar Request Aset Digital</h2>
                <p className="text-green-600/60 text-sm">{requests.length} request masuk</p>
              </div>
            </div>

            {requests.length === 0 && (
              <div className="bg-white rounded-2xl border border-green-200/50 shadow-sm p-12 text-center">
                <p className="text-green-900 font-semibold mb-1">Belum ada request izin aset</p>
              </div>
            )}

            {requests.length > 0 && (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div key={req.id} className="bg-white rounded-xl border border-green-200/50 shadow-sm p-5 relative">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-green-900 text-lg">{req.name} {req.organization && <span className="text-sm font-normal text-gray-500">({req.organization})</span>}</h3>
                        <p className="text-sm text-neutral-600 mt-1">
                          WA: <a href={`https://wa.me/${req.whatsapp.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 font-bold hover:underline">{req.whatsapp}</a> &bull; {new Date(req.created_at).toLocaleDateString('id-ID')}
                        </p>
                        <p className="text-sm text-neutral-600 mt-1">
                          Aset yang diminta: <span className="font-semibold text-emerald-700">{req.asset_title}</span>
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${req.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : req.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-yellow-50 text-yellow-600 border-yellow-200'}`}>
                          {req.status === 'approved' ? 'Disetujui' : req.status === 'rejected' ? 'Ditolak' : 'Pending'}
                        </span>
                        <button onClick={() => setDeleteRequestTarget(req)} className="p-2 rounded-lg hover:bg-red-50 text-red-500" title="Hapus">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        </button>
                      </div>
                    </div>
                    <div className="bg-neutral-50 p-4 border border-neutral-100 rounded-lg text-sm text-neutral-800 whitespace-pre-wrap mb-4">
                      <span className="text-xs text-gray-500 font-bold block mb-1">Alasan:</span>
                      {req.reason}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 justify-between items-center">
                      <div className="flex gap-2">
                        {req.status === 'pending' && (
                          <>
                            <button onClick={async () => {
                              const result = await updateStatus(req.id, 'approved');
                              if (result && result.warning) {
                                alert(result.warning);
                              }
                            }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors cursor-pointer">
                              Setujui
                            </button>
                            <button onClick={() => updateStatus(req.id, 'rejected')} className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-bold hover:bg-red-200 transition-colors cursor-pointer">
                              Tolak
                            </button>
                          </>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => {
                          navigator.clipboard.writeText(req.whatsapp);
                          alert('Nomor WhatsApp berhasil disalin!');
                        }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors cursor-pointer">
                          Copy No HP
                        </button>
                        <button onClick={() => {
                          const links = [];
                          if (req.demo_url) links.push(`🌐 Demo: ${req.demo_url}`);
                          if (req.repo_url) links.push(`💻 Repository: ${req.repo_url}`);
                          if (req.guide_url) links.push(`📖 Panduan: ${req.guide_url}`);
                          const linksText = links.length > 0 ? links.join('\n') : 'Silakan hubungi admin untuk info lebih lanjut.';
                          const message = `Halo ${req.name},\n\nKabar gembira! Pengajuan akses Anda untuk aset digital *${req.asset_title}* telah *DISETUJUI* oleh pengurus HIMA TI UNIKU.\n\nBerikut adalah akses yang dapat Anda gunakan:\n${linksText}\n\nTerima kasih atas antusiasme Anda terhadap program KKN Desa Pintar!\nSalam hangat dari HIMA TI 🚀`;
                          navigator.clipboard.writeText(message);
                          alert('Template WhatsApp berhasil disalin!');
                        }} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-200 transition-colors cursor-pointer">
                          Copy Template WA
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ===================== TAB KELOLA ASET ===================== */}
        {activeTab === 'kelola_aset' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-green-900">Kelola Aset Digital</h2>
                <p className="text-green-600/60 text-sm">{digitalAssets.length} aset terdaftar</p>
              </div>
              <button
                onClick={openCreateAssetForm}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Tambah Aset
              </button>
            </div>

            {digitalAssets.length === 0 && (
              <div className="bg-white rounded-2xl border border-emerald-200/50 shadow-sm p-12 text-center">
                <p className="text-emerald-900 font-semibold mb-1">Belum ada aset digital</p>
              </div>
            )}

            {digitalAssets.length > 0 && (
              <div className="space-y-4">
                {digitalAssets.map((asset) => (
                  <div key={asset.id} className="bg-white rounded-xl border border-emerald-200/50 shadow-sm p-5 relative flex flex-col sm:flex-row gap-5 items-start">
                    {asset.image ? (
                      <img src={asset.image} alt={asset.title} className="w-full sm:w-32 h-32 object-cover rounded-xl shrink-0 border border-gray-100" />
                    ) : (
                      <div className="w-full sm:w-32 h-32 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100">
                        <svg className="w-10 h-10 text-emerald-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wide">{asset.cat}</span>
                            {asset.isHot && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-600 uppercase tracking-wide">HOT</span>}
                          </div>
                          <h3 className="font-bold text-gray-900 text-lg truncate">{asset.title}</h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{asset.desc}</p>
                        </div>
                        <div className="flex gap-1 shrink-0 ml-4">
                          <button onClick={() => openEditAssetForm(asset)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                          </button>
                          <button onClick={() => setDeleteAssetTarget(asset)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-4 text-xs text-gray-500 flex-wrap">
                        {asset.repoUrl && <a href={asset.repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-emerald-600 transition-colors"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> Repository</a>}
                        {asset.demoUrl && <a href={asset.demoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-emerald-600 transition-colors"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg> Demo</a>}
                        {asset.guideUrl && <a href={asset.guideUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-emerald-600 transition-colors"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> Panduan</a>}
                        <span className="flex items-center gap-1 ml-auto"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg> {asset.likes} Suka</span>
                        <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg> {asset.requestCount} Izin</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ===================== TAB SHORT URL ===================== */}
        {activeTab === 'short_url' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-green-900">URL Shortener</h2>
                <p className="text-green-600/60 text-sm">{shortUrls.length} tautan pendek terdaftar</p>
              </div>
              <button
                onClick={() => { setShortUrlSubmitError(''); setShowShortUrlForm(true); }}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Tambah Tautan
              </button>
            </div>

            {shortUrls.length === 0 && (
              <div className="bg-white rounded-2xl border border-blue-200/50 shadow-sm p-12 text-center">
                <p className="text-blue-900 font-semibold mb-1">Belum ada tautan pendek</p>
              </div>
            )}

            {shortUrls.length > 0 && (
              <div className="space-y-4">
                {shortUrls.map((url) => (
                  <div key={url.id} className="bg-white rounded-xl border border-gray-200/60 shadow-sm p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-lg truncate">hima-ti.uniku.ac.id/{url.short_code}</h3>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(`https://hima-ti.uniku.ac.id/${url.short_code}`);
                            alert('Tautan disalin ke clipboard!');
                          }}
                          className="p-1.5 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Salin Tautan"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 truncate mt-1 flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                        {url.original_url}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">Dibuat: {new Date(url.created_at).toLocaleDateString('id-ID')} &bull; <span className="font-semibold text-emerald-600">{url.clicks} klik</span></p>
                    </div>
                    
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => { setShortUrlSubmitError(''); setEditingShortUrl(url); }} className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                      </button>
                      <button onClick={() => setDeleteShortUrlTarget(url)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* MODALS */}
      {showProgramForm && <ProgramForm onSubmit={(data) => { addProgram(data); setShowProgramForm(false); }} onCancel={() => setShowProgramForm(false)} />}
      {editingProgram && <ProgramForm program={editingProgram} onSubmit={(data) => { updateProgram(editingProgram.id, data); setEditingProgram(null); }} onCancel={() => setEditingProgram(null)} />}
      {deleteProgramTarget && <DeleteConfirmModal programName={deleteProgramTarget.judul} onConfirm={() => { deleteProgram(deleteProgramTarget.id); setDeleteProgramTarget(null); }} onCancel={() => setDeleteProgramTarget(null)} />}

      {showProductForm && (
        <ProductForm
          onSubmit={handleAddProduct}
          onCancel={() => {
            if (productSubmitting) return;
            setShowProductForm(false);
          }}
          submitting={productSubmitting}
          submitError={productSubmitError}
        />
      )}
      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleUpdateProduct}
          onCancel={() => {
            if (productSubmitting) return;
            setEditingProduct(null);
          }}
          submitting={productSubmitting}
          submitError={productSubmitError}
        />
      )}
      {deleteProductTarget && <DeleteConfirmModal programName={deleteProductTarget.nama} onConfirm={() => { deleteProduct(deleteProductTarget.id); setDeleteProductTarget(null); }} onCancel={() => setDeleteProductTarget(null)} />}
      
      {deleteAspirasiTarget && <DeleteConfirmModal programName={`Aspirasi: ${deleteAspirasiTarget.topic || deleteAspirasiTarget.judul || '-'}`} onConfirm={() => { deleteAspirasi(deleteAspirasiTarget.id); setDeleteAspirasiTarget(null); }} onCancel={() => setDeleteAspirasiTarget(null)} />}

      {deletePesanTarget && <DeleteConfirmModal programName={`Pesan dari ${deletePesanTarget.nama}`} onConfirm={() => { deletePesan(deletePesanTarget.id); setDeletePesanTarget(null); }} onCancel={() => setDeletePesanTarget(null)} />}
      
      {deleteRequestTarget && <DeleteConfirmModal programName={`Request Aset dari ${deleteRequestTarget.name}`} onConfirm={() => { deleteRequest(deleteRequestTarget.id); setDeleteRequestTarget(null); }} onCancel={() => setDeleteRequestTarget(null)} />}
      
      {showAssetForm && (
        <AssetDigitalForm
          onSubmit={handleAddAsset}
          onCancel={() => { if (!assetSubmitting) setShowAssetForm(false); }}
          submitting={assetSubmitting}
          submitError={assetSubmitError}
        />
      )}
      {editingAsset && (
        <AssetDigitalForm
          asset={editingAsset}
          onSubmit={handleUpdateAsset}
          onCancel={() => { if (!assetSubmitting) setEditingAsset(null); }}
          submitting={assetSubmitting}
          submitError={assetSubmitError}
        />
      )}
      {deleteAssetTarget && <DeleteConfirmModal programName={`Aset Digital: ${deleteAssetTarget.title}`} onConfirm={() => { deleteAsset(deleteAssetTarget.id); setDeleteAssetTarget(null); }} onCancel={() => setDeleteAssetTarget(null)} />}

      {showShortUrlForm && (
        <ShortUrlForm
          onSubmit={async (data) => {
            setShortUrlSubmitting(true);
            setShortUrlSubmitError('');
            const result = await addShortUrl(data);
            setShortUrlSubmitting(false);
            if (result.success) setShowShortUrlForm(false);
            else setShortUrlSubmitError(result.error);
          }}
          onCancel={() => { if (!shortUrlSubmitting) setShowShortUrlForm(false); }}
          submitting={shortUrlSubmitting}
          submitError={shortUrlSubmitError}
        />
      )}
      {editingShortUrl && (
        <ShortUrlForm
          shortUrl={editingShortUrl}
          onSubmit={async (data) => {
            setShortUrlSubmitting(true);
            setShortUrlSubmitError('');
            const result = await updateShortUrl(editingShortUrl.id, data);
            setShortUrlSubmitting(false);
            if (result.success) setEditingShortUrl(null);
            else setShortUrlSubmitError(result.error);
          }}
          onCancel={() => { if (!shortUrlSubmitting) setEditingShortUrl(null); }}
          submitting={shortUrlSubmitting}
          submitError={shortUrlSubmitError}
        />
      )}
      {deleteShortUrlTarget && <DeleteConfirmModal programName={`Tautan: ${deleteShortUrlTarget.short_code}`} onConfirm={() => { deleteShortUrl(deleteShortUrlTarget.id); setDeleteShortUrlTarget(null); }} onCancel={() => setDeleteShortUrlTarget(null)} />}
    </div>
  );
}

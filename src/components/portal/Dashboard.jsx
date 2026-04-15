import { useState } from 'react';
import usePrograms from '../../hooks/usePrograms';
import useProducts from '../../hooks/useProducts';
import useAspirasi from '../../hooks/useAspirasi';
import usePesan from '../../hooks/usePesan';
import ProgramForm from './ProgramForm';
import ProductForm from './ProductForm';
import DeleteConfirmModal from './DeleteConfirmModal';

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

  // --- ASPIRASI STATES ---
  const { aspirasi, deleteAspirasi, exportCsv } = useAspirasi();
  const [deleteAspirasiTarget, setDeleteAspirasiTarget] = useState(null);

  // --- PESAN STATES ---
  const { pesanList, deletePesan } = usePesan();
  const [deletePesanTarget, setDeletePesanTarget] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-green-200/50 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-green-900">Portal Pengurus</h1>
            <p className="text-green-600 text-sm">HIMA TI - {activeTab === 'program' ? 'Kelola Program' : activeTab === 'produk' ? 'Kelola Produk' : activeTab === 'aspirasi' ? 'Kelola Aspirasi' : 'Kelola Pesan'}</p>
          </div>

          <div className="flex bg-green-100/50 p-1 rounded-xl">
            {['program', 'produk', 'aspirasi', 'pesan'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`capitalize px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab ? 'bg-white text-green-800 shadow-sm' : 'text-green-600 hover:text-green-800 hover:bg-green-50/50'
                }`}
              >
                {tab}
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
                onClick={() => setShowProductForm(true)}
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
                      <button onClick={() => setEditingProduct(prod)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-500">
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
                        <h3 className="font-bold text-green-900 text-lg">{asp.judul}</h3>
                        <p className="text-sm text-neutral-600 mt-1">Oleh: <span className="font-semibold">{asp.nama}</span> ({asp.nim}) &bull; Angkatan {asp.angkatan} - Kelas {asp.kelas}</p>
                        <p className="text-xs text-neutral-400 mt-1">{new Date(asp.createdAt).toLocaleDateString('id-ID')}</p>
                      </div>
                      <button onClick={() => setDeleteAspirasiTarget(asp)} className="p-2 rounded-lg hover:bg-red-50 text-red-500" title="Hapus">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    </div>
                    <div className="bg-neutral-50 p-4 border border-neutral-100 rounded-lg text-sm text-neutral-800 whitespace-pre-wrap">
                      {asp.pesan}
                    </div>

                    {asp.lampiran?.dataUrl && (
                      <div className="mt-4">
                        <p className="text-xs text-neutral-500 mb-2">Lampiran</p>
                        <a
                          href={asp.lampiran.dataUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                          title={asp.lampiran.name || 'Buka lampiran'}
                        >
                          <img
                            src={asp.lampiran.dataUrl}
                            alt={asp.lampiran.name ? `Lampiran - ${asp.lampiran.name}` : 'Lampiran aspirasi'}
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
      </main>

      {/* MODALS */}
      {showProgramForm && <ProgramForm onSubmit={(data) => { addProgram(data); setShowProgramForm(false); }} onCancel={() => setShowProgramForm(false)} />}
      {editingProgram && <ProgramForm program={editingProgram} onSubmit={(data) => { updateProgram(editingProgram.id, data); setEditingProgram(null); }} onCancel={() => setEditingProgram(null)} />}
      {deleteProgramTarget && <DeleteConfirmModal programName={deleteProgramTarget.judul} onConfirm={() => { deleteProgram(deleteProgramTarget.id); setDeleteProgramTarget(null); }} onCancel={() => setDeleteProgramTarget(null)} />}

      {showProductForm && <ProductForm onSubmit={(data) => { addProduct(data); setShowProductForm(false); }} onCancel={() => setShowProductForm(false)} />}
      {editingProduct && <ProductForm product={editingProduct} onSubmit={(data) => { updateProduct(editingProduct.id, data); setEditingProduct(null); }} onCancel={() => setEditingProduct(null)} />}
      {deleteProductTarget && <DeleteConfirmModal programName={deleteProductTarget.nama} onConfirm={() => { deleteProduct(deleteProductTarget.id); setDeleteProductTarget(null); }} onCancel={() => setDeleteProductTarget(null)} />}
      
      {deleteAspirasiTarget && <DeleteConfirmModal programName={`Aspirasi: ${deleteAspirasiTarget.judul}`} onConfirm={() => { deleteAspirasi(deleteAspirasiTarget.id); setDeleteAspirasiTarget(null); }} onCancel={() => setDeleteAspirasiTarget(null)} />}

      {deletePesanTarget && <DeleteConfirmModal programName={`Pesan dari ${deletePesanTarget.nama}`} onConfirm={() => { deletePesan(deletePesanTarget.id); setDeletePesanTarget(null); }} onCancel={() => setDeletePesanTarget(null)} />}
    </div>
  );
}

import { useState, useRef, useEffect, useCallback } from 'react';
import { ExternalLink, BookOpen, ArrowLeft, CheckCircle2, Code, Layers, Zap, Play, Share2, X, Check, Info, ChevronRight, Image as ImageIcon, ChevronLeft, Users, Star, Download, Monitor, Heart, Send, Lock, MapPin, AlertTriangle, Calendar } from 'lucide-react';
import InteractiveBackground from './InteractiveBackground';
import { API_BASE } from '../../../config/api';
import { supabase } from '../../../config/supabase';
import { techIcons } from '../data/techIcons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

/** Sekretariat HIMA TI address info */
const SEKRETARIAT_INFO = {
  name: 'Sekretariat HIMA TI',
  building: 'Kampus 2 UNIKU — Fakultas Ilmu Komputer (FKOM)',
  address: 'Jl. Pramuka No.67, Purwawinangun, Kec. Kuningan, Kabupaten Kuningan, Jawa Barat 45512',
  mapsUrl: 'https://maps.google.com/?q=2FFH%2BP57+Kuningan',
  plusCode: '2FFH+P57'
};

export default function AssetDetail({ selectedAsset, setSelectedAsset, likeAsset, session }) {
  const [showDemo, setShowDemo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestData, setRequestData] = useState({
    name: '',
    whatsapp: '',
    organization: '',
    reason: '',
    borrow_start_date: '',
    borrow_end_date: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const sliderRef = useRef(null);

  // Borrower tracking state
  const [bookedDates, setBookedDates] = useState([]);
  const [loadingDates, setLoadingDates] = useState(false);

  const isLimited = selectedAsset?.is_limited === true;

  // Fetch booked dates for limited assets
  const fetchBookedDates = useCallback(async () => {
    if (!isLimited || !selectedAsset?.id) return;
    setLoadingDates(true);
    try {
      const response = await fetch(`${API_BASE}/asset-requests/asset/${selectedAsset.id}/dates`);
      if (response.ok) {
        const json = await response.json();
        const dates = json?.data || [];
        setBookedDates(dates);
      }
    } catch (err) {
      console.error('Failed to fetch booked dates:', err);
    } finally {
      setLoadingDates(false);
    }
  }, [isLimited, selectedAsset?.id]);

  useEffect(() => {
    fetchBookedDates();
  }, [fetchBookedDates]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate active borrowers (all current and future bookings)
  const activeBorrowers = bookedDates.filter(d => {
    if (!d.borrow_start_date || !d.borrow_end_date) return false;
    const end = new Date(d.borrow_end_date);
    end.setHours(23, 59, 59, 999);
    return end >= today;
  });

  const getExcludedDateIntervals = () => {
    return bookedDates
      .filter(b => b.borrow_start_date && b.borrow_end_date)
      .map(b => ({
        start: new Date(new Date(b.borrow_start_date).setHours(0,0,0,0)),
        end: new Date(new Date(b.borrow_end_date).setHours(23,59,59,999))
      }));
  };
  const excludedIntervals = getExcludedDateIntervals();
  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 400;
      sliderRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  if (!selectedAsset) return null;

  const { title, desc, cat, icon: IconComponent, demoUrl, difficulty, systemReq, developer } = selectedAsset;

  const parseImages = (imgData) => {
    if (!imgData) return [];
    if (Array.isArray(imgData)) return imgData;
    if (typeof imgData === 'string') {
       try {
         const parsed = JSON.parse(imgData);
         if (Array.isArray(parsed)) return parsed;
        } catch {
          if (imgData.includes(',')) return imgData.split(',').map(s => s.trim());
          return [imgData];
        }
    }
    return [];
  };
  
  const images = parseImages(selectedAsset.image);
  const coverImage = images.length > 0 ? images[0] : null;
  const developers = Array.isArray(developer) ? developer : (developer && developer.name ? [developer] : []);

  const handleShare = () => {
    const url = window.location.href;
    const text = `Lihat ${title} di Inventaris IPTEK HIMA-TI! ${url}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Nama wajib diisi.';
        else if (value.trim().length < 3) error = 'Nama minimal 3 karakter.';
        break;
      case 'whatsapp':
        if (!value.trim()) error = 'Nomor WhatsApp wajib diisi.';
        else if (!/^\d+$/.test(value.trim())) error = 'Nomor WhatsApp hanya boleh berisi angka.';
        else if (value.trim().length < 9) error = 'Nomor WhatsApp minimal 9 digit.';
        else if (value.trim().length > 15) error = 'Nomor WhatsApp maksimal 15 digit.';
        break;
      case 'reason':
        if (!value.trim()) error = 'Alasan penggunaan wajib diisi.';
        else if (value.trim().length < 5) error = 'Alasan minimal 5 karakter.';
        break;
      case 'borrow_start_date':
      case 'borrow_end_date':
        if (isLimited && !value) {
          error = name === 'borrow_start_date' ? 'Tanggal mulai pinjam wajib diisi.' : 'Tanggal selesai pinjam wajib diisi.';
        } else if (name === 'borrow_end_date' && isLimited && requestData.borrow_start_date && value && new Date(value) <= new Date(requestData.borrow_start_date)) {
          error = 'Tanggal selesai harus setelah tanggal mulai.';
        } else if (name === 'borrow_start_date' && isLimited && requestData.borrow_end_date && value && new Date(value) >= new Date(requestData.borrow_end_date)) {
          error = 'Tanggal mulai harus sebelum tanggal selesai.';
        }
        break;
      default:
        break;
    }
    setFormErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRequestData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name] !== undefined) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    
    const isNameValid = validateField('name', requestData.name);
    const isWaValid = validateField('whatsapp', requestData.whatsapp);
    const isReasonValid = validateField('reason', requestData.reason);
    let isDatesValid = true;
    if (isLimited) {
      isDatesValid = validateField('borrow_start_date', requestData.borrow_start_date) && validateField('borrow_end_date', requestData.borrow_end_date);
    }

    if (!isNameValid || !isWaValid || !isReasonValid || !isDatesValid) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const bodyPayload = {
        asset_id: selectedAsset.id,
        email: session?.user?.email,
        ...requestData
      };
      // Only send borrow dates for limited assets
      if (!isLimited) {
        delete bodyPayload.borrow_start_date;
        delete bodyPayload.borrow_end_date;
      }

      const response = await fetch(`${API_BASE}/asset-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyPayload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const errMsg = errorData.errors.map(err => err.message).join('\n');
          throw new Error(errMsg);
        }
        throw new Error(errorData.message || 'Gagal mengirim pengajuan.');
      }

      setRequestSuccess(true);
      // Refresh booked dates after successful submission
      if (isLimited) fetchBookedDates();
    } catch (error) {
      console.error('Error submitting request:', error);
      alert(error.message || 'Terjadi kesalahan saat mengajukan izin.');
    } finally {
      setIsSubmitting(false);
    }
  };


  // Helper: format date to "DD MMM YYYY"
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Helper: get min date for date picker (today)
  const getMinDate = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  return (
    <div className="kkn2026-page bg-gray-50 text-wk-text-dark font-sans antialiased min-h-screen pb-24 relative overflow-hidden">
      <InteractiveBackground />

      {/* Sticky Nav */}
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white/35 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo HIMA-TI" className="w-9 h-9 object-contain drop-shadow-sm hover:scale-105 transition-transform" />
          <span className="font-display text-xl tracking-wide font-bold text-gray-800">HIMA TI</span>
        </div>
        <button
          onClick={() => setSelectedAsset(null)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-wk-text-light font-bold rounded-full hover:bg-gray-100 transition-colors cursor-pointer bg-white text-sm"
          aria-label="Kembali ke daftar aset"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
      </nav>

      <div className="container mx-auto px-6 py-12 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

          {/* Left — 3/5 */}
          <div className="lg:col-span-3 space-y-8">

            {/* Header (No Card Style) */}
            <div className="relative mb-10 mt-2">
              {coverImage && (
                <div className="w-full aspect-video rounded-[2rem] overflow-hidden mb-8 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] relative group">
                  <img src={coverImage} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              )}
              <div className="flex items-center gap-3 mb-5">
                <span className="px-3.5 py-1.5 font-bold text-[13px] rounded-full border border-emerald-100 bg-emerald-50/80 text-emerald-700 flex items-center gap-2 shadow-sm">
                  <IconComponent className="w-4 h-4" strokeWidth={2.5} />
                  {cat}
                </span>
                {isLimited && (
                  <span className="px-3 py-1.5 font-bold text-[11px] rounded-full border border-amber-200 bg-amber-50 text-amber-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Aset Terbatas
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-[#0F172A] mb-4 drop-shadow-sm">
                {title}
              </h1>
              <p className="text-lg font-medium leading-relaxed text-slate-500 max-w-2xl mb-6">
                {desc}
              </p>


            </div>

            {/* Features */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-gray-500" />
                </div>
                <h3 className="font-bold text-wk-text-dark text-[17px]">Fitur Unggulan</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-6">
                {selectedAsset.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-emerald-500 mt-1 shrink-0" strokeWidth={2.5} />
                    <span className="text-sm text-gray-600 font-medium leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Wrapper agar lebih rapat */}
            <div className="flex flex-col gap-4">
              {/* Grid 2 Columns for Tech & Catatan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Tech Stack */}
                <div className="bg-white rounded-[2rem] p-7 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-shadow duration-300">
                  <div className="flex items-center gap-2 mb-5">
                    <Code className="w-5 h-5 text-gray-400" />
                    <h3 className="font-bold text-wk-text-dark text-[16px]">Teknologi</h3>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {selectedAsset.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-4 py-1.5 bg-gray-50 border border-gray-100 text-gray-600 font-medium text-xs rounded-xl flex items-center gap-2"
                      >
                        {techIcons[tech] && <img src={techIcons[tech]} alt={tech} className="w-3.5 h-3.5 object-contain" loading="lazy" />}
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Catatan Implementasi & System Req */}
                <div className="bg-white rounded-[2rem] p-7 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <Monitor className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-wk-text-dark text-[16px]">Kebutuhan Sistem</h3>
                  </div>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed mb-4">
                    {systemReq || "Membutuhkan perangkat operasional dasar (PC/Laptop) di balai desa dan koneksi internet."}
                  </p>
                  <div className="mt-auto flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md text-[11px] font-bold border border-amber-100 flex items-center gap-1.5">
                      <Star className="w-3 h-3" /> Tingkat Kesulitan: {difficulty || 'Sedang'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Profil Pengembang */}
              {developers.length > 0 && (
                <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all duration-300">
                  <div className="flex flex-col gap-5">
                    {developers.map((dev, idx) => (
                      <div key={idx} className="flex items-center justify-between group hover:bg-emerald-50/50 p-2 -m-2 rounded-xl transition-colors">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-100 overflow-hidden shrink-0 flex items-center justify-center">
                            {dev.avatar ? (
                              <img src={dev.avatar} alt={dev.name} className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                              <Users className="w-6 h-6 text-emerald-500" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-base">{dev.name}</h4>
                            <p className="text-[13px] font-medium text-emerald-600">{dev.role}</p>
                          </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                            <Code className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating & Ulasan */}
              <div className="w-full bg-emerald-50/50 rounded-[2rem] p-6 border border-emerald-100/60 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex items-center gap-4 flex-1">
                  <button
                    onClick={() => likeAsset(selectedAsset.id)}
                    className="w-12 h-12 shrink-0 bg-white rounded-full flex items-center justify-center border border-emerald-100 shadow-[0_2px_10px_-4px_rgba(16,185,129,0.2)] hover:bg-emerald-50 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    aria-label="Suka aset ini"
                  >
                    <Heart className="w-5 h-5 fill-emerald-500 text-emerald-500" />
                  </button>
                  <div className="w-full">
                    <h3 className="font-bold text-gray-900 text-base mb-0.5">Sangat Disukai!</h3>
                    <p className="text-sm text-emerald-700/70 font-medium whitespace-nowrap md:whitespace-normal">Bantu beri dukungan (like) untuk KKN & Desa</p>
                  </div>
                </div>

                <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 bg-white py-3 px-5 rounded-2xl border border-emerald-50 shadow-sm shrink-0">
                  <div className="flex items-center gap-1">
                    <Heart className="w-[18px] h-[18px] text-emerald-500 fill-emerald-500" />
                    <span className="ml-2 font-extrabold text-[17px] text-gray-800">{selectedAsset.likes || 0}</span>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-gray-100"></div>
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-gray-500">
                    <Users className="w-4 h-4 text-emerald-500" />
                    {selectedAsset.requestCount || 0} <span className="font-medium text-gray-400">Pengajuan</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right — 2/5 */}
          <div className="lg:col-span-2">

            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">

              {/* Status */}
              <div className="flex items-center justify-between mb-6">
                <span className="font-semibold text-slate-500 text-sm">Status Aset</span>
                {isLimited ? (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-bold flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Jadwal Tersedia
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-bold flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Tersedia
                  </span>
                )}
              </div>

              {/* Main Action */}
              <button
                onClick={() => setShowRequestModal(true)}
                className="w-full py-3.5 bg-emerald-600 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-sm mb-4 cursor-pointer"
                aria-label="Request akses aset digital"
              >
                Gass Request Akses! <ChevronRight className="w-4 h-4 text-emerald-200" />
              </button>

              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                  onClick={() => {
                    if (selectedAsset.demoUrl) {
                      setShowDemo(true);
                    } else {
                      alert("Mohon maaf, Live Demo untuk aset ini belum tersedia.");
                    }
                  }}
                  className={`w-full py-2.5 border border-slate-200 font-semibold rounded-2xl flex items-center justify-center gap-2 text-sm transition-colors ${selectedAsset.demoUrl ? 'text-slate-600 hover:bg-slate-50 cursor-pointer' : 'text-slate-400 bg-gray-50 cursor-not-allowed opacity-70'}`}
                  aria-label="Lihat live demo"
                >
                  <Play className={`w-4 h-4 ${selectedAsset.demoUrl ? 'text-slate-400' : 'text-slate-300'}`} /> Live Demo
                </button>
                <button
                  onClick={() => {
                    if (selectedAsset.guideUrl) {
                      window.open(selectedAsset.guideUrl, '_blank');
                    } else {
                      alert("Buku panduan pemakaian lengkap akan dikirimkan via WhatsApp setelah pengajuan akses Anda disetujui.");
                    }
                  }}
                  className="w-full py-2.5 border border-slate-200 font-semibold rounded-2xl flex items-center justify-center gap-2 text-sm transition-colors text-slate-600 hover:bg-slate-50 cursor-pointer"
                  aria-label="Lihat dokumentasi"
                >
                  <BookOpen className="w-4 h-4 text-slate-400" /> Dokumentasi
                </button>
              </div>
              <button
                onClick={() => setShowRequestModal(true)}
                className="w-full py-2.5 font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 text-sm mb-8 bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
                aria-label="Request starter kit"
              >
                <Download className="w-4 h-4 text-gray-500" /> Request Starter Kit
              </button>

              {/* ═══════════════════════════════════════════ */}
              {/* TABEL PEMINJAM AKTIF — Only for limited assets */}
              {/* ═══════════════════════════════════════════ */}
              {isLimited && (
                <>
                  <hr className="border-slate-100 my-6" />
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[11px] font-bold text-emerald-800 tracking-widest uppercase">Jadwal Peminjam Aktif</h4>
                    </div>

                    {loadingDates ? (
                      <div className="space-y-3">
                        {[1, 2].map(i => (
                          <div key={i} className="animate-pulse flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                            <div className="flex-1 space-y-2">
                              <div className="w-24 h-3 bg-gray-200 rounded"></div>
                              <div className="w-32 h-2.5 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : activeBorrowers.length > 0 ? (
                      <div className="space-y-2.5">
                        {activeBorrowers.map((borrower, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-emerald-50/50 hover:border-emerald-100 transition-colors">
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                              <span className="text-[11px] font-extrabold text-emerald-700">{idx + 1}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-800 truncate">
                                {borrower.organization || borrower.name || `Peminjam ${idx + 1}`}
                              </p>
                              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-semibold mt-0.5">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                <span>{formatDate(borrower.borrow_start_date)} — {formatDate(borrower.borrow_end_date)}</span>
                              </div>
                            </div>
                            <div className="w-2 h-2 bg-emerald-400 rounded-full shrink-0 animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-5 bg-gray-50 rounded-xl border border-gray-100">
                        <Users className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-gray-400">Belum ada peminjam aktif</p>
                      </div>
                    )}


                  </div>
                </>
              )}

              <hr className="border-slate-100 my-8" />

              {/* Alur Penggunaan */}
              <div className="mb-8">
                <h4 className="text-[11px] font-bold text-emerald-800 tracking-widest uppercase mb-6">Alur Penggunaan (Auto-Gampang)</h4>
                <div className="relative border-l border-emerald-100 ml-3 space-y-8">
                  {[
                    {
                      title: 'Isi Form Request',
                      desc: 'Tinggal pencet "Request Akses", trus isi nama, kelompok KKN, dan nomor WA lo yang aktif.'
                    },
                    {
                      title: 'Tunggu Chat dari Admin',
                      desc: 'Tim HIMA-TI bakal gercep nge-chat ke WA lo buat ngasih akses aplikasi plus panduan cara pakenya.'
                    },
                    {
                      title: 'Langsung Gass Pake!',
                      desc: 'Gak usah pusing mikirin coding atau error server. Aplikasinya udah siap tempur buat bantu kelancaran proker KKN lo!'
                    }
                  ].map((step, idx) => (
                    <div key={idx} className="relative pl-6">
                      <div className="absolute -left-[11px] top-0 w-[22px] h-[22px] rounded-full bg-white border-2 border-emerald-200 flex items-center justify-center">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      </div>
                      <h5 className="font-bold text-wk-text-dark text-sm mb-1.5 leading-none">{step.title}</h5>
                      <p className="text-[13px] text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Bagikan halaman aset ini</p>
                <div className="flex items-center gap-3">
                  {/* WhatsApp */}
                  <a href={`https://api.whatsapp.com/send?text=Lihat ${encodeURIComponent(title)} di Inventaris IPTEK HIMA-TI! ${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-colors" aria-label="Bagikan ke WhatsApp">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  </a>
                  {/* Twitter / X */}
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Lihat ${encodeURIComponent(title)} di Inventaris IPTEK HIMA-TI!`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white flex items-center justify-center transition-colors" aria-label="Bagikan ke Twitter/X">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.15H5.059z"/></svg>
                  </a>
                  {/* Facebook */}
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-colors" aria-label="Bagikan ke Facebook">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  
                  {/* Native Share / Copy Link */}
                  <button onClick={async () => {
                    if (navigator.share) {
                      try {
                        await navigator.share({
                          title: title,
                          text: `Lihat ${title} di Inventaris IPTEK HIMA-TI!`,
                          url: window.location.href
                        });
                      } catch (err) {
                        console.error("Error sharing:", err);
                      }
                    } else {
                      handleShare();
                    }
                  }} className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer relative group" aria-label="Bagikan atau salin link">
                    {copied ? <Check className="w-4 h-4 text-emerald-600 group-hover:text-white" /> : <Share2 className="w-4 h-4" />}
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      {copied ? 'Tersalin!' : 'Share / Copy'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Pengunjung Terbaru */}
              <div className="mt-8 bg-blue-50/40 rounded-2xl p-6 border border-blue-100/60 flex flex-col items-center text-center relative overflow-hidden group hover:border-blue-200 transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100/30 rounded-bl-full pointer-events-none"></div>

                <div className="flex -space-x-3 mb-4 relative z-10">
                  <img className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-sm hover:-translate-y-1 transition-transform" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Budi&backgroundColor=e2e8f0" alt="User 1" loading="lazy" />
                  <img className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-sm hover:-translate-y-1 transition-transform" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Siti&backgroundColor=fef08a" alt="User 2" loading="lazy" />
                  <img className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-sm hover:-translate-y-1 transition-transform" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Joko&backgroundColor=bbf7d0" alt="User 3" loading="lazy" />
                  <img className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-sm hover:-translate-y-1 transition-transform" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rina&backgroundColor=fbcfe8" alt="User 4" loading="lazy" />
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="flex items-center gap-1.5 text-blue-950 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-[14px]">Terdapat {selectedAsset.requestCount || 0} Pengajuan Akses</span>
                  </div>
                  <p className="text-[12px] font-semibold text-blue-600/70">Bergabunglah dan kembangkan desamu!</p>
                </div>
              </div>

            </div>

          </div>

        </div>


        {/* Galeri Tampilan - Full Width Slider */}
        {images.length > 0 && (
          <div className="mt-8 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="font-bold text-wk-text-dark text-[17px]">Galeri Tampilan</h3>
              </div>
  
              {/* Nav Controls */}
              <div className="flex items-center gap-2">
                <button onClick={() => scrollSlider('left')} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 border border-gray-100 hover:border-emerald-200 transition-all cursor-pointer" aria-label="Geser galeri ke kiri">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => scrollSlider('right')} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 border border-gray-100 hover:border-emerald-200 transition-all cursor-pointer" aria-label="Geser galeri ke kanan">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div ref={sliderRef} className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
              <style>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {images.map((imgUrl, idx) => (
                <div key={idx} className="shrink-0 w-[280px] md:w-[420px] aspect-video bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm group cursor-pointer hover:border-emerald-200 transition-all duration-300 snap-center">
                  <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
          <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm animate-fade-in" onClick={() => setShowDemo(false)}></div>
          <div className="relative w-full max-w-5xl h-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-zoom-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Play className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-none">Live Demo: {title}</h3>
                  <p className="text-xs text-gray-500 font-semibold mt-1.5">{demoUrl}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDemo(false)}
                className="p-2 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                aria-label="Tutup demo"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 w-full bg-gray-100 relative">
              <iframe
                src={demoUrl}
                className="absolute inset-0 w-full h-full border-0"
                title={`Demo ${title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Request Access Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-fade-in" onClick={() => !isSubmitting && setShowRequestModal(false)}></div>
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl animate-slide-up max-h-[90vh] overflow-y-auto">
            {!session ? (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-5 border border-emerald-100">
                  <Lock className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold font-display text-gray-900 mb-2">Login Diperlukan</h3>
                <p className="text-sm text-gray-500 font-semibold mb-6 max-w-xs leading-relaxed">
                  Untuk mengajukan akses source code, kamu wajib masuk menggunakan email resmi UNIKU (<span className="text-emerald-600 font-bold">@uniku.ac.id</span>).
                </p>
                <button
                  onClick={async () => {
                    const { error } = await supabase.auth.signInWithOAuth({
                      provider: 'google',
                      options: {
                        redirectTo: window.location.href
                      }
                    });
                    if (error) alert('Gagal login: ' + error.message);
                  }}
                  className="w-full py-3.5 bg-white border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/20 text-gray-700 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 cursor-pointer group shadow-xs hover:shadow-sm"
                >
                  <svg className="w-5 h-5 shrink-0 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.626 5.626 0 0 1 8.24 13a5.626 5.626 0 0 1 5.751-5.6c1.554 0 2.942.58 4.025 1.547l3.14-3.14C19.167 3.864 16.035 2.6 12.24 2.6a10.4 10.4 0 0 0-10 10.4a10.4 10.4 0 0 0 10 10.4c5.772 0 10.375-4.148 10.375-10.4c0-.703-.064-1.38-.184-2.015H12.24Z"/>
                  </svg>
                  Masuk dengan Google
                </button>
              </div>
            ) : requestSuccess ? (
              <div className="p-8 text-center">
                <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-5">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold font-display text-gray-900 mb-2">Request Terkirim!</h3>
                <p className="text-sm text-gray-500 font-semibold mb-6 max-w-sm mx-auto leading-relaxed">
                  Pengajuan akses kamu sedang diproses. Mohon tunggu tim HIMA-TI menghubungi kamu lewat WhatsApp.
                </p>
                <button onClick={() => {
                  setRequestSuccess(false);
                  setShowRequestModal(false);
                }} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors cursor-pointer text-sm">
                  Mantap, Tutup!
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold font-display text-gray-900">Request Akses Source Code</h3>
                  <button onClick={() => setShowRequestModal(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors cursor-pointer" aria-label="Tutup modal">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  {/* Verified User Details */}
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between mb-5 shadow-xs">
                    <div className="flex items-center gap-3">
                      {session.user?.user_metadata?.avatar_url ? (
                        <img
                          src={session.user.user_metadata.avatar_url}
                          alt={session.user.user_metadata.full_name || 'User'}
                          className="w-9 h-9 rounded-full border border-emerald-400"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-800 text-sm">
                          {(session.user?.email || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-emerald-600 leading-none uppercase tracking-wider">Email Terverifikasi</p>
                        <p className="text-sm font-bold text-emerald-900 mt-1 leading-tight">{session.user?.user_metadata?.full_name || session.user?.email}</p>
                        <p className="text-[11px] text-emerald-700/80 font-semibold">{session.user?.email}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        await supabase.auth.signOut();
                      }}
                      className="text-xs font-bold text-red-500 hover:text-red-700 underline cursor-pointer bg-transparent border-0"
                    >
                      Logout
                    </button>
                  </div>
                  <form onSubmit={handleRequestSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Nama Lengkap / Kelompok KKN</label>
                      <input
                        required
                        type="text"
                        name="name"
                        placeholder="Contoh: Kelompok 12 / Andi"
                        className={`w-full px-4 py-3 bg-gray-50 border ${formErrors.name ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500'} rounded-xl focus:ring-2 transition-colors font-medium text-sm`}
                        value={requestData.name}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                      />
                      {formErrors.name && <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1.5"><Info className="w-3.5 h-3.5"/> {formErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Nomor WhatsApp</label>
                      <input
                        required
                        type="tel"
                        name="whatsapp"
                        minLength={9}
                        maxLength={15}
                        placeholder="Contoh: 08123456789 (Min. 9 digit)"
                        className={`w-full px-4 py-3 bg-gray-50 border ${formErrors.whatsapp ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500'} rounded-xl focus:ring-2 transition-colors font-medium text-sm`}
                        value={requestData.whatsapp}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                      />
                      {formErrors.whatsapp && <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1.5"><Info className="w-3.5 h-3.5"/> {formErrors.whatsapp}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Nama Desa Sasaran (Opsional)</label>
                      <input
                        type="text"
                        name="organization"
                        placeholder="Desa Suka Maju"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500 rounded-xl focus:ring-2 transition-colors font-medium text-sm"
                        value={requestData.organization}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Borrow Date Fields — Only for limited assets */}
                    {isLimited && (
                      <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-amber-600" />
                          <span className="text-xs font-bold text-amber-800">Periode Peminjaman (Wajib)</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-600 mb-1">Tanggal Mulai</label>
                            <DatePicker
                              selected={requestData.borrow_start_date ? new Date(requestData.borrow_start_date) : null}
                              onChange={(date) => {
                                const val = date ? date.toLocaleDateString('en-CA') : '';
                                setRequestData(prev => ({ ...prev, borrow_start_date: val }));
                                if (formErrors.borrow_start_date) validateField('borrow_start_date', val);
                              }}
                              excludeDateIntervals={excludedIntervals}
                              minDate={new Date()}
                              dateFormat="yyyy-MM-dd"
                              placeholderText="Pilih Tanggal"
                              className={`w-full px-3 py-2.5 bg-white border ${formErrors.borrow_start_date ? 'border-red-400' : 'border-gray-200 focus:border-emerald-500'} rounded-lg focus:ring-2 focus:ring-emerald-500/20 transition-colors font-medium text-sm`}
                            />
                            {formErrors.borrow_start_date && <p className="text-red-500 text-[10px] mt-1 font-medium">{formErrors.borrow_start_date}</p>}
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-600 mb-1">Tanggal Selesai</label>
                            <DatePicker
                              selected={requestData.borrow_end_date ? new Date(requestData.borrow_end_date) : null}
                              onChange={(date) => {
                                const val = date ? date.toLocaleDateString('en-CA') : '';
                                setRequestData(prev => ({ ...prev, borrow_end_date: val }));
                                if (formErrors.borrow_end_date) validateField('borrow_end_date', val);
                              }}
                              excludeDateIntervals={excludedIntervals}
                              minDate={requestData.borrow_start_date ? new Date(requestData.borrow_start_date) : new Date()}
                              dateFormat="yyyy-MM-dd"
                              placeholderText="Pilih Tanggal"
                              className={`w-full px-3 py-2.5 bg-white border ${formErrors.borrow_end_date ? 'border-red-400' : 'border-gray-200 focus:border-emerald-500'} rounded-lg focus:ring-2 focus:ring-emerald-500/20 transition-colors font-medium text-sm`}
                            />
                            {formErrors.borrow_end_date && <p className="text-red-500 text-[10px] mt-1 font-medium">{formErrors.borrow_end_date}</p>}
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Alasan Penggunaan</label>
                      <textarea
                        required
                        rows={3}
                        name="reason"
                        minLength={5}
                        placeholder="Tuliskan tujuan penggunaan aset ini... (Min. 5 karakter)"
                        className={`w-full px-4 py-3 bg-gray-50 border ${formErrors.reason ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500'} rounded-xl focus:ring-2 transition-colors font-medium text-sm resize-none`}
                        value={requestData.reason}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                      />
                      {formErrors.reason && <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1.5"><Info className="w-3.5 h-3.5"/> {formErrors.reason}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                    >
                      {isSubmitting ? 'Mengirim Data...' : 'Gass, Kirim Pengajuan!'} <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

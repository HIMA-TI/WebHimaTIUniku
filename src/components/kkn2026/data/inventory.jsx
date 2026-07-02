import { Globe, ShoppingCart, FileText, Gamepad2, Eye } from 'lucide-react';

export const inventoryItems = [
  {
    title: 'Web Profil Desa',
    desc: 'Bantu desa pamerin potensi wisata, profil aparatur, dan galeri kegiatannya ke dunia digital.',
    cat: 'Web & Sistem', type: 'web',
    icon: Globe,
    bgscColor: 'text-emerald-700/80', iconBg: 'bg-white', iconColor: 'text-emerald-500',
    techStack: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
    features: [
      'Halaman profil desa dengan foto & video',
      'Galeri kegiatan desa',
      'Struktur aparatur desa',
      'Kontak & alamat lengkap'
    ],
    bgColor: 'bg-emerald-50', textColor: 'text-emerald-900',
    steps: [
      { num: 1, title: 'Ambil Berkas Aplikasi', desc: 'Ajukan izin guna, dan kami akan memberikan akses ke berkas aplikasi.' },
      { num: 2, title: 'Sesuaikan Data Desa', desc: 'Ganti logo desa, nama instansi, profil kelompok KKN, dan konten utama di file konfigurasi.' },
      { num: 3, title: 'Upload ke Hosting', desc: 'Deploy ke layanan hosting gratis seperti Vercel, Netlify, atau GitHub Pages.' }
    ],
    repoUrl: 'https://github.com/HIMA-TI/web-profil-desa',
    guideUrl: '#',
    demoUrl: 'https://example.com',
    stats: { users: 15, generated: 0 },
    difficulty: 'Mudah',
    systemReq: 'Koneksi Internet Dasar, Browser PC/HP',
    isHot: true,
    isRecommended: false,
    developer: { name: 'Andi Saputra', role: 'Frontend Dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andi' },
    testimonial: { quote: 'Website ini membuat desa kami lebih dikenal luas dan mengundang wisatawan!', author: 'Kades Suka Maju' },
    changelog: [{ version: 'v1.1', desc: 'Penambahan fitur galeri dinamis' }, { version: 'v1.0', desc: 'Rilis perdana' }],
    faqs: [
      { q: 'Apakah hostingnya gratis?', a: 'Ya, Anda bisa menggunakan GitHub Pages atau Vercel secara gratis.' },
      { q: 'Bagaimana cara ganti logo?', a: 'Cukup timpa file logo.png di folder public/assets dengan logo desa Anda.' }
    ],
    decor: (
      <svg className="absolute top-4 right-4 w-20 h-20 text-emerald-200 opacity-40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="80" cy="20" r="10" /><circle cx="80" cy="20" r="20" /><circle cx="80" cy="20" r="30" />
      </svg>
    )
  },
  {
    title: 'Katalog UMKM Desa',
    desc: 'Platform buat warga jualan online, lengkap sama katalog produk dan link WhatsApp pengrajin.',
    cat: 'Web & Sistem', type: 'web',
    icon: ShoppingCart,
    bgColor: 'bg-emerald-600', textColor: 'text-white',
    descColor: 'text-emerald-50/80', iconBg: 'bg-emerald-500', iconColor: 'text-white',
    techStack: ['React', 'Tailwind CSS', 'Supabase'],
    features: [
      'Katalog produk dengan foto & harga',
      'Filter kategori UMKM',
      'Tombol langsung WhatsApp pengrajin',
      'Dashboard admin untuk CRUD produk'
    ],
    steps: [
      { num: 1, title: 'Ambil Berkas Aplikasi', desc: 'Ajukan izin guna, dan kami akan memberikan akses ke berkas aplikasi.' },
      { num: 2, title: 'Konfigurasi Database', desc: 'Atur koneksi database di file environment dan jalankan migrasi.' },
      { num: 3, title: 'Upload ke Hosting', desc: 'Deploy ke Vercel atau Railway, pastikan environment variables terisi.' }
    ],
    repoUrl: 'https://github.com/HIMA-TI/katalog-umkm-desa',
    guideUrl: '#',
    demoUrl: 'https://example.com',
    stats: { users: 8, generated: 450 },
    difficulty: 'Menengah',
    systemReq: 'Internet Stabil, Browser PC untuk Admin',
    isHot: false,
    isRecommended: true,
    developer: { name: 'Budi Wibowo', role: 'Fullstack Dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi' },
    testimonial: { quote: 'Penjualan kerajinan bambu warga naik pesat setelah ada katalog ini.', author: 'Ketua BUMDes' },
    changelog: [{ version: 'v2.0', desc: 'Migrasi ke Supabase untuk database' }, { version: 'v1.5', desc: 'Fitur tombol WhatsApp' }],
    faqs: [
      { q: 'Bagaimana admin menambah produk?', a: 'Admin bisa login ke dashboard /admin menggunakan akun default lalu klik Tambah Produk.' }
    ],
    decor: (
      <svg className="absolute top-4 right-4 w-24 h-12 text-emerald-500 opacity-50" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <path d="M 10 25 Q 25 10 40 25 T 70 25 T 100 25" /><path d="M 10 35 Q 25 20 40 35 T 70 35 T 100 35" opacity="0.5" />
      </svg>
    )
  },
  {
    title: 'Administrasi Surat',
    desc: 'Bikin urusan surat-menyurat di kantor desa jadi rapi dan gak ribet. Ada arsip digitalnya.',
    cat: 'Web & Sistem', type: 'web',
    icon: FileText,
    bgColor: 'bg-emerald-200', textColor: 'text-emerald-950',
    descColor: 'text-emerald-900/80', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700',
    techStack: ['PHP', 'MySQL', 'Tailwind CSS'],
    features: [
      'Template surat otomatis (izin, keterangan, pengantar)',
      'Arsip digital dengan pencarian',
      'Cetak surat langsung dari browser',
      'Manajemen pengguna (kades, sekdes, staf)'
    ],
    steps: [
      { num: 1, title: 'Ambil Berkas Aplikasi', desc: 'Ajukan izin guna, dan kami akan memberikan akses ke berkas aplikasi.' },
      { num: 2, title: 'Konfigurasi Database', desc: 'Import SQL dan atur koneksi database di file konfigurasi.' },
      { num: 3, title: 'Upload ke Hosting', desc: 'Hosting di penyedia yang support PHP & MySQL seperti Hostinger atau Idcloudhost.' }
    ],
    repoUrl: 'https://github.com/HIMA-TI/administrasi-surat-desa',
    guideUrl: '#',
    demoUrl: 'https://example.com',
    stats: { users: 12, generated: 1250 },
    difficulty: 'Menengah',
    systemReq: 'Shared Hosting PHP/MySQL, Printer',
    isHot: true,
    isRecommended: true,
    developer: { name: 'Citra Kirana', role: 'Backend Dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Citra' },
    testimonial: { quote: 'Dulu cari arsip surat lama butuh berjam-jam, sekarang tinggal ketik nama langsung ketemu.', author: 'Sekdes' },
    changelog: [{ version: 'v1.2', desc: 'Fitur cetak masal' }, { version: 'v1.0', desc: 'Rilis awal' }],
    faqs: [
      { q: 'Apakah bisa tambah template surat sendiri?', a: 'Bisa, melalui menu Pengaturan Surat oleh admin (Sekdes).' }
    ],
    decor: (
      <div className="absolute top-4 right-4 grid grid-cols-5 gap-2 opacity-35 text-emerald-400">
        {Array.from({ length: 15 }).map((_, idx) => (
          <div key={idx} className="w-1.5 h-1.5 rounded-full bg-current" />
        ))}
      </div>
    )
  },
  {
    title: 'Kuis Budaya Lokal',
    desc: 'Game kuis seru buat ngenalin budaya dan sejarah desa ke anak-anak. Cocok buat kegiatan posko.',
    cat: 'Game Edukasi', type: 'game',
    icon: Gamepad2,
    bgColor: 'bg-emerald-50', textColor: 'text-emerald-900',
    descColor: 'text-emerald-700/80', iconBg: 'bg-white', iconColor: 'text-emerald-500',
    techStack: ['JavaScript', 'HTML5', 'Canvas API'],
    features: [
      'Kuis interaktif dengan skor realtime',
      'Bank soal budaya & sejarah desa',
      'Leaderboard antar kelompok',
      'Mode multiplayer lokal'
    ],
    steps: [
      { num: 1, title: 'Ambil Berkas Aplikasi', desc: 'Ajukan izin guna, dan kami akan memberikan akses ke berkas aplikasi.' },
      { num: 2, title: 'Kostumaisasi Soal', desc: 'Edit bank soal di file JSON sesuai dengan konten desa sasaran.' },
      { num: 3, title: 'Upload ke Hosting', desc: 'Deploy ke Vercel, Netlify, atau GitHub Pages (static site).' }
    ],
    repoUrl: 'https://github.com/HIMA-TI/kuis-budaya-desa',
    guideUrl: '#',
    demoUrl: 'https://example.com',
    stats: { users: 20, generated: 0 },
    difficulty: 'Mudah',
    systemReq: 'Browser Modern, Proyektor (Opsional)',
    isHot: false,
    isRecommended: false,
    developer: { name: 'Dian Sastro', role: 'Game Dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dian' },
    testimonial: { quote: 'Anak-anak SD sangat antusias saat lomba kuis di posko KKN!', author: 'Guru SD' },
    changelog: [{ version: 'v1.1', desc: 'Tambah mode multiplayer lokal' }],
    faqs: [
      { q: 'Berapa maksimal soal?', a: 'Tidak ada batasan, soal dimuat dari array JSON.' }
    ],
    decor: (
      <svg className="absolute top-4 right-4 w-20 h-20 text-emerald-200 opacity-40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="80" cy="20" r="10" /><circle cx="80" cy="20" r="20" /><circle cx="80" cy="20" r="30" />
      </svg>
    )
  },
  {
    title: 'Simulasi Tani Cerdas',
    desc: 'Game simulasi pertanian yang ngajarin teknik tanam modern. Belajar sambil main, seru banget.',
    cat: 'Game Edukasi', type: 'game',
    icon: Gamepad2,
    bgColor: 'bg-emerald-600', textColor: 'text-white',
    descColor: 'text-emerald-50/80', iconBg: 'bg-emerald-500', iconColor: 'text-white',
    techStack: ['Phaser.js', 'JavaScript', 'Tiled'],
    features: [
      'Simulasi tanam & panen real-time',
      'Teknik pertanian modern & tradisional',
      'Misi harian dengan reward',
      'Laporan hasil panen'
    ],
    steps: [
      { num: 1, title: 'Ambil Berkas Aplikasi', desc: 'Ajukan izin guna, dan kami akan memberikan akses ke berkas aplikasi.' },
      { num: 2, title: 'Sesuaikan Map', desc: 'Ganti tilemap sesuai dengan kondisi geografis desa sasaran.' },
      { num: 3, title: 'Upload ke Hosting', desc: 'Deploy ke Vercel, Netlify, atau GitHub Pages (static site).' }
    ],
    repoUrl: 'https://github.com/HIMA-TI/simulasi-tani-cerdas',
    guideUrl: '#',
    demoUrl: 'https://example.com',
    stats: { users: 7, generated: 0 },
    difficulty: 'Sulit',
    systemReq: 'Browser dengan akselerasi GPU (WebGL)',
    isHot: true,
    isRecommended: false,
    developer: { name: 'Eko Patrio', role: 'Game Dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eko' },
    testimonial: { quote: 'Simulasi ini membantu pemuda desa memahami sistem irigasi tetes.', author: 'Ketua Karang Taruna' },
    changelog: [{ version: 'v1.0', desc: 'Rilis awal dengan 3 jenis tanaman' }],
    faqs: [
      { q: 'Bisa dimainkan offline?', a: 'Ya, bisa dibuild jadi PWA agar bisa dimainkan tanpa internet.' }
    ],
    decor: (
      <svg className="absolute top-4 right-4 w-24 h-12 text-emerald-500 opacity-50" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <path d="M 10 25 Q 25 10 40 25 T 70 25 T 100 25" /><path d="M 10 35 Q 25 20 40 35 T 70 35 T 100 35" opacity="0.5" />
      </svg>
    )
  },
  {
    title: 'AR Peta Wisata',
    desc: 'Arahin kamera HP ke brosur desa, langsung muncul peta wisata 3D. Warga dan turis pasti suka.',
    cat: 'Inovasi AR', type: 'ar',
    icon: Eye,
    bgColor: 'bg-emerald-50', textColor: 'text-emerald-900',
    descColor: 'text-emerald-700/80', iconBg: 'bg-white', iconColor: 'text-emerald-500',
    techStack: ['AR.js', 'A-Frame', 'JavaScript'],
    features: [
      'Marker-based AR dengan brosur desa',
      'Peta interaktif 3D',
      'Info wisata muncul otomatis',
      'Kompatibel HP Android & iOS'
    ],
    steps: [
      { num: 1, title: 'Ambil Berkas Aplikasi', desc: 'Ajukan izin guna, dan kami akan memberikan akses ke berkas aplikasi.' },
      { num: 2, title: 'Siapkan Marker', desc: 'Cetak marker pattern yang akan dikirim bersama berkas aplikasi.' },
      { num: 3, title: 'Upload ke Hosting', desc: 'Deploy ke Vercel atau Netlify (wajib HTTPS untuk akses kamera).' }
    ],
    repoUrl: 'https://github.com/HIMA-TI/ar-peta-wisata',
    guideUrl: '#',
    demoUrl: 'https://example.com',
    stats: { users: 4, generated: 0 },
    difficulty: 'Menengah',
    systemReq: 'Kamera HP, Dukungan WebGL/AR',
    isHot: false,
    isRecommended: true,
    developer: { name: 'Fina Phillipe', role: 'AR/VR Dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fina' },
    testimonial: { quote: 'Wisatawan sangat terkesan saat melihat brosur wisata desa kami jadi hidup 3D.', author: 'Pengelola Desa Wisata' },
    changelog: [{ version: 'v1.1', desc: 'Perbaikan deteksi marker yang lebih stabil' }],
    faqs: [
      { q: 'Apakah butuh install aplikasi?', a: 'Tidak, AR berjalan langsung dari web browser (WebAR).' }
    ],
    decor: (
      <svg className="absolute top-4 right-4 w-20 h-20 text-emerald-200 opacity-40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="80" cy="20" r="10" /><circle cx="80" cy="20" r="20" /><circle cx="80" cy="20" r="30" />
      </svg>
    )
  },
  {
    title: 'AR Flora & Fauna',
    desc: 'Scan gambar di poster edukasi, model 3D hewan dan tumbuhan endemik desa langsung nongol.',
    cat: 'Inovasi AR', type: 'ar',
    icon: Eye,
    bgColor: 'bg-emerald-200', textColor: 'text-emerald-950',
    descColor: 'text-emerald-900/80', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700',
    techStack: ['Unity', 'Vuforia', 'C#'],
    features: [
      'Scan poster dengan HP',
      'Model 3D flora & fauna endemik',
      'Info detail setiap spesies',
      'Cocok untuk edukasi anak SD'
    ],
    steps: [
      { num: 1, title: 'Ambil Berkas Aplikasi', desc: 'Clone repositori dari GitHub untuk mendapatkan project Unity.' },
      { num: 2, title: 'Build APK', desc: 'Buka project di Unity, atur license key Vuforia, dan build APK.' },
      { num: 3, title: 'Instal di HP', desc: 'Kirim file APK ke HP Android dan instal langsung.' }
    ],
    repoUrl: 'https://github.com/HIMA-TI/ar-flora-fauna',
    guideUrl: '#',
    demoUrl: 'https://example.com',
    stats: { users: 2, generated: 0 },
    difficulty: 'Sulit',
    systemReq: 'HP Android (Min RAM 3GB), Aplikasi APK',
    isHot: false,
    isRecommended: false,
    developer: { name: 'Gilang Dirga', role: 'Unity Dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gilang' },
    testimonial: { quote: 'Media pembelajaran biologi yang sangat revolusioner untuk sekolah.', author: 'Kepala Sekolah SMP' },
    changelog: [{ version: 'v1.0', desc: 'Rilis 5 model flora/fauna' }],
    faqs: [
      { q: 'Ada versi iOS?', a: 'Saat ini hanya tersedia build APK untuk Android.' }
    ],
    decor: (
      <div className="absolute top-4 right-4 grid grid-cols-5 gap-2 opacity-35 text-emerald-400">
        {Array.from({ length: 15 }).map((_, idx) => (
          <div key={idx} className="w-1.5 h-1.5 rounded-full bg-current" />
        ))}
      </div>
    )
  }
];

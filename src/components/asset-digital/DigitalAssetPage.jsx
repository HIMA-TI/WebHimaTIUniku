import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Search, ArrowLeft, Gamepad2, Eye, Smartphone, Camera, ExternalLink, BookOpen, ChevronRight } from 'lucide-react';
import useDigitalAssets from '../../hooks/useDigitalAssets';

const FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: 'ar', label: 'Inovasi AR' },
  { key: 'game', label: 'Game Edukasi' },
  { key: 'web', label: 'Web & Sistem' },
];

const CAT_BADGE = {
  ar: 'bg-violet-100 text-violet-700',
  game: 'bg-amber-100 text-amber-700',
  web: 'bg-sky-100 text-sky-700',
};

function typeColors(type) {
  switch (type) {
    case 'ar': return {
      bg: 'from-violet-500/20 via-fuchsia-500/10',
      iconBox: 'bg-violet-500/20 text-violet-400',
      iconBoxLight: 'bg-violet-100 text-violet-600',
      badge: CAT_BADGE.ar,
      dot: 'bg-violet-500',
      stepNum: 'bg-violet-100 text-violet-700',
    };
    case 'game': return {
      bg: 'from-amber-500/20 via-orange-500/10',
      iconBox: 'bg-amber-500/20 text-amber-400',
      iconBoxLight: 'bg-amber-100 text-amber-600',
      badge: CAT_BADGE.game,
      dot: 'bg-amber-500',
      stepNum: 'bg-amber-100 text-amber-700',
    };
    default: return {
      bg: 'from-sky-500/20 via-cyan-500/10',
      iconBox: 'bg-sky-500/20 text-sky-400',
      iconBoxLight: 'bg-sky-100 text-sky-600',
      badge: CAT_BADGE.web,
      dot: 'bg-sky-500',
      stepNum: 'bg-sky-100 text-sky-700',
    };
  }
}

const ICON_MAP = { Eye, Smartphone, Gamepad2, Camera };

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[–—]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function DigitalAssetPage() {
  const { slug } = useParams();
  const { digitalAssets, loading } = useDigitalAssets();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-neutral-400 mt-4 font-medium">Memuat aset digital...</p>
      </div>
    );
  }

  if (slug) {
    const asset = digitalAssets.find((item) => slugify(item.title) === slug);
    if (!asset) {
      return <NotFound />;
    }
    return <AssetDetailPage asset={asset} digitalAssets={digitalAssets} />;
  }

  return <AssetIndex digitalAssets={digitalAssets} />;
}

function AssetIndex({ digitalAssets }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return digitalAssets.filter((item) => {
      const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.cat.toLowerCase().includes(q) ||
        item.techStack.some((t) => t.toLowerCase().includes(q));
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white antialiased">
      <header className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            HIMA TI Universitas Kuningan
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Aset{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Digital
            </span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Perpustakaan aplikasi, game edukasi, AR, dan sistem web open-source hasil karya Divisi IPTEK HIMA TI.
          </p>

          <div className="relative max-w-md mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              type="text"
              placeholder="Cari aset digital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all"
            />
          </div>
        </div>
      </header>

      <div className="sticky top-0 z-30 bg-neutral-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === f.key
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-neutral-500" />
            </div>
            <p className="text-lg font-medium text-neutral-300">Tidak ada aset ditemukan</p>
            <p className="text-neutral-500 mt-1">Coba ubah kata kunci atau filter kategori</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-8">
            {filteredItems.map((item, idx) => (
              <IndexCard key={item.title} item={item} index={idx} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function IndexCard({ item, index }) {
  const IconComp = ICON_MAP[item.icon.displayName || item.icon.name] || Gamepad2;
  const tc = typeColors(item.type);
  const slug = slugify(item.title);

  return (
    <Link
      to={`/asset-digital/${slug}`}
      className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:border-emerald-500/30 hover:bg-white/[0.05] transition-all duration-300"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${tc.iconBox}`}>
          <IconComp className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-base leading-snug truncate group-hover:text-emerald-400 transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-neutral-500 line-clamp-2 mt-1">{item.desc}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${tc.badge}`}>
              {item.cat}
            </span>
            <span className="text-xs text-neutral-600">{item.features.length} fitur</span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-emerald-400 transition-colors shrink-0 mt-3" />
      </div>
    </Link>
  );
}

function AssetDetailPage({ asset, digitalAssets }) {
  const IconComp = ICON_MAP[asset.icon?.displayName || asset.icon?.name || 'Gamepad2'] || Gamepad2;
  const tc = typeColors(asset.type);

  const related = useMemo(() => {
    return digitalAssets
      .filter((item) => item.type === asset.type && item.title !== asset.title)
      .slice(0, 3);
  }, [asset, digitalAssets]);

  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      <div className="relative h-[50vh] min-h-[320px] max-h-[560px] overflow-hidden bg-neutral-100">
        <img
          src={asset.image}
          alt={asset.title}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${tc.bg} to-transparent`} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />

        <Link
          to="/asset-digital"
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 backdrop-blur-sm text-neutral-700 font-medium shadow-lg hover:bg-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-neutral-200/50 p-6 sm:p-8 lg:p-10">
          <div className="flex items-start gap-4 mb-6">
            <div className={`shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center ${tc.iconBoxLight} shadow-sm`}>
              <IconComp className="w-8 h-8" />
            </div>
            <div className="min-w-0">
              <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold mb-2 ${tc.badge}`}>
                {asset.cat}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight">
                {asset.title}
              </h1>
            </div>
          </div>

          <p className="text-neutral-600 text-base sm:text-lg leading-relaxed mb-10">
            {asset.desc}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-8">
              <section>
                <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">Tech Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {asset.techStack.map((tech) => (
                    <span key={tech} className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-700 text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">Fitur</h2>
                <ul className="space-y-2.5">
                  {asset.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-neutral-700 text-sm">
                      <div className={`shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 ${tc.dot}`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">Cara Menggunakan</h2>
                <div className="space-y-4">
                  {asset.steps.map((step) => (
                    <div key={step.num} className="flex gap-4">
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${tc.stepNum}`}>
                        {step.num}
                      </div>
                      <div>
                        <p className="text-neutral-900 font-medium text-sm">{step.title}</p>
                        <p className="text-neutral-500 text-sm mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <a
                  href={asset.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ajukan Aset Ini
                </a>
                <a
                  href={asset.guideUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  Baca Buku Panduan
                </a>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-12 mb-24">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">Aset Terkait</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((item) => (
                <Link
                  key={item.title}
                  to={`/asset-digital/${slugify(item.title)}`}
                  className="group bg-white rounded-xl border border-neutral-200/60 p-5 hover:border-emerald-300 hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold text-sm text-neutral-900 group-hover:text-emerald-600 transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{item.desc}</p>
                  <span className={`inline-block mt-3 px-2 py-0.5 rounded text-xs font-medium ${CAT_BADGE[item.type]}`}>
                    {item.cat}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased flex flex-col items-center justify-center">
      <p className="text-6xl font-bold text-neutral-200 mb-4">404</p>
      <p className="text-lg text-neutral-500 mb-6">Aset tidak ditemukan</p>
      <Link
        to="/asset-digital"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Aset Digital
      </Link>
    </div>
  );
}

import { useState } from 'react';
import { Search, X, ArrowUpRight, LayoutGrid, List, Flame, ThumbsUp, Star } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const techIcons = {
  'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
  'Tailwind CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
  'Supabase': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg',
  'HTML': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
  'HTML5': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
  'CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg',
  'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
  'Bootstrap': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg',
  'PHP': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg',
  'MySQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg',
  'Unity': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unity/unity-original.svg',
  'C#': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg'
};

// Dynamic categories will be generated in the component
export default function AssetShowcase({ onSelectAsset, digitalAssets = [], loading }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('default');

  const staticCategories = [
    { id: 'all', label: 'Semua Aset' },
    { id: 'web', label: 'Web & Sistem Desa' },
    { id: 'game', label: 'Game Edukasi' },
    { id: 'ar', label: 'Inovasi AR' },
  ];

  const dynamicCategories = digitalAssets.length > 0 ? [
    { id: 'all', label: 'Semua Aset' },
    ...Array.from(new Set(digitalAssets.map(item => item.cat))).filter(Boolean).map(cat => {
      return { id: cat, label: cat };
    })
  ] : staticCategories;

  let filteredItems = digitalAssets.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.cat === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q
      || item.title.toLowerCase().includes(q)
      || item.desc.toLowerCase().includes(q)
      || item.cat.toLowerCase().includes(q)
      || item.techStack.some((t) => t.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  if (sortBy === 'popular') {
    filteredItems.sort((a, b) => (b.stats?.users || 0) - (a.stats?.users || 0));
  } else if (sortBy === 'easy') {
    const order = { 'Mudah': 1, 'Menengah': 2, 'Sulit': 3 };
    filteredItems.sort((a, b) => (order[a.difficulty] || 99) - (order[b.difficulty] || 99));
  }

  return (
    <section id="kkn-showcase" className="bg-white border-b border-gray-100 py-28 animate-fade-in">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4 font-display">
            Pilih <span className="text-emerald-600 font-display italic">Aset Digital</span> Terbaik
          </h2>
          <p className="text-gray-500 font-semibold text-lg">Pilih aset digital yang sesuai dengan kebutuhanmu, semua siap pakai tinggal ajukan izin guna!</p>
        </div>

        {/* Search + Filter */}
        <div className="max-w-2xl mx-auto mb-12 space-y-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari aset digital berdasarkan nama, deskripsi, atau teknologi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {dynamicCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2 rounded-full font-bold text-sm transition-all duration-300 border cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-emerald-600 text-white shadow-md border-emerald-600'
                      : 'bg-white text-gray-600 hover:text-emerald-600 shadow-xs border-gray-100 hover:border-emerald-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            

          </div>
        </div>

        {/* Results count */}
        <p className="text-center text-sm text-gray-400 font-semibold mb-8">
          {filteredItems.length} aset ditemukan
        </p>

        {/* Grid/List */}
        {loading ? (
          <div className={`grid gap-8 max-w-6xl mx-auto w-full ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="relative overflow-hidden rounded-[2rem] p-8 min-h-[19rem] flex flex-col justify-between shadow-sm bg-gray-50 border border-gray-100 animate-pulse">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gray-200"></div>
                </div>
                <div className="mt-auto">
                  <div className="w-20 h-5 bg-gray-200 rounded-full mb-3"></div>
                  <div className="w-3/4 h-6 bg-gray-200 rounded-md mb-2"></div>
                  <div className="w-full h-4 bg-gray-200 rounded-md mb-1"></div>
                  <div className="w-5/6 h-4 bg-gray-200 rounded-md mb-6"></div>
                  <div className="w-full h-10 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`grid gap-8 max-w-6xl mx-auto w-full ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredItems.map((item) => {
              const IconComponent = typeof item.icon === 'string' && LucideIcons[item.icon] ? LucideIcons[item.icon] : LayoutGrid;
              const isSolid = item.bgColor === 'bg-emerald-600';
            
            if (viewMode === 'list') {
              return (
                <div key={item.title} className={`relative overflow-hidden rounded-[2rem] p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ${item.bgColor} ${item.textColor} border border-transparent hover:border-emerald-200/50`}>


                  <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center ${item.iconBg} ${item.iconColor} shadow-xs`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`px-2.5 py-0.5 font-bold text-[10px] uppercase tracking-wider rounded-full border ${isSolid ? 'bg-emerald-500/20 text-emerald-100 border-emerald-500/35' : 'bg-white/60 text-emerald-800 border-emerald-100/80'}`}>
                        {item.cat}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-bold"><Star className="w-3 h-3" /> {item.difficulty}</span>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight mb-2">{item.title}</h3>
                    <p className={`text-sm font-semibold leading-relaxed max-w-xl ${item.descColor}`}>{item.desc}</p>
                  </div>
                  <button
                    onClick={() => onSelectAsset(item)}
                    className={`shrink-0 px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      isSolid ? 'bg-white text-emerald-900 hover:bg-emerald-50 hover:shadow' : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow'
                    }`}
                  >
                    Lihat Detail <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              );
            }

            return (
              <div
                key={item.title}
                className={`relative overflow-hidden rounded-[2rem] p-8 min-h-[19rem] flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-350 ${item.bgColor} ${item.textColor} group`}
              >
                {item.decor}
                


                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.iconBg} ${item.iconColor} shadow-xs relative z-10`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>
                  
                  {/* Quick Preview Hover Effect (Background Dim) */}
                  <div className={`absolute inset-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10 backdrop-blur-sm ${isSolid ? 'bg-emerald-700/90' : 'bg-emerald-50/90'}`}>
                  </div>
                </div>

                <div className="mt-auto relative z-20">
                  <span className={`inline-block px-3 py-1 font-bold text-xs rounded-full border mb-3 ${
                    isSolid
                      ? 'bg-emerald-500/20 text-emerald-100 border-emerald-500/35'
                      : 'bg-white/60 text-emerald-800 border-emerald-100/80'
                  }`}>
                    {item.cat}
                  </span>
                  <h3 className="text-xl font-bold tracking-tight mb-2 group-hover:-translate-y-2 transition-transform duration-300">{item.title}</h3>
                  <div className="relative mb-6 min-h-[4.5rem]">
                    <p className={`text-sm font-semibold leading-relaxed group-hover:opacity-0 transition-opacity duration-300 ${item.descColor}`}>{item.desc}</p>
                    
                    {/* Tech Stack Hover */}
                    <div className="absolute inset-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col justify-start">
                      <h4 className={`font-bold text-xs mb-2 ${isSolid ? 'text-emerald-100' : 'text-emerald-900'}`}>Teknologi:</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {item.techStack.map(tech => (
                          <span key={tech} className={`px-2 py-1 rounded-md text-[10px] font-bold border flex items-center gap-1 ${isSolid ? 'border-emerald-500/30 text-emerald-100 bg-emerald-600/50' : 'border-emerald-200 text-emerald-800 bg-white/50'}`}>
                            {techIcons[tech] && <img src={techIcons[tech]} alt={tech} className="w-3 h-3 object-contain" />}
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onSelectAsset(item)}
                    className={`w-full py-2.5 rounded-full font-bold text-sm shadow-sm transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSolid
                        ? 'bg-white text-emerald-900 hover:bg-emerald-50 hover:shadow'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow'
                    }`}
                  >
                    Lihat Detail <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-600 mb-1">Aset tidak ditemukan</h3>
            <p className="text-sm text-gray-400 font-semibold">Coba ubah kata kunci atau filter kategori</p>
          </div>
        )}
      </div>
    </section>
  );
}

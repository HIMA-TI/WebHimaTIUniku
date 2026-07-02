import logo from '../../../assets/logo1.png';

export default function KKNFooter() {
  return (
    <footer className="w-full bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-3">
            <img src={logo} alt="HIMA TI UNIKU" className="w-10 h-10 object-contain" />
            <div>
              <h4 className="font-extrabold text-wk-text-dark text-lg">HIMA TI UNIKU</h4>
              <p className="text-emerald-600 font-bold text-sm">Divisi IPTEK</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-gray-500">
            <a href="https://instagram.com/hima.ti.uniku" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors">Instagram</a>
            <a href="https://github.com/HIMA-TI" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors">GitHub</a>
            <a href="/" className="hover:text-emerald-600 transition-colors">Official Web</a>
          </div>
        </div>
        <div className="text-center pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-400 font-semibold">
            &copy; {new Date().getFullYear()} Himpunan Mahasiswa Teknik Informatika UNIKU. Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}

# Design Specification: HIMA TI KKN 2026 Digital Showcase

## 1. Core Concept & Methodology
- **Framework:** Tailwind CSS SANGAT KETAT (Gunakan utility classes semaksimal mungkin).
- **Design Style:** Playful Organic EdTech (Persis seperti referensi "WonderKids"). 
  - Kunci utamanya adalah desain yang ceria, organik, dan *flat* (tanpa shadow yang berat).
  - Elemen wajib: *Organic blobs* (bentuk tidak beraturan) sebagai *background*, *hand-drawn SVG accents* (coretan pensil, lingkaran melingkari teks, panah melengkung), dan *decorative patterns* di dalam kartu (concentric circles, dot grids, gelombang).
- **Color Palette (HIMA TI mapping from reference):**
  - **Background:** Putih bersih (#FFFFFF).
  - **Primary/Accent 1:** HIMA Green (Menggantikan warna Ungu di referensi).
  - **Accent 2:** HIMA Yellow (Sama seperti referensi).
  - **Soft Backgrounds:** Light HIMA Green (hijau pastel/pudar) untuk background kartu.
- **Typography Rule (CRITICAL):** 
  - Harus menggunakan DUA jenis *font* yang kontras.
  - **Heading & Body:** Font Sans-Serif membulat yang ramah (misal: `font-nunito` atau `font-quicksand`).
  - **Highlight Text:** Font tegak bersambung / *Handwriting* (misal: `font-caveat` atau `font-pacifico`) untuk kata-kata kunci agar terlihat dinamis dan ceria (persis seperti kata "learn" dan "play" di referensi).

## 2. Copywriting Voice & Tone
- **Persona:** Divisi IPTEK HIMA TI yang ceria, kolaboratif, dan merakyat.
- **Tone:** Sangat bersahabat, kasual, mengundang antusiasme ("Kamu", "Kita").

## 3. Section Breakdown & Exact Layout Replication

### Section 1: Hero (The Playful Hero)
- **Visual:** Tiru *layout* gambar. Teks di tengah/kiri, dengan gambar orang/aset melayang di sekitar. Gunakan elemen *hand-drawn circle* SANGAT TEPAT melingkari kata highlight. Ada garis lengkung (*scribble*) melayang di sekitarnya.
- **Headline:** Tempat terbaik cari <span class="font-handwriting text-hima-green relative">Inovasi <svg-circle-here></span> dan <span class="font-handwriting text-hima-yellow">Proker</span> buat KKN.
- **Sub-headline:** Temukan berbagai aset digital interaktif dari Divisi IPTEK untuk mendukung pertumbuhan dan digitalisasi desa sasaranmu.
- **CTA Button:** Pill-shaped (sudut membulat penuh `rounded-full`), solid HIMA Green, dengan ikon kecil (panah).

### Section 2: Features (The Interactive Cards)
- **Visual:** Persis seperti bagian "Our interactive features". 
- **Layout:** Judul di kiri/atas. Deretan 3 kartu kotak dengan sudut melengkung ekstrem (`rounded-3xl` atau `rounded-[2rem]`).
- **Cards Content:** 
  - Kartu 1 (Background Hijau Pastel): Isi teks, ikon di pojok kiri atas, dan dekorasi *concentric circles* (lingkaran seperti target) terpotong di pojok kanan atas.
  - Kartu 2 (Background Solid HIMA Green): Teks putih, dekorasi garis bergelombang (*wavy shapes*) di pojok.
  - Kartu 3 (Background Solid HIMA Yellow): Teks hitam/gelap, dekorasi *dot grid* di sisi kanan.

### Section 3: Value Proposition / Info (The Solid Banner)
- **Visual:** Persis seperti bagian background ungu dengan foto bulat di referensi.
- **Layout:** Latar belakang *full-width* solid HIMA Green. Teks putih besar bertuliskan visi proker KKN. Di bawahnya, avatar/ikon produk digital dalam lingkaran berjejer horizontal.

### Section 4: Showcase Catalog (The Blog Section)
- **Visual:** Persis seperti bagian "Read our blog". Kartu putih dengan border tipis atau shadow *sangat* tipis di atas latar belakang putih/abu-abu super terang. Sudut membulat.
import { useState, useRef } from 'react';

export default function ImageUpload({ value, onChange, disabled = false }) {
  const inputRef = useRef(null);
  const [warning, setWarning] = useState('');

  const handleFile = (e) => {
    if (disabled) return;

    const file = e.target.files[0];
    if (!file) return;

    setWarning('');

    if (!file.type.startsWith('image/')) {
      setWarning('File harus berupa gambar');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setWarning('Ukuran file melebihi 2MB. Gambar tetap akan digunakan tetapi dapat memperlambat penyimpanan.');
    }

    onChange(file);
  };

  const previewUrl = value instanceof File ? URL.createObjectURL(value) : value;

  return (
    <div>
      {value ? (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-xl border border-green-200"
          />
          <button
            type="button"
            onClick={() => {
              if (disabled) return;
              onChange('');
              if (inputRef.current) inputRef.current.value = '';
            }}
            disabled={disabled}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="w-full h-48 border-2 border-dashed border-green-300 rounded-xl flex flex-col items-center justify-center text-green-500 hover:border-green-500 hover:text-green-600 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5A1.5 1.5 0 003.75 21z" />
          </svg>
          <span className="text-sm font-medium">Klik untuk upload gambar</span>
          <span className="text-xs text-green-400 mt-1">Maks 2MB</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        disabled={disabled}
        onChange={handleFile}
        className="hidden"
      />
      {warning && (
        <p className="text-amber-600 text-xs mt-2">{warning}</p>
      )}
    </div>
  );
}

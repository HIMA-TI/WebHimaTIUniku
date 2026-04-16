import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'himati_aspirasi';

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsDataURL(file);
  });
}

// Mock API Call - Get Aspirations (Admin)
export async function fetchAspirasi() {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return resolve([]);
        const parsed = JSON.parse(raw);
        resolve(parsed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch {
        resolve([]);
      }
    }, 400); // Simulate network
  });
}

// Mock API Call - Internal Save
async function saveAspirasi(aspirasiList) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(aspirasiList));
}

export default function useAspirasi() {
  const [aspirasi, setAspirasi] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await fetchAspirasi();
    setAspirasi(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Mock API Call - Post Aspirasi (Client)
  const addAspirasi = useCallback(async (data) => {
    const current = await fetchAspirasi();

    let lampiran;
    if (data.lampiran instanceof File) {
      try {
        const dataUrl = await fileToDataUrl(data.lampiran);
        lampiran = {
          name: data.lampiran.name,
          type: data.lampiran.type,
          size: data.lampiran.size,
          dataUrl,
        };
      } catch {
        lampiran = undefined;
      }
    }

    const newAspirasi = {
      id: crypto.randomUUID(),
      nama: data.nama,
      kategori: data.kategori,
      topik: data.topik,
      judul: data.judul,
      pesan: data.pesan,
      lampiran,
      status: 'Menunggu', // Default status
      createdAt: new Date().toISOString(),
    };
    const updated = [newAspirasi, ...current];
    await saveAspirasi(updated);
    setAspirasi(updated);
    return newAspirasi;
  }, []);

  // Mock API Call - Delete Aspirasi (Admin)
  const deleteAspirasi = useCallback(async (id) => {
    const current = await fetchAspirasi();
    const filtered = current.filter((p) => p.id !== id);
    await saveAspirasi(filtered);
    setAspirasi(filtered);
  }, []);

  // Mock API Call - CSV Export Helper (Admin)
  const exportCsv = useCallback(async () => {
    const current = await fetchAspirasi();
    if (current.length === 0) return;

    const sanitize = (value) =>
      String(value ?? '-')
        .replace(/(\r\n|\n|\v)/g, ' ')
        .replace(/,/g, ';');

    // Build CSV content
    const header = ['ID', 'Nama', 'Kategori', 'Topik', 'Judul', 'Pesan', 'Lampiran', 'Status', 'Tanggal'];
    const rows = current.map((item) => [
      sanitize(item.id),
      sanitize(item.nama),
      sanitize(item.kategori),
      sanitize(item.topik),
      sanitize(item.judul),
      sanitize(item.pesan),
      sanitize(item.lampiran?.name),
      sanitize(item.status),
      sanitize(new Date(item.createdAt).toLocaleString()),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + header.join(",") + "\n" + rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data_Aspirasi_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, []);

  return { aspirasi, loading, addAspirasi, deleteAspirasi, exportCsv, refresh: loadData };
}

import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'himati_aspirasi';

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
    const newAspirasi = {
      id: crypto.randomUUID(),
      nim: data.nim,
      nama: data.nama,
      angkatan: data.angkatan,
      kelas: data.kelas,
      judul: data.judul,
      pesan: data.pesan,
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

    // Build CSV content
    const header = ['ID', 'NIM', 'Nama', 'Angkatan', 'Kelas', 'Judul', 'Pesan', 'Status', 'Tanggal'];
    const rows = current.map(item => [
      item.id,
      item.nim,
      item.nama,
      item.angkatan || '-',
      item.kelas || '-',
      item.judul, // Escape commas in string fields if necessary
      item.pesan.replace(/(\r\n|\n|\v)/g, ' ').replace(/,/g, ';'), 
      item.status,
      new Date(item.createdAt).toLocaleString()
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," + header.join(",") + "\n"
        + rows.map(e => e.join(",")).join("\n");
        
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

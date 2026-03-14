import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'himati_pesan_kontak';

export async function fetchPesan() {
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
    }, 300); // Simulate network
  });
}

async function savePesan(pesanList) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pesanList));
}

export default function usePesan() {
  const [pesanList, setPesanList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await fetchPesan();
    setPesanList(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Mock API Call - Post Pesan (Client)
  const addPesan = useCallback(async (data) => {
    const current = await fetchPesan();
    const newPesan = {
      id: crypto.randomUUID(),
      nama: data.nama,
      email: data.email,
      pesan: data.pesan,
      createdAt: new Date().toISOString(),
    };
    const updated = [newPesan, ...current];
    await savePesan(updated);
    setPesanList(updated);
    return newPesan;
  }, []);

  // Mock API Call - Delete Pesan (Admin)
  const deletePesan = useCallback(async (id) => {
    const current = await fetchPesan();
    const filtered = current.filter((p) => p.id !== id);
    await savePesan(filtered);
    setPesanList(filtered);
  }, []);

  return { pesanList, loading, addPesan, deletePesan, refresh: loadData };
}

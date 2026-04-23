import { useState, useCallback, useEffect } from 'react';
import { apiUrl } from '../config/api';

const AUTH_KEY = 'himati_auth';

function getAuthToken() {
  // Prefer active session token; keep localStorage fallback for backward compatibility.
  return sessionStorage.getItem(AUTH_KEY) || localStorage.getItem('himati_token') || '';
}

// Real API Call - Get Aspirations (Admin)
export async function fetchAspirasi() {
  try {
    const token = getAuthToken();
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const res = await fetch(apiUrl('/aspiration'), { headers });
    if (!res.ok) throw new Error('Failed to fetch aspirasi');
    const data = await res.json();

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.result)) return data.result;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.data?.items)) return data.data.items;
    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default function useAspirasi() {
  const [aspirasi, setAspirasi] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setAspirasi([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await fetchAspirasi();
    setAspirasi(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Real API Call - Post Aspirasi (Client)
  const addAspirasi = useCallback(async (data) => {
    try {
      const formData = new FormData();
      
      if (data.nama) formData.append('name', data.nama);
      
      // Combine topik and judul into topic since backend only has topic
      const combinedTopic = data.judul ? `[${data.topik}] ${data.judul}` : data.topik;
      formData.append('topic', combinedTopic);
      
      formData.append('description', data.pesan);
      formData.append('category', data.kategori);
      // Hardcode urgency to 2 (medium) since UI doesn't have it
      formData.append('urgency', '2');
      
      if (data.lampiran instanceof File) {
        formData.append('file', data.lampiran);
      }

      const res = await fetch(apiUrl('/aspiration'), {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to post aspirasi');
      }
      
      // Only reload if we're also displaying the list, 
      // but usually aspirations are handled nicely
      const newAspirasi = await res.json();
      setAspirasi(current => [newAspirasi, ...current]);
      return newAspirasi;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, []);

  // Real API Call - Delete Aspirasi (Admin)
  const deleteAspirasi = useCallback(async (id) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Unauthorized: token tidak ditemukan');

      const res = await fetch(apiUrl(`/aspiration/${id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!res.ok) throw new Error('Failed to delete aspirasi');
      setAspirasi((current) => current.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, []);

  // CSV Export Helper (Admin)
  const exportCsv = useCallback(async () => {
    const current = await fetchAspirasi();
    if (!current || current.length === 0) return;

    const sanitize = (value) =>
      String(value ?? '-')
        .replace(/(\r\n|\n|\v)/g, ' ')
        .replace(/,/g, ';');

    // Build CSV content
    const header = ['ID', 'Nama', 'Kategori', 'Topik', 'Pesan', 'Lampiran URL', 'Tanggal'];
    const rows = current.map((item) => [
      sanitize(item.id),
      sanitize(item.name || item.nama),
      sanitize(item.category || item.kategori),
      sanitize(item.topic || item.topik),
      sanitize(item.description || item.pesan),
      sanitize(item.file_url || (item.lampiran?.name)),
      sanitize(new Date(item.created_at || item.createdAt).toLocaleString()),
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

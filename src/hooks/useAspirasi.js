import { useState, useCallback, useEffect } from 'react';
import { apiUrl } from '../config/api';

const AUTH_KEY = 'himati_auth';
const LEGACY_AUTH_KEY = 'himati_token';
const PUBLIC_STORAGE_KEY = 'himati_public_aspirasi_cache';
const PUBLIC_CACHE_MAX_ITEMS = 60;

function getAuthToken() {
  // Prefer active session token; keep localStorage fallback for backward compatibility.
  return sessionStorage.getItem(AUTH_KEY) || localStorage.getItem(LEGACY_AUTH_KEY) || '';
}

function sortAspirasiNewestFirst(list) {
  return [...list].sort(
    (a, b) =>
      new Date(b.created_at || b.createdAt || 0).getTime() -
      new Date(a.created_at || a.createdAt || 0).getTime()
  );
}

function normalizeAspirasiItem(item) {
  if (!item || typeof item !== 'object') return null;

  const createdAt = item.created_at || item.createdAt || new Date().toISOString();
  const topic = item.topic || item.topik || item.judul || '-';
  const description = item.description || item.pesan || '';
  const fallbackId = `${createdAt}-${topic}-${description}`;

  return {
    ...item,
    id: item.id || item.uuid || fallbackId,
    name: item.name ?? item.nama ?? null,
    topic,
    description,
    category: item.category || item.kategori || '-',
    file_url: item.file_url || item.lampiran?.dataUrl || null,
    created_at: createdAt,
  };
}

function normalizeAspirasiList(raw) {
  let list = [];

  if (Array.isArray(raw)) list = raw;
  else if (Array.isArray(raw?.data)) list = raw.data;
  else if (Array.isArray(raw?.result)) list = raw.result;
  else if (Array.isArray(raw?.items)) list = raw.items;
  else if (Array.isArray(raw?.data?.items)) list = raw.data.items;

  return sortAspirasiNewestFirst(list.map(normalizeAspirasiItem).filter(Boolean));
}

function readPublicAspirasiCache() {
  try {
    const raw = localStorage.getItem(PUBLIC_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return normalizeAspirasiList(parsed);
  } catch {
    return [];
  }
}

function savePublicAspirasiCache(items) {
  const trimmed = sortAspirasiNewestFirst(items).slice(0, PUBLIC_CACHE_MAX_ITEMS);
  localStorage.setItem(PUBLIC_STORAGE_KEY, JSON.stringify(trimmed));
}

function upsertPublicAspirasiCache(item) {
  const normalized = normalizeAspirasiItem(item);
  if (!normalized) return;

  const current = readPublicAspirasiCache();
  const filtered = current.filter((entry) => entry.id !== normalized.id);
  savePublicAspirasiCache([normalized, ...filtered]);
}

function removePublicAspirasiCacheById(id) {
  const current = readPublicAspirasiCache();
  savePublicAspirasiCache(current.filter((entry) => entry.id !== id));
}

// Real API Call - Get Aspirations (Admin)
export async function fetchAspirasi({ allowPublicRead = false } = {}) {
  const token = getAuthToken();

  try {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const res = await fetch(apiUrl('/aspiration'), { headers });
    if (!res.ok) {
      if (allowPublicRead && !token) {
        return readPublicAspirasiCache();
      }
      throw new Error('Failed to fetch aspirasi');
    }

    const data = await res.json();
    const normalized = normalizeAspirasiList(data);

    if (allowPublicRead && normalized.length > 0) {
      savePublicAspirasiCache(normalized);
    }

    return normalized;
  } catch (error) {
    // Avoid noisy logs on public page when endpoint is auth-protected.
    if (!allowPublicRead || token) {
      console.error(error);
    }
    return allowPublicRead ? readPublicAspirasiCache() : [];
  }
}

export default function useAspirasi(options = {}) {
  const { allowPublicRead = false } = options;

  const [aspirasi, setAspirasi] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const token = getAuthToken();

    if (!token && !allowPublicRead) {
      setAspirasi([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const data = await fetchAspirasi({ allowPublicRead });
    setAspirasi(data);
    setLoading(false);
  }, [allowPublicRead]);

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

      let responseData = null;
      try {
        responseData = await res.json();
      } catch {
        responseData = null;
      }

      const newAspirasi =
        normalizeAspirasiItem(responseData) ||
        normalizeAspirasiItem({
          name: data.nama || null,
          topic: combinedTopic,
          description: data.pesan,
          category: data.kategori,
        });

      if (newAspirasi) {
        setAspirasi((current) => {
          const filtered = current.filter((entry) => entry.id !== newAspirasi.id);
          return sortAspirasiNewestFirst([newAspirasi, ...filtered]);
        });
        upsertPublicAspirasiCache(newAspirasi);
      }

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
      removePublicAspirasiCacheById(id);
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

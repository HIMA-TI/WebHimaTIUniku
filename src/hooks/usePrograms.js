import { useState, useCallback, useEffect } from 'react';
import { API_BASE } from '../config/api';

export default function usePrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/activity`);
      const json = await response.json();
      if (response.ok) {
        const items = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
        const formatted = items.map(item => ({
          ...item,
          judul: item.name,
          deskripsi: item.description,
          gambar: item.image_url,
          link: item.url || ''
        }));
        setPrograms(formatted);
      } else {
        setPrograms([]);
      }
    } catch (e) {
      console.error(e);
      setPrograms([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addProgram = useCallback(async (data) => {
    const token = sessionStorage.getItem('himati_auth');
    const formData = new FormData();
    formData.append('name', data.judul);
    formData.append('description', data.deskripsi);
    formData.append('url', data.link || 'https://example.com');
    if (data.gambar instanceof File) {
      formData.append('image', data.gambar);
    }

    try {
      const response = await fetch(`${API_BASE}/activity`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const result = await response.json();
      if (response.ok) {
        await loadData();
        return result;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }, [loadData]);

  const updateProgram = useCallback(async (id, data) => {
    const token = sessionStorage.getItem('himati_auth');
    const formData = new FormData();
    if (data.judul) formData.append('name', data.judul);
    if (data.deskripsi) formData.append('description', data.deskripsi);
    if (data.link !== undefined) formData.append('url', data.link);
    if (data.gambar instanceof File) formData.append('image', data.gambar);

    try {
      await fetch(`${API_BASE}/activity/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      await loadData();
    } catch (e) {
      console.error(e);
    }
  }, [loadData]);

  const deleteProgram = useCallback(async (id) => {
    const token = sessionStorage.getItem('himati_auth');
    try {
      await fetch(`${API_BASE}/activity/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await loadData();
    } catch (e) {
      console.error(e);
    }
  }, [loadData]);

  const reorderPrograms = useCallback(async () => {
    // Backend doesn't support reorder natively. 
    // Fallback or leave as no-op.
  }, []);

  return { programs, loading, addProgram, updateProgram, deleteProgram, reorderPrograms, refresh: loadData };
}

import { useState, useCallback, useEffect } from 'react';
import { API_BASE } from '../config/api';

function normalizeErrorMessage(payload, fallbackMessage) {
  if (!payload) return fallbackMessage;
  if (typeof payload === 'string') return payload;

  if (Array.isArray(payload.message)) {
    return payload.message.join(', ');
  }

  if (typeof payload.message === 'string') {
    return payload.message;
  }

  if (typeof payload.error === 'string') {
    return payload.error;
  }

  if (Array.isArray(payload.errors) && payload.errors.length > 0) {
    const firstError = payload.errors[0];
    if (typeof firstError === 'string') return firstError;
    if (typeof firstError?.message === 'string') return firstError.message;
    if (typeof firstError?.msg === 'string') return firstError.msg;
  }

  return fallbackMessage;
}

async function readJsonSafely(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/product`);
      const json = await response.json();
      if (response.ok) {
        const items = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
        // Map backend fields to frontend fields
        const formatted = items.map(item => ({
          ...item,
          nama: item.name,
          deskripsi: item.description,
          gambar: item.image_url,
          linkOrder: item.url || item.link_order || '',
          harga: Number(item.price ?? item.harga ?? 0)
        }));
        setProducts(formatted);
      } else {
        setProducts([]);
      }
    } catch (e) {
      console.error(e);
      setProducts([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addProduct = useCallback(async (data) => {
    const token = sessionStorage.getItem('himati_auth');
    const formData = new FormData();
    formData.append('name', data.nama);
    formData.append('description', data.deskripsi);
    formData.append('category', 'merch'); // default category
    const normalizedPrice = Number(data.harga);
    if (Number.isFinite(normalizedPrice)) {
      // Keep both keys to stay compatible with backend schema variations.
      formData.append('price', String(normalizedPrice));
      formData.append('harga', String(normalizedPrice));
    }
    formData.append('url', data.linkOrder?.trim() ? data.linkOrder.trim() : 'https://example.com');
    if (data.gambar instanceof File) {
      formData.append('image', data.gambar);
    }

    try {
      const response = await fetch(`${API_BASE}/product`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await readJsonSafely(response);

      if (response.ok) {
        await loadData();
        return { success: true, data: result };
      }

      return {
        success: false,
        status: response.status,
        error: normalizeErrorMessage(result, 'Gagal menambahkan produk')
      };
    } catch (e) {
      console.error(e);
      return {
        success: false,
        error: 'Gagal menghubungi server. Coba lagi beberapa saat.'
      };
    }
  }, [loadData]);

  const updateProduct = useCallback(async (id, data) => {
    const token = sessionStorage.getItem('himati_auth');
    const formData = new FormData();
    if (data.nama) formData.append('name', data.nama);
    if (data.deskripsi) formData.append('description', data.deskripsi);
    formData.append('category', 'merch');
    if (data.linkOrder !== undefined) {
      formData.append('url', data.linkOrder?.trim() ? data.linkOrder.trim() : 'https://example.com');
    }
    if (data.harga !== undefined && data.harga !== null && data.harga !== '') {
      const normalizedPrice = Number(data.harga);
      if (Number.isFinite(normalizedPrice)) {
        formData.append('price', String(normalizedPrice));
        formData.append('harga', String(normalizedPrice));
      }
    }
    if (data.gambar instanceof File) formData.append('image', data.gambar);

    try {
      const response = await fetch(`${API_BASE}/product/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await readJsonSafely(response);

      if (!response.ok) {
        return {
          success: false,
          status: response.status,
          error: normalizeErrorMessage(result, 'Gagal memperbarui produk')
        };
      }

      await loadData();
      return { success: true, data: result };
    } catch (e) {
      console.error(e);
      return {
        success: false,
        error: 'Gagal menghubungi server. Coba lagi beberapa saat.'
      };
    }
  }, [loadData]);

  const deleteProduct = useCallback(async (id) => {
    const token = sessionStorage.getItem('himati_auth');
    try {
      await fetch(`${API_BASE}/product/${id}`, {
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

  return { products, loading, addProduct, updateProduct, deleteProduct, refresh: loadData };
}

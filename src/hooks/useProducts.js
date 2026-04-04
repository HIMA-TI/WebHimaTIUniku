import { useState, useCallback, useEffect } from 'react';

const API_BASE = 'http://localhost:3000/api';

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/product`);
      const data = await response.json();
      if (response.ok) {
        // Map backend fields to frontend fields
        const formatted = data.map(item => ({
          ...item,
          nama: item.name,
          deskripsi: item.description,
          gambar: item.image_url,
          linkOrder: item.url || '',
          harga: 0 // Optional fallback if missing in DB
        }));
        setProducts(formatted);
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
    if (data.linkOrder) {
      formData.append('url', data.linkOrder);
    }
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

  const updateProduct = useCallback(async (id, data) => {
    const token = sessionStorage.getItem('himati_auth');
    const formData = new FormData();
    if (data.nama) formData.append('name', data.nama);
    if (data.deskripsi) formData.append('description', data.deskripsi);
    formData.append('category', 'merch');
    if (data.linkOrder !== undefined) formData.append('url', data.linkOrder);
    if (data.gambar instanceof File) formData.append('image', data.gambar);

    try {
      await fetch(`${API_BASE}/product/${id}`, {
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

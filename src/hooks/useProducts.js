import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'himati_products';

// Mock API Call - Get Products
export async function fetchProducts() {
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
    }, 300); // Simulate network delay
  });
}

// Mock API Call - Save Products array directly (useful for reorder/internal sync)
async function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await fetchProducts();
    setProducts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Mock API Call - Add Product
  const addProduct = useCallback(async (data) => {
    const current = await fetchProducts();
    const newProduct = {
      id: crypto.randomUUID(),
      nama: data.nama,
      deskripsi: data.deskripsi,
      harga: data.harga,
      gambar: data.gambar,
      linkOrder: data.linkOrder || '',
      createdAt: new Date().toISOString(),
    };
    const updated = [newProduct, ...current];
    await saveProducts(updated);
    setProducts(updated);
    return newProduct;
  }, []);

  // Mock API Call - Update Product
  const updateProduct = useCallback(async (id, data) => {
    const current = await fetchProducts();
    const updated = current.map((p) =>
      p.id === id ? { ...p, ...data, id } : p
    );
    await saveProducts(updated);
    setProducts(updated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  }, []);

  // Mock API Call - Delete Product
  const deleteProduct = useCallback(async (id) => {
    const current = await fetchProducts();
    const filtered = current.filter((p) => p.id !== id);
    await saveProducts(filtered);
    setProducts(filtered);
  }, []);

  return { products, loading, addProduct, updateProduct, deleteProduct, refresh: loadData };
}

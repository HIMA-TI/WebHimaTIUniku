import { useState, useEffect } from 'react';
import { getAuthHeader } from '../utils/authUtils';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function useShortUrls() {
  const [shortUrls, setShortUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchShortUrls = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/short-url`, {
        headers: {
          'Authorization': getAuthHeader()
        }
      });
      const data = await res.json();
      if (data.success) {
        setShortUrls(data.data);
      }
    } catch (error) {
      console.error('Error fetching short URLs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortUrls();
  }, []);

  const addShortUrl = async (urlData) => {
    try {
      const res = await fetch(`${BASE_URL}/api/short-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader()
        },
        body: JSON.stringify(urlData),
      });
      const data = await res.json();
      if (data.success) {
        setShortUrls([data.data, ...shortUrls]);
        return { success: true };
      }
      return { success: false, error: data.message };
    } catch (error) {
      return { success: false, error: 'Gagal menambahkan URL' };
    }
  };

  const updateShortUrl = async (id, urlData) => {
    try {
      const res = await fetch(`${BASE_URL}/api/short-url/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader()
        },
        body: JSON.stringify(urlData),
      });
      const data = await res.json();
      if (data.success) {
        setShortUrls(shortUrls.map(u => u.id === id ? data.data : u));
        return { success: true };
      }
      return { success: false, error: data.message };
    } catch (error) {
      return { success: false, error: 'Gagal memperbarui URL' };
    }
  };

  const deleteShortUrl = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/api/short-url/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': getAuthHeader()
        }
      });
      const data = await res.json();
      if (data.success) {
        setShortUrls(shortUrls.filter(u => u.id !== id));
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  };

  return { shortUrls, loading, addShortUrl, updateShortUrl, deleteShortUrl };
}

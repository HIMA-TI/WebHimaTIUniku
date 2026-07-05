import { useState, useCallback, useEffect } from 'react';
import { API_BASE } from '../config/api';

function safeParse(val, fallback) {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }
  return val || fallback;
}

let cacheData = null;
let isFetching = false;
let fetchPromise = null;

export default function useDigitalAssets() {
  const [digitalAssets, setDigitalAssets] = useState(cacheData || []);
  const [loading, setLoading] = useState(!cacheData);

  const loadData = useCallback(async (force = false) => {
    if (!force && cacheData) {
      setDigitalAssets(cacheData);
      setLoading(false);
      return;
    }

    if (isFetching && fetchPromise) {
      setLoading(true);
      await fetchPromise;
      setDigitalAssets(cacheData || []);
      setLoading(false);
      return;
    }

    setLoading(true);
    isFetching = true;

    fetchPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE}/digital-asset`);
        const json = await response.json();
        if (response.ok) {
          const items = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
          const themes = [
            { bgColor: 'bg-emerald-50', textColor: 'text-emerald-900', descColor: 'text-emerald-700/80', iconBg: 'bg-white', iconColor: 'text-emerald-500' },
            { bgColor: 'bg-emerald-600', textColor: 'text-white', descColor: 'text-emerald-50/80', iconBg: 'bg-emerald-500', iconColor: 'text-white' },
            { bgColor: 'bg-emerald-200', textColor: 'text-emerald-950', descColor: 'text-emerald-900/80', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700' }
          ];

          const formatted = items.map((item, index) => {
            const theme = themes[index % themes.length];
            return {
              ...item,
              title: item.title,
              desc: item.desc,
              cat: item.category,
              type: item.type,
              icon: item.icon || 'Gamepad2',
              image: item.image_url || null,
              techStack: safeParse(item.tech_stack, []),
              features: safeParse(item.features, []),
              steps: safeParse(item.steps, []),
              repoUrl: item.repo_url,
              guideUrl: item.guide_url,
              demoUrl: item.demo_url || '',
              stats: safeParse(item.stats, { users: 0, generated: 0 }),
              difficulty: item.difficulty || 'Mudah',
              systemReq: item.system_req || '',
              isHot: item.is_hot,
              isRecommended: item.is_recommended,
              developer: safeParse(item.developer, {}),
              testimonial: safeParse(item.testimonial, {}),
              changelog: safeParse(item.changelog, []),
              faqs: safeParse(item.faqs, []),
              requestCount: Number(item.request_count) || 0,
              likes: Number(item.likes) || 0,
              is_limited: item.is_limited === true,
              maxBorrowers: Number(item.max_borrowers) || 2,
              ...theme
            };
          });
          cacheData = formatted;
        } else {
          cacheData = [];
        }
      } catch (e) {
        console.error(e);
        cacheData = [];
      } finally {
        isFetching = false;
        fetchPromise = null;
      }
    })();

    await fetchPromise;
    setDigitalAssets(cacheData || []);
    setLoading(false);
  }, []);

  const likeAsset = useCallback(async (id) => {
    // Optimistic Update
    setDigitalAssets(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, likes: item.likes + 1 } : item);
      cacheData = updated;
      return updated;
    });

    try {
      const response = await fetch(`${API_BASE}/digital-asset/${id}/like`, { method: 'PATCH' });
      if (response.ok) {
        const { likes } = await response.json();
        setDigitalAssets(prev => {
          const updated = prev.map(item => item.id === id ? { ...item, likes: Number(likes) } : item);
          cacheData = updated;
          return updated;
        });
      }
    } catch (e) {
      console.error('Failed to like asset', e);
    }
  }, []);

  const addAsset = useCallback(async (data) => {
    const token = sessionStorage.getItem('himati_auth');
    try {
      const response = await fetch(`${API_BASE}/digital-asset`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });
      const json = await response.json();
      if (response.ok) {
        await loadData(true);
        return { success: true, data: json };
      }
      return { success: false, error: json.message };
    } catch (e) {
      console.error(e);
      return { success: false, error: 'Terjadi kesalahan jaringan' };
    }
  }, [loadData]);

  const updateAsset = useCallback(async (id, data) => {
    const token = sessionStorage.getItem('himati_auth');
    try {
      const response = await fetch(`${API_BASE}/digital-asset/${id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });
      const json = await response.json();
      if (response.ok) {
        await loadData(true);
        return { success: true, data: json };
      }
      return { success: false, error: json.message };
    } catch (e) {
      console.error(e);
      return { success: false, error: 'Terjadi kesalahan jaringan' };
    }
  }, [loadData]);

  const deleteAsset = useCallback(async (id) => {
    const token = sessionStorage.getItem('himati_auth');
    try {
      const response = await fetch(`${API_BASE}/digital-asset/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        await loadData(true);
        return { success: true };
      }
      const json = await response.json();
      return { success: false, error: json.message };
    } catch (e) {
      console.error(e);
      return { success: false, error: 'Terjadi kesalahan jaringan' };
    }
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { digitalAssets, loading, refresh: loadData, likeAsset, addAsset, updateAsset, deleteAsset };
}

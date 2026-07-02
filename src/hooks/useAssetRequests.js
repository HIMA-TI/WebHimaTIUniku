import { useState, useEffect } from 'react';
import { apiUrl } from '../config/api';

export default function useAssetRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl('/asset-requests'), {
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('himati_auth')}` }
      });
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch asset requests', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(apiUrl(`/asset-requests/${id}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('himati_auth')}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setRequests(prev => prev.map(req => (req.id === id ? data.data : req)));
        return { success: true, warning: data.warning };
      }
      return { success: false, error: data.message };
    } catch (error) {
      console.error('Failed to update request status', error);
      return { success: false, error: 'Gagal update status' };
    }
  };

  const deleteRequest = async (id) => {
    try {
      const res = await fetch(apiUrl(`/asset-requests/${id}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('himati_auth')}` }
      });
      const data = await res.json();
      if (data.success) {
        setRequests(prev => prev.filter(req => req.id !== id));
        return { success: true };
      }
      return { success: false, error: data.message };
    } catch (error) {
      console.error('Failed to delete request', error);
      return { success: false, error: 'Gagal menghapus' };
    }
  };

  return { requests, loading, updateStatus, deleteRequest, fetchRequests };
}

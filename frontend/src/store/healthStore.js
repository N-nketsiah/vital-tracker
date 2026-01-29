import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const useHealthStore = create((set) => ({
  entries: [],
  stats: null,
  insights: [],
  trends: null,
  isLoading: false,
  error: null,

  setEntries: (entries) => set({ entries }),
  setStats: (stats) => set({ stats }),
  setInsights: (insights) => set({ insights }),
  setTrends: (trends) => set({ trends }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  fetchEntries: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/health`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ entries: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  addEntry: async (token, entryData) => {
    try {
      const response = await axios.post(`${API_URL}/health`, entryData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        entries: [response.data, ...state.entries]
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  updateEntry: async (token, entryId, entryData) => {
    try {
      const response = await axios.put(`${API_URL}/health/${entryId}`, entryData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        entries: state.entries.map((e) => (e._id === entryId ? response.data : e))
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteEntry: async (token, entryId) => {
    try {
      await axios.delete(`${API_URL}/health/${entryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        entries: state.entries.filter((e) => e._id !== entryId)
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  fetchStats: async (token, days = 30) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/analytics/stats?days=${days}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ stats: response.data.stats, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchInsights: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/analytics/insights`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ insights: response.data.insights, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchTrends: async (token, metric = 'weight', days = 30) => {
    try {
      const response = await axios.get(
        `${API_URL}/analytics/trends?metric=${metric}&days=${days}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ trends: response.data });
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  exportCSV: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/export/csv`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `health-data-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  exportPDF: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/export/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `VitalTrack-Report-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  }
}));

export default useHealthStore;

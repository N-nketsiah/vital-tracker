import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5001/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      set({
        user: data.user,
        token: data.token,
        isLoading: false
      });
      localStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  register: async (name, email, password, age, height, weight, gender) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5001/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, age, height, weight, gender })
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      set({
        user: data.user,
        token: data.token,
        isLoading: false
      });
      localStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  fetchProfile: async (token) => {
    try {
      const response = await fetch('http://localhost:5001/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const user = await response.json();
      set({ user });
      return user;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  }
}));

export default useAuthStore;

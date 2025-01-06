import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);
  const isAuthenticated = ref(!!localStorage.getItem('token'));
  const token = ref(localStorage.getItem('token') || null);

  // Axios instance for API calls
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Backend API URL from .env
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Include cookies for cross-origin requests
  });

  // Add token and CSRF token to requests
  api.interceptors.request.use(config => {
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`;
    }

    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }

    return config;
  });

  // Helper function to get a cookie value
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  // Login function
  const login = async (username, password) => {
    try {
      const response = await api.post('/api/login/', { username, password });

      if (!response.data || !response.data.data || !response.data.data.token) {
        throw new Error('Invalid server response');
      }

      // Update authentication state
      token.value = response.data.data.token;
      user.value = response.data.data.user;
      isAuthenticated.value = true;

      // Persist token and user to localStorage
      localStorage.setItem('token', token.value);
      localStorage.setItem('user', JSON.stringify(user.value));

      return { success: true };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);

      // Reset authentication state
      logout();
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await api.post('/api/register/', userData);

      if (!response.data || !response.data.data || !response.data.data.token) {
        throw new Error('Invalid response from server');
      }

      // Update authentication state
      token.value = response.data.data.token;
      user.value = response.data.data.user;
      isAuthenticated.value = true;

      // Persist token to localStorage
      localStorage.setItem('token', token.value);

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);

      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post('/api/logout/'); // Call backend logout endpoint if available
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Reset authentication state
      token.value = null;
      user.value = null;
      isAuthenticated.value = false;

      // Remove from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  return {
    user,
    isAuthenticated,
    token,
    login,
    register,
    logout,
  };
});
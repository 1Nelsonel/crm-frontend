import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const isAuthenticated = ref(!!localStorage.getItem('token'))
  const token = ref(localStorage.getItem('token') || null)

  const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Add token to requests
  api.interceptors.request.use(config => {
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`
    }
    return config
  })

  const login = async (username, password) => {
    try {
      const response = await api.post('/login/', { username, password })

      if (!response.data.data || !response.data.data.token || !response.data.data.user) {
        throw new Error('Invalid server response')
      }

      // Update auth state
      token.value = response.data.data.token
      user.value = response.data.data.user
      isAuthenticated.value = true

      // Persist to localStorage
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))

      return { success: true }
    } catch (error) {
      // Reset auth state
      logout()
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post('/register/', userData);

      if (!response.data.data || !response.data.data.token || !response.data.data.user) {
        throw new Error('Invalid response from server');
      }

      token.value = response.data.data.token;
      user.value = response.data.data.user;
      isAuthenticated.value = true;
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

  const logout = () => {
    token.value = null
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    user,
    isAuthenticated,
    token,
    login,
    register,
    logout
  }
})



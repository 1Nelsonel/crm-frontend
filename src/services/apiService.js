
// src/services/apiService.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Centralized base URL
})

// Add token-based authorization interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      // Change from Bearer to Token for Knox authentication
      config.headers.Authorization = `Token ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api

import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api'
})

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

export const notesService = {
  async getNotes() {
    try {
      const response = await api.get('/notes/')
      return Array.isArray(response.data) ? response.data : response.data.data || []
    } catch (error) {
      console.error("Error in getNotes:", error)
      throw error
    }
  },
  async createNote(noteData) {
    const response = await api.post('/notes/', noteData)
    return response.data
  },
  async updateNote(noteId, noteData) {
    const response = await api.put(`/notes/${noteId}/`, noteData)
    return response.data
  },
  async deleteNote(noteId) {
    await api.delete(`notes/${noteId}/`, )
  },

  async getLeads() {
    const response = await api.get('/leads/')
    console.log("Raw API Response:", response.data)
    return Array.isArray(response.data) ? response.data : response.data.data || []
  }
}

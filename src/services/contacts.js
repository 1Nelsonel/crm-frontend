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

export const contactService = {
  async getContacts() {
    const response = await api.get('/contacts/')
    return Array.isArray(response.data) ? response.data : response.data.data || []
  },
  async createContact(contactData) {
    const response = await api.post('/contacts/', contactData)
    return response.data
  },
  async updateContact(id, contactData) {
    const response = await api.put(`/contacts/${id}/`, contactData)
    return response.data
  },
  async deleteContact(id) {
    await api.delete(`/contacts/${id}/`)
  },
  async getLeads() {
    const response = await api.get('/leads/')
    console.log("Raw API Response:", response.data)
    return Array.isArray(response.data) ? response.data : response.data.data || []
  }
}

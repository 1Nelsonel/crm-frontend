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

export const leadsService = {
  async getLeads() {
    try {
      const response = await api.get('/leads/')
      console.log("Raw API Response:", response.data)
      // If the API returns { data: [...leads] }, extract just the leads array
      return Array.isArray(response.data) ? response.data : response.data.data || []
    } catch (error) {
      console.error("Error in getLeads:", error)
      throw error
    }
  },
  async getLead(id) {
    const response = await api.get(`/leads/${id}/`)
    return response.data
  },
  async createLead(leadData) {
    const response = await api.post('/leads/', leadData)
    return response.data
  },
  async updateLead(id, leadData) {
    const response = await api.put(`/leads/${id}/`, leadData)
    return response.data
  },
  async deleteLead(id) {
    await api.delete(`/leads/${id}/`)
  }
}

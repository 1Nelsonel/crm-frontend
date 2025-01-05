import api from './apiService'

console.log("API: ", api)
export const leadsService = {
  async getLeads() {
    try {
      const response = await api.get('/api/leads/')
      console.log("Raw API Response:", response.data)
      // If the API returns { data: [...leads] }, extract just the leads array
      return Array.isArray(response.data) ? response.data : response.data.data || []
    } catch (error) {
      console.error("Error in getLeads:", error)
      throw error
    }
  },
  async getLead(id) {
    const response = await api.get(`/api/leads/${id}/`)
    return response.data
  },
  async createLead(leadData) {
    const response = await api.post('/api/leads/', leadData)
    return response.data
  },
  async updateLead(id, leadData) {
    const response = await api.put(`/api/leads/${id}/`, leadData)
    return response.data
  },
  async deleteLead(id) {
    await api.delete(`/api/leads/${id}/`)
  }
}

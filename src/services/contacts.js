import api from './apiService'

export const contactService = {
  async getContacts() {
    const response = await api.get('/api/contacts/')
    return Array.isArray(response.data) ? response.data : response.data.data || []
  },
  async createContact(contactData) {
    const response = await api.post('/api/contacts/', contactData)
    return response.data
  },
  async updateContact(id, contactData) {
    const response = await api.put(`/api/contacts/${id}/`, contactData)
    return response.data
  },
  async deleteContact(id) {
    await api.delete(`/api/contacts/${id}/`)
  },
  async getLeads() {
    const response = await api.get('/leads/')
    console.log("Raw API Response:", response.data)
    return Array.isArray(response.data)
      ? response.data.map((lead) => ({
          value: lead.id,
          title: lead.name,
        }))
      : response.data.data.map((lead) => ({
          value: lead.id,
          title: lead.name,
        })) || []
  }
}

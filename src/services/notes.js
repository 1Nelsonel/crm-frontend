import api from './apiService'

export const notesService = {
  async getNotes() {
    try {
      const response = await api.get('/api/notes/')
      return Array.isArray(response.data) ? response.data : response.data.data || []
    } catch (error) {
      console.error("Error in getNotes:", error)
      throw error
    }
  },
  async createNote(noteData) {
    const response = await api.post('/api/notes/', noteData)
    return response.data
  },
  async updateNote(noteId, noteData) {
    const response = await api.put(`/api/notes/${noteId}/`, noteData)
    return response.data
  },
  async deleteNote(noteId) {
    await api.delete(`/api/notes/${noteId}/`, )
  },

  async getLeads() {
    const response = await api.get('/api/leads/')
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

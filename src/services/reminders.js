import api from './apiService'

export const remindersService = {
  async getReminders() {
    const response = await api.get('/api/reminders/')
    return response.data.data || []
  },
  async createReminder(reminderData) {
    const response = await api.post('/api/reminders/', reminderData)
    return response.data
  },
  async updateReminder(reminderId, reminderData) {
    const response = await api.put(`/api/reminders/${reminderId}/`, reminderData)
    return response.data
  },
  async deleteReminder(reminderId) {
    await api.delete(`/api/reminders/${reminderId}/`)
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

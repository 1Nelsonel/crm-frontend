import api from './apiService'

export const remindersService = {
  async getReminders(leadId) {
    try {
      const response = await api.get('/reminders/')
      return Array.isArray(response.data) ? response.data : response.data.data || []
    } catch (error) {
      console.error("Error in getReminders:", error)
      throw error
    }
  },
  async createReminder(reminderData) {
    const response = await api.post('/reminders/', reminderData)
    return response.data
  },
  async updateReminder(reminderId, reminderData) {
    const response = await api.put(`/reminders/${reminderId}/`, reminderData)
    return response.data
  },
  async deleteReminder(reminderId) {
    await api.delete(`/reminders/${reminderId}/`)
  }
}

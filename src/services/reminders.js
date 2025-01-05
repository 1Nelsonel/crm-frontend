export const remindersService = {
  async getReminders(leadId) {
    try {
      const response = await api.get(`/leads/${leadId}/reminders/`)
      return Array.isArray(response.data) ? response.data : response.data.data || []
    } catch (error) {
      console.error("Error in getReminders:", error)
      throw error
    }
  },
  async createReminder(leadId, reminderData) {
    const response = await api.post(`/leads/${leadId}/reminders/`, reminderData)
    return response.data
  },
  async updateReminder(leadId, reminderId, reminderData) {
    const response = await api.put(`/leads/${leadId}/reminders/${reminderId}/`, reminderData)
    return response.data
  },
  async deleteReminder(leadId, reminderId) {
    await api.delete(`/leads/${leadId}/reminders/${reminderId}/`)
  }
}

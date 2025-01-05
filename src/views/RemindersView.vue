<template>
  <v-app>
    <Navigation />

    <v-main>
      <v-container class="py-6">
        <!-- Header -->
        <v-row align="center" justify="space-between" class="mb-6">
          <v-col>
            <h1 class="text-h4 font-weight-bold">Reminders</h1>
          </v-col>
          <v-btn color="primary" @click="openCreateModal" prepend-icon="mdi-plus">
            Add Reminder
          </v-btn>
        </v-row>

        <!-- Reminders Table -->
        <v-card>
          <v-card-text>
            <v-progress-circular
              v-if="loading"
              indeterminate
              color="primary"
              class="d-flex mx-auto my-4"
            />

            <v-table v-else>
              <thead>
                <tr>
                  <th class="text-left">Lead</th>
                  <th class="text-left">Message</th>
                  <th class="text-left">Remind At</th>
                  <th class="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="reminder in reminders" :key="reminder.id">
                  <td>{{ reminder.lead?.name || 'No Lead' }}</td>
                  <td>{{ reminder.message }}</td>
                  <td>{{ formatDate(reminder.remind_at) }}</td>
                  <td>
                    <v-btn
                      size="small"
                      color="primary"
                      variant="text"
                      class="mr-2"
                      @click="editReminder(reminder)"
                    >
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                    <v-btn
                      size="small"
                      color="error"
                      variant="text"
                      @click="deleteReminder(reminder.id)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <!-- Modal for Creating/Editing Reminders -->
        <v-dialog v-model="showModal" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ editingReminder ? 'Edit Reminder' : 'Create Reminder' }}</span>
            </v-card-title>

            <v-card-text>
              <v-form @submit.prevent="handleSubmit">
                <v-container>
                  <v-row>
                    <!-- Lead Field -->
                    <v-col cols="12">
                      <v-select
                        v-model="formData.lead_id"
                        label="Lead"
                        :items="leads"
                        item-text="title"
                        item-value="value"
                        variant="outlined"
                        density="comfortable"
                        required
                      />
                    </v-col>

                    <!-- Message Field -->
                    <v-col cols="12">
                      <v-textarea
                        v-model="formData.message"
                        label="Message"
                        outlined
                        rows="4"
                        required
                        density="comfortable"
                        variant="outlined"
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn
                color="grey-darken-1"
                variant="text"
                @click="closeModal"
              >
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                @click="handleSubmit"
              >
                {{ editingReminder ? 'Update' : 'Create' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navigation from '@/components/Navigation.vue'
import { remindersService } from '@/services/reminders'

// State
const reminders = ref([])
const leads = ref([])
const loading = ref(true)
const showModal = ref(false)
const editingReminder = ref(null)
const formData = ref({ lead_id: null, message: '' })

// Helper: Format Date
const formatDate = (date) => new Date(date).toLocaleDateString()

// Fetch Reminders and Leads
const fetchRemindersAndLeads = async () => {
  try {
    loading.value = true
    reminders.value = await remindersService.getReminders()
    leads.value = await remindersService.getLeads()
  } catch (error) {
    console.error('Error fetching reminders and leads:', error)
  } finally {
    loading.value = false
  }
}

// Open Modal for Create
const openCreateModal = () => {
  editingReminder.value = null
  formData.value = { lead_id: null, message: '' }
  showModal.value = true
}

// Open Modal for Edit
const editReminder = (reminder) => {
  editingReminder.value = reminder
  formData.value = {
    lead_id: reminder.lead?.id || null,
    message: reminder.message
  }
  showModal.value = true
}

// Close Modal
const closeModal = () => {
  showModal.value = false
  editingReminder.value = null
  formData.value = { lead_id: null, message: '' }
}

// Handle Submit
const handleSubmit = async () => {
  try {
    if (editingReminder.value) {
      await remindersService.updateReminder(editingReminder.value.id, formData.value)
    } else {
      await remindersService.createReminder(formData.value) // Send only lead_id and message
    }
    await fetchRemindersAndLeads()
    closeModal()
  } catch (error) {
    console.error('Error saving reminder:', error)
  }
}

// Delete Reminder
const deleteReminder = async (id) => {
  if (confirm('Are you sure you want to delete this reminder?')) {
    try {
      await remindersService.deleteReminder(id)
      await fetchRemindersAndLeads()
    } catch (error) {
      console.error('Error deleting reminder:', error)
    }
  }
}

// Lifecycle Hook
onMounted(() => {
  fetchRemindersAndLeads()
})
</script>

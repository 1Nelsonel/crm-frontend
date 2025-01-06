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
                  <th class="text-left">Status</th>
                  <th class="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="reminder in reminders" :key="reminder.id">
                  <td>{{ reminder.lead?.name || 'No Lead' }}</td>
                  <td>{{ reminder.message }}</td>
                  <td>{{ formatDateTime(reminder.remind_at) }}</td>
                  <td>
                    <v-chip
                      :color="getStatusColor(reminder.status)"
                      size="small"
                      label
                    >
                      {{ reminder.status }}
                    </v-chip>
                  </td>
                  <td>
                    <v-btn
                      size="small"
                      color="primary"
                      variant="text"
                      class="mr-2"
                      @click="editReminder(reminder)"
                    >
                      <v-icon>mdi-pencil</v-icon>
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
        <v-dialog v-model="showModal" max-width="600px" persistent>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ editingReminder ? 'Edit Reminder' : 'Create Reminder' }}</span>
            </v-card-title>

            <v-card-text>
              <v-form ref="form" @submit.prevent="handleSubmit">
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
                        :rules="[v => !!v || 'Lead is required']"
                        required
                      />
                    </v-col>

                    <!-- Message Field -->
                    <v-col cols="12">
                      <v-textarea
                        v-model="formData.message"
                        label="Message"
                        rows="4"
                        variant="outlined"
                        density="comfortable"
                        :rules="[v => !!v || 'Message is required']"
                        required
                      />
                    </v-col>

                    <!-- Date Field -->
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.date"
                        label="Date (YYYY-MM-DD)"
                        prepend-icon="mdi-calendar"
                        variant="outlined"
                        density="comfortable"
                        :rules="[v => !!v || 'Date is required']"
                        required
                      />
                    </v-col>

                    <!-- Time Field -->
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.time"
                        label="Time (HH:MM)"
                        prepend-icon="mdi-clock-outline"
                        variant="outlined"
                        density="comfortable"
                        :rules="[v => !!v || 'Time is required']"
                        required
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
                :loading="submitting"
              >
                {{ editingReminder ? 'Update' : 'Create' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Snackbar for notifications -->
        <v-snackbar
          v-model="snackbar.show"
          :color="snackbar.color"
          timeout="3000"
        >
          {{ snackbar.text }}
        </v-snackbar>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navigation from '@/components/Navigation.vue'
import { remindersService } from '@/services/reminders'

// Form reference
const form = ref(null)

// State
const reminders = ref([])
const leads = ref([])
const loading = ref(true)
const submitting = ref(false)
const showModal = ref(false)
const editingReminder = ref(null)

// Snackbar state
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

// Initialize formData with current date and time
const now = new Date()
const formData = ref({
  lead_id: null,
  message: '',
  date: now.toISOString().split('T')[0],  // Default to today's date in YYYY-MM-DD format
  time: now.toTimeString().substring(0, 5) // Default to current time in HH:MM format
})


// Helper: Format Date and Time
const formatDateTime = (datetime) => {
  if (!datetime) return ''
  const date = new Date(datetime)
  return new Intl.DateTimeFormat('default', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Helper: Get status color
const getStatusColor = (status) => {
  const colors = {
    'Pending': 'warning',
    'Complete': 'success',
    'Failed': 'error'
  }
  return colors[status] || 'grey'
}

// Show snackbar message
const showMessage = (text, color = 'success') => {
  snackbar.value = {
    show: true,
    text,
    color
  }
}

// Fetch Reminders and Leads
const fetchRemindersAndLeads = async () => {
  try {
    loading.value = true
    const [remindersData, leadsData] = await Promise.all([
      remindersService.getReminders(),
      remindersService.getLeads()
    ])
    reminders.value = remindersData
    leads.value = leadsData
  } catch (error) {
    console.error('Error fetching data:', error)
    showMessage('Failed to load data', 'error')
  } finally {
    loading.value = false
  }
}

// Open Modal for Create
const openCreateModal = () => {
  editingReminder.value = null
  const now = new Date() // Get the current date and time
  formData.value = {
    lead_id: null,
    message: '',
    date: now.toISOString().split('T')[0],  // Default to today's date
    time: now.toTimeString().substring(0, 5) // Default to current time
  }
  showModal.value = true
}

// Open Modal for Edit
const editReminder = (reminder) => {
  const reminderDate = new Date(reminder.remind_at)
  editingReminder.value = reminder
  formData.value = {
    lead_id: reminder.lead?.id || null,
    message: reminder.message,
    date: reminderDate.toISOString().split('T')[0],
    time: reminderDate.toTimeString().substring(0, 5)
  }
  showModal.value = true
}

// Close Modal
const closeModal = () => {
  if (form.value) {
    form.value.reset()
  }
  showModal.value = false
  editingReminder.value = null
  formData.value = {
    lead_id: null,
    message: '',
    date: '',
    time: ''
  }
}

// Combine date and time into ISO string
const createDateTime = (date, time) => {
  if (!date || !time) {
    throw new Error('Date and time are required')
  }
  const [year, month, day] = date.split('-')
  const [hours, minutes] = time.split(':')
  return new Date(year, month - 1, day, hours, minutes).toISOString()
}

// Handle Submit
const handleSubmit = async () => {
  if (!form.value) return

  const { valid } = await form.value.validate()
  if (!valid) {
    showMessage('Please fill in all required fields', 'error')
    return
  }

  try {
    submitting.value = true
    const reminderData = {
      lead_id: formData.value.lead_id,
      message: formData.value.message,
      remind_at: createDateTime(formData.value.date, formData.value.time)
    }

    if (editingReminder.value) {
      await remindersService.updateReminder(editingReminder.value.id, reminderData)
      showMessage('Reminder updated successfully')
    } else {
      await remindersService.createReminder(reminderData)
      showMessage('Reminder created successfully')
    }

    await fetchRemindersAndLeads()
    closeModal()
  } catch (error) {
    console.error('Error saving reminder:', error)
    showMessage(error.message || 'Failed to save reminder', 'error')
  } finally {
    submitting.value = false
  }
}

// Delete Reminder
const deleteReminder = async (id) => {
  if (!confirm('Are you sure you want to delete this reminder?')) return

  try {
    await remindersService.deleteReminder(id)
    showMessage('Reminder deleted successfully')
    await fetchRemindersAndLeads()
  } catch (error) {
    console.error('Error deleting reminder:', error)
    showMessage('Failed to delete reminder', 'error')
  }
}

// Lifecycle Hook
onMounted(() => {
  fetchRemindersAndLeads()
})
</script>

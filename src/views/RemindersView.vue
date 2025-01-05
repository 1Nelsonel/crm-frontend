<template>
  <v-container>
    <!-- Header with Add Button -->
    <v-row class="mb-6">
      <v-col class="d-flex justify-space-between align-center">
        <h1 class="text-h4 font-weight-bold">Reminders</h1>
        <v-btn
          color="primary"
          @click="openReminderDialog"
          prepend-icon="$plus"
        >
          Add Reminder
        </v-btn>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-select
          v-model="filterStatus"
          label="Status"
          :items="['All', 'Pending', 'Completed', 'Overdue']"
          variant="outlined"
          density="comfortable"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="filterLead"
          label="Lead"
          :items="leads"
          item-title="name"
          item-value="id"
          variant="outlined"
          density="comfortable"
          clearable
        />
      </v-col>
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
              <th class="text-left">Title</th>
              <th class="text-left">Lead</th>
              <th class="text-left">Due Date</th>
              <th class="text-left">Status</th>
              <th class="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="reminder in filteredReminders" :key="reminder.id">
              <td>{{ reminder.title }}</td>
              <td>{{ reminder.lead?.name }}</td>
              <td>{{ formatDate(reminder.due_date) }}</td>
              <td>
                <v-chip
                  :color="getStatusColor(reminder.status)"
                  size="small"
                  class="text-uppercase"
                >
                  {{ reminder.status }}
                </v-chip>
              </td>
              <td class="d-flex gap-2">
                <v-btn
                  size="small"
                  color="success"
                  variant="text"
                  @click="markComplete(reminder.id)"
                  v-if="reminder.status === 'Pending'"
                >
                  Complete
                </v-btn>
                <v-btn
                  size="small"
                  color="primary"
                  variant="text"
                  @click="editReminder(reminder)"
                >
                  Edit
                </v-btn>
                <v-btn
                  size="small"
                  color="error"
                  variant="text"
                  @click="deleteReminder(reminder.id)"
                >
                  Delete
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="showDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editingReminder ? 'Edit Reminder' : 'Create Reminder' }}</span>
        </v-card-title>

        <v-card-text>
          <v-form @submit.prevent="handleSubmit">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.title"
                    label="Title"
                    required
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="12">
                  <v-select
                    v-model="formData.lead_id"
                    label="Lead"
                    :items="leads"
                    item-title="name"
                    item-value="id"
                    required
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="formData.description"
                    label="Description"
                    variant="outlined"
                    rows="3"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-date-picker
                    v-model="formData.due_date"
                    label="Due Date"
                    required
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-time-picker
                    v-model="formData.due_time"
                    label="Due Time"
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
            @click="closeDialog"
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
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
// import { format } from 'date-fns'
import { useReminderStore } from '@/services/reminders'
import { useLeadStore } from '@/services/leads'

const reminderStore = useReminderStore()
const leadStore = useLeadStore()

// State
const reminders = ref([])
const leads = ref([])
const loading = ref(true)
const submitting = ref(false)
const showDialog = ref(false)
const editingReminder = ref(null)
const filterStatus = ref('All')
const filterLead = ref(null)

const formData = ref({
  title: '',
  description: '',
  lead_id: null,
  due_date: null,
  due_time: null
})

// Computed
const filteredReminders = computed(() => {
  let filtered = [...reminders.value]

  if (filterStatus.value !== 'All') {
    filtered = filtered.filter(r => r.status === filterStatus.value)
  }

  if (filterLead.value) {
    filtered = filtered.filter(r => r.lead_id === filterLead.value)
  }

  return filtered
})

// Methods
// const formatDate = (date) => {
//   return format(new Date(date), 'MMM dd, yyyy HH:mm')
// }

const formatDate = (date) => new Date(date).toLocaleDateString()

const getStatusColor = (status) => {
  const colors = {
    Pending: 'warning',
    Completed: 'success',
    Overdue: 'error'
  }
  return colors[status] || 'grey'
}

const openReminderDialog = () => {
  editingReminder.value = null
  formData.value = {
    title: '',
    description: '',
    lead_id: null,
    due_date: null,
    due_time: null
  }
  showDialog.value = true
}

const editReminder = (reminder) => {
  editingReminder.value = reminder
  formData.value = {
    title: reminder.title,
    description: reminder.description,
    lead_id: reminder.lead_id,
    due_date: reminder.due_date.split('T')[0],
    due_time: reminder.due_date.split('T')[1].slice(0, 5)
  }
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
  editingReminder.value = null
  formData.value = {
    title: '',
    description: '',
    lead_id: null,
    due_date: null,
    due_time: null
  }
}

const handleSubmit = async () => {
  try {
    submitting.value = true

    const reminderData = {
      ...formData.value,
      due_date: `${formData.value.due_date}T${formData.value.due_time}`
    }

    if (editingReminder.value) {
      await reminderStore.updateReminder(editingReminder.value.id, reminderData)
    } else {
      await reminderStore.createReminder(reminderData)
    }

    await fetchReminders()
    closeDialog()
  } catch (error) {
    console.error('Error saving reminder:', error)
  } finally {
    submitting.value = false
  }
}

const markComplete = async (id) => {
  try {
    await reminderStore.updateReminder(id, { status: 'Completed' })
    await fetchReminders()
  } catch (error) {
    console.error('Error completing reminder:', error)
  }
}

const deleteReminder = async (id) => {
  if (confirm('Are you sure you want to delete this reminder?')) {
    try {
      await reminderStore.deleteReminder(id)
      await fetchReminders()
    } catch (error) {
      console.error('Error deleting reminder:', error)
    }
  }
}

const fetchReminders = async () => {
  try {
    loading.value = true
    reminders.value = await reminderStore.getReminders()
  } catch (error) {
    console.error('Error fetching reminders:', error)
  } finally {
    loading.value = false
  }
}

const fetchLeads = async () => {
  try {
    leads.value = await leadStore.getLeads()
  } catch (error) {
    console.error('Error fetching leads:', error)
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([fetchReminders(), fetchLeads()])
})
</script>

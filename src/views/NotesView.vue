<template>
  <v-app>
    <Navigation />

    <v-main>
      <v-container class="py-6">
        <!-- Header -->
        <v-row align="center" justify="space-between" class="mb-6">
          <v-col>
            <h1 class="text-h4 font-weight-bold">Notes</h1>
          </v-col>
          <v-btn color="primary" @click="openCreateModal" prepend-icon="mdi-plus">
            Add Note
          </v-btn>
        </v-row>

        <!-- Notes Table -->
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
                  <th class="text-left">Content</th>
                  <th class="text-left">Created At</th>
                  <th class="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="note in notes" :key="note.id">
                  <td>{{ note.lead?.name || 'No Lead' }}</td>
                  <td>{{ note.content }}</td>
                  <td>{{ formatDate(note.created_at) }}</td>
                  <td>
                    <v-btn
                      size="small"
                      color="primary"
                      variant="text"
                      class="mr-2"
                      @click="editNote(note)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      size="small"
                      color="error"
                      variant="text"
                      @click="deleteNote(note.id)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <!-- Modal -->
        <v-dialog v-model="showModal" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ editingNote ? 'Edit Note' : 'Create Note' }}</span>
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

                    <!-- Content Field -->
                    <v-col cols="12">
                      <v-textarea
                        v-model="formData.content"
                        label="Content"
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
                {{ editingNote ? 'Update' : 'Create' }}
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
import { notesService } from '@/services/notes'

// State
const notes = ref([])
const leads = ref([])
const loading = ref(true)
const showModal = ref(false)
const editingNote = ref(null)
const formData = ref({ lead_id: null, content: '' })

// Helper: Format Date
const formatDate = (date) => new Date(date).toLocaleDateString()

// Fetch Notes and Leads
const fetchNotesAndLeads = async () => {
  try {
    loading.value = true
    notes.value = await notesService.getNotes()
    leads.value = await notesService.getLeads()
  } catch (error) {
    console.error('Error fetching notes and leads:', error)
  } finally {
    loading.value = false
  }
}

// Open Modal for Create
const openCreateModal = () => {
  editingNote.value = null
  formData.value = { lead_id: null, content: '' }
  showModal.value = true
}

// Open Modal for Edit
const editNote = (note) => {
  editingNote.value = note
  formData.value = {
    lead_id: note.lead?.id || null,
    content: note.content
  }
  showModal.value = true
}

// Close Modal
const closeModal = () => {
  showModal.value = false
  editingNote.value = null
  formData.value = { lead_id: null, content: '' }
}

// Handle Submit
const handleSubmit = async () => {
  try {
    if (editingNote.value) {
      await notesService.updateNote(editingNote.value.id, formData.value)
    } else {
      await notesService.createNote(formData.value)
    }
    await fetchNotesAndLeads()
    closeModal()
  } catch (error) {
    console.error('Error saving note:', error)
  }
}

// Delete Note
const deleteNote = async (id) => {
  if (confirm('Are you sure you want to delete this note?')) {
    try {
      await notesService.deleteNote(id)
      await fetchNotesAndLeads()
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }
}

// Lifecycle Hook
onMounted(() => {
  fetchNotesAndLeads()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <Navigation />
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="px-4 sm:px-0 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Notes</h1>
        <button @click="openCreateModal" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Add Note
        </button>
      </div>

      <!-- Notes Table -->
      <div class="mt-8 bg-white shadow rounded-lg">
        <div class="p-6">
          <div v-if="loading" class="text-center py-4">Loading...</div>
          <table v-else class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="note in notes" :key="note.id">
                <td class="px-6 py-4 whitespace-nowrap">{{ note.lead.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ note.content }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(note.created_at) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button @click="editNote(note)" class="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                  <button @click="deleteNote(note.id)" class="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white rounded-lg p-8 max-w-md w-full">
          <h2 class="text-2xl font-bold mb-4">{{ editingNote ? 'Edit Note' : 'Create Note' }}</h2>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Lead</label>
              <select v-model="formData.lead_id" required class="mt-1 block w-full rounded-md border border-gray-300 p-2">
                <option value="" disabled>Select Lead</option>
                <option v-for="lead in leads" :key="lead.id" :value="lead.id">{{ lead.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                v-model="formData.content"
                required
                placeholder="Enter note content"
                class="mt-1 block w-full rounded-md border border-gray-300 p-2"
              ></textarea>
            </div>
            <div class="flex justify-end space-x-4">
              <button @click="closeModal" type="button" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
                Cancel
              </button>
              <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                {{ editingNote ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
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
  formData.value = { lead_id: note.lead.id, content: note.content }
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

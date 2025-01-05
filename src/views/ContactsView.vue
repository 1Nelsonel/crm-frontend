<template>
  <div class="min-h-screen bg-gray-100">
    <Navigation />
    <div
      v-if="message"
      :class="`fixed top-4 right-4 px-4 py-2 rounded-md shadow-md ${
        messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`"
    >
      {{ message }}
    </div>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="px-4 sm:px-0 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Contacts</h1>
        <button @click="openCreateModal" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Add Contact
        </button>
      </div>

      <!-- Contacts Table -->
      <div class="mt-8 bg-white shadow rounded-lg">
        <div class="p-6">
          <div v-if="loading" class="text-center py-4">Loading...</div>
          <table v-else class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="contact in contacts" :key="contact.id">
                <td class="px-6 py-4 whitespace-nowrap">{{ contact.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ contact.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ contact.phone }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ contact.lead?.name || 'No Lead' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button @click="editContact(contact)" class="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                  <button @click="deleteContact(contact.id)" class="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white rounded-lg p-8 max-w-md w-full">
          <h2 class="text-2xl font-bold mb-4">{{ editingContact ? 'Edit Contact' : 'Create Contact' }}</h2>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <input v-model="formData.name" type="text" required class="mt-1 block w-full rounded-md border border-gray-300 p-2" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input v-model="formData.email" type="email" required class="mt-1 block w-full rounded-md border border-gray-300 p-2" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Phone</label>
              <input v-model="formData.phone" type="tel" required class="mt-1 block w-full rounded-md border border-gray-300 p-2" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Lead</label>
              <select v-model="formData.lead_id" class="mt-1 block w-full rounded-md border border-gray-300 p-2">
                <option value="" disabled>Select Lead</option>
                <option v-for="lead in leads" :key="lead.id" :value="lead.id">{{ lead.name }}</option>
              </select>
            </div>
            <div class="flex justify-end space-x-4">
              <button @click="closeModal" type="button" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
                Cancel
              </button>
              <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                {{ editingContact ? 'Update' : 'Create' }}
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
import { contactService } from '@/services/contacts'

// State
const contacts = ref([])
const leads = ref([])
const loading = ref(true)
const showModal = ref(false)
const editingContact = ref(null)
const formData = ref({ name: '', email: '', phone: '', lead_id: null })
const message = ref(null) // Message to display in the UI
const messageType = ref('success') // Type of message to display

// Methods
const fetchContacts = async () => {
  try {
    loading.value = true
    contacts.value = await contactService.getContacts()
    leads.value = await contactService.getLeads()
  } catch (error) {
    console.error('Error fetching contacts:', error)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  editingContact.value = null
  formData.value = { name: '', email: '', phone: '', lead_id: null }
  showModal.value = true
}

const editContact = (contact) => {
  editingContact.value = contact
  formData.value = {
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    lead_id: contact.lead?.id || null // Map lead's ID for editing
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingContact.value = null
  formData.value = { name: '', email: '', phone: '', lead_id: null }
}

const handleSubmit = async () => {
  try {
    let response
    if (editingContact.value) {
      response = await contactService.updateContact(editingContact.value.id, formData.value)
    } else {
      response = await contactService.createContact(formData.value)
    }

    // Extract and display the message
    message.value = response.message
    messageType.value = 'success'

    await fetchContacts()
    closeModal()
  } catch (error) {
    // Handle errors and display the message
    if (error.response && error.response.data.message) {
      message.value = error.response.data.message
    } else {
      message.value = 'An error occurred. Please try again.'
    }
    messageType.value = 'error'

    console.error('Error saving contact:', error)
  }
}


const deleteContact = async (id) => {
  if (confirm('Are you sure you want to delete this contact?')) {
    try {
      const response = await contactService.deleteContact(id)

      // Extract and display the message
      message.value = response.message
      messageType.value = 'success'

      await fetchContacts()
    } catch (error) {
      // Handle errors and display the message
      if (error.response && error.response.data.message) {
        message.value = error.response.data.message
      } else {
        message.value = 'An error occurred. Please try again.'
      }
      messageType.value = 'error'

      console.error('Error deleting contact:', error)
    }
  }
}



// Lifecycle
onMounted(() => {
  fetchContacts()
})
</script>

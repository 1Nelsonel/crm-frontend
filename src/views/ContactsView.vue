<template>
  <v-app>
    <Navigation />
    <v-snackbar v-model="snackbar" :color="snackbarType" timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>

    <v-container class="py-6">
      <!-- Header -->
      <v-row align="center" justify="space-between" class="mb-6">
        <v-col>
          <h1 class="text-h4 font-weight-bold">Contacts</h1>
        </v-col>
        <v-btn color="primary" @click="openCreateModal" prepend-icon="mdi-plus">
          Add Contact
        </v-btn>
      </v-row>

      <!-- Contacts Table -->
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
                <th class="text-left">Name</th>
                <th class="text-left">Email</th>
                <th class="text-left">Phone</th>
                <th class="text-left">Lead</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="contact in contacts" :key="contact.id">
                <td>{{ contact.name }}</td>
                <td>{{ contact.email }}</td>
                <td>{{ contact.phone }}</td>
                <td>{{ contact.lead?.name || 'No Lead' }}</td>
                <td>
                  <v-btn
                    size="small"
                    color="primary"
                    variant="text"
                    class="mr-2"
                    @click="editContact(contact)"
                  >
                    <v-icon>$edit</v-icon>
                  </v-btn>
                  <v-btn
                    size="small"
                    color="error"
                    variant="text"
                    @click="deleteContact(contact.id)"
                  >
                    <v-icon>$delete</v-icon>
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
            <span class="text-h5">{{ editingContact ? 'Edit Contact' : 'Create Contact' }}</span>
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <v-container>
                <v-row>
                  <!-- Name Field -->
                  <v-col cols="12">
                    <v-text-field
                      v-model="formData.name"
                      label="Name"
                      required
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>

                  <!-- Email Field -->
                  <v-col cols="12">
                    <v-text-field
                      v-model="formData.email"
                      label="Email"
                      type="email"
                      required
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>

                  <!-- Phone Field -->
                  <v-col cols="12">
                    <v-text-field
                      v-model="formData.phone"
                      label="Phone"
                      type="tel"
                      required
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>

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
              {{ editingContact ? 'Update' : 'Create' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-container>
  </v-app>
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

const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarType = ref('success')

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
    lead_id: contact.lead?.id || null,
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
    if (editingContact.value) {
      await contactService.updateContact(editingContact.value.id, formData.value)
    } else {
      await contactService.createContact(formData.value)
    }
    snackbarMessage.value = editingContact.value ? 'Contact updated!' : 'Contact created!'
    snackbarType.value = 'success'
    snackbar.value = true
    await fetchContacts()
    closeModal()
  } catch (error) {
    snackbarMessage.value = 'An error occurred!'
    snackbarType.value = 'error'
    snackbar.value = true
    console.error('Error saving contact:', error)
  }
}

const deleteContact = async (id) => {
  if (confirm('Are you sure you want to delete this contact?')) {
    try {
      await contactService.deleteContact(id)
      snackbarMessage.value = 'Contact deleted!'
      snackbarType.value = 'success'
      snackbar.value = true
      await fetchContacts()
    } catch (error) {
      snackbarMessage.value = 'An error occurred!'
      snackbarType.value = 'error'
      snackbar.value = true
      console.error('Error deleting contact:', error)
    }
  }
}

// Lifecycle
onMounted(() => {
  fetchContacts()
})
</script>

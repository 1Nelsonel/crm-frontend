<template>
  <v-app>
    <Navigation />

    <v-main>
      <v-container class="py-6">
        <!-- Header -->
        <v-row class="mb-6">
          <v-col class="d-flex justify-space-between align-center">
            <h1 class="text-h4 font-weight-bold">Leads</h1>
            <v-btn
              color="primary"
              @click="openCreateModal"
              prepend-icon="mdi-plus"
            >
              Add Lead
            </v-btn>
          </v-col>
        </v-row>

        <!-- Leads Table -->
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
                  <th class="text-left">Company</th>
                  <th class="text-left">Email</th>
                  <th class="text-left">Status</th>
                  <th class="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="lead in leads" :key="lead.id">
                  <td>{{ lead.name }}</td>
                  <td>{{ lead.company }}</td>
                  <td>{{ lead.email }}</td>
                  <td>
                    <v-chip
                      :color="getStatusColor(lead.status)"
                      size="small"
                      class="text-uppercase"
                    >
                      {{ lead.status }}
                    </v-chip>
                  </td>
                  <td>
                    <v-btn
                      size="small"
                      color="primary"
                      variant="text"
                      class="mr-2"
                      @click="editLead(lead)"
                    >
                      <v-icon>$edit</v-icon>
                    </v-btn>
                    <v-btn
                      size="small"
                      color="error"
                      variant="text"
                      @click="deleteLead(lead.id)"
                    >
                      <v-icon>$delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <!-- Create/Edit Dialog -->
        <v-dialog v-model="showModal" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ editingLead ? 'Edit Lead' : 'Create Lead' }}</span>
            </v-card-title>

            <v-card-text>
              <v-form @submit.prevent="handleSubmit">
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="formData.name"
                        label="Name"
                        required
                        variant="outlined"
                        density="comfortable"
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-text-field
                        v-model="formData.company"
                        label="Company"
                        required
                        variant="outlined"
                        density="comfortable"
                      />
                    </v-col>

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

                    <v-col cols="12">
                      <v-select
                        v-model="formData.status"
                        label="Status"
                        :items="['Active', 'Contacted', 'Pending', 'Closed']"
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
                {{ editingLead ? 'Update' : 'Create' }}
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
import { leadsService } from '@/services/leads'

// State
const leads = ref([])
const loading = ref(true)
const showModal = ref(false)
const editingLead = ref(null)
const formData = ref({
  name: '',
  company: '',
  email: '',
  phone: '',
  status: 'Active'
})

// Methods
const getStatusColor = (status) => {
  const colors = {
    Active: 'success',
    Contacted: 'info',
    Pending: 'warning',
    Closed: 'error'
  }
  return colors[status] || 'grey'
}

const fetchLeads = async () => {
  try {
    loading.value = true
    leads.value = await leadsService.getLeads()
  } catch (error) {
    console.error('Error fetching leads:', error)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  editingLead.value = null
  formData.value = {
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'Active'
  }
  showModal.value = true
}

const editLead = (lead) => {
  editingLead.value = lead
  formData.value = { ...lead }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingLead.value = null
  formData.value = {
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'Active'
  }
}

const handleSubmit = async () => {
  try {
    if (editingLead.value) {
      await leadsService.updateLead(editingLead.value.id, formData.value)
    } else {
      await leadsService.createLead(formData.value)
    }
    await fetchLeads()
    closeModal()
  } catch (error) {
    console.error('Error saving lead:', error)
  }
}

const deleteLead = async (id) => {
  if (confirm('Are you sure you want to delete this lead?')) {
    try {
      await leadsService.deleteLead(id)
      await fetchLeads()
    } catch (error) {
      console.error('Error deleting lead:', error)
    }
  }
}

// Lifecycle
onMounted(() => {
  fetchLeads()
})
</script>

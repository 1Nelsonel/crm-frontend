<template>
  <v-app>
    <Navigation />

    <v-main>
      <v-container class="py-6">
        <!-- Dashboard Header -->
        <v-row>
          <v-col>
            <h1 class="text-h4 font-weight-bold">Dashboard</h1>
          </v-col>
        </v-row>

        <!-- Stats Overview -->
        <v-row>
          <v-col
            v-for="stat in stats"
            :key="stat.name"
            cols="12"
            sm="6"
            lg="3"
          >
            <v-card elevation="2" class="h-100">
              <v-card-text>
                <div class="d-flex flex-column">
                  <span class="text-subtitle-1 text-medium-emphasis">
                    {{ stat.name }}
                  </span>
                  <span class="text-h4 font-weight-bold mt-1">
                    {{ stat.value }}
                  </span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Recent Activity -->
        <v-row class="mt-8">
          <v-col>
            <h2 class="text-h6 font-weight-medium mb-4">Recent Activity</h2>
            <v-card elevation="2">
              <v-card-text>
                <v-progress-circular
                  v-if="loading"
                  indeterminate
                  color="primary"
                  class="d-flex mx-auto"
                />

                <div
                  v-else-if="recentActivity.length === 0"
                  class="text-center text-medium-emphasis"
                >
                  No recent activity
                </div>

                <v-list v-else>
                  <v-list-item
                    v-for="activity in recentActivity"
                    :key="activity.id"
                    class="py-2"
                  >
                    <v-list-item-content>
                      <v-list-item-title class="text-body-1">
                        {{ activity.description }}
                      </v-list-item-title>
                      <v-list-item-subtitle class="text-medium-emphasis">
                        {{ activity.timestamp }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navigation from '@/components/Navigation.vue'

const loading = ref(true)
const stats = ref([
  { name: 'Total Leads', value: 0 },
  { name: 'Active Contacts', value: 0 },
  { name: 'Pending Reminders', value: 0 },
  { name: 'Recent Notes', value: 0 }
])
const recentActivity = ref([])

const fetchDashboardData = async () => {
  try {
    // TODO: Replace with actual API calls
    // Simulated API response
    stats.value = [
      { name: 'Total Leads', value: 24 },
      { name: 'Active Contacts', value: 42 },
      { name: 'Pending Reminders', value: 8 },
      { name: 'Recent Notes', value: 15 }
    ]
    recentActivity.value = [
      {
        id: 1,
        description: 'New lead created: John Doe',
        timestamp: '2 hours ago'
      },
      {
        id: 2,
        description: 'Contact updated: Jane Smith',
        timestamp: '4 hours ago'
      }
    ]
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>

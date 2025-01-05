<template>
  <v-app>
    <Navigation />

    <v-main>
      <v-container class="py-6">

        <!-- Dashboard Header -->
        <v-row>
          <v-col>
            <h1 class="text-h4 font-weight-bold mb-4">Dashboard</h1>
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
            <v-card class="elevation-2 rounded-lg h-100" :style="{ backgroundColor: '#fafafa' }">
              <v-card-text>
                <div class="d-flex flex-column">
                  <span class="text-subtitle-1 text-medium-emphasis">{{ stat.name }}</span>
                  <span class="text-h4 font-weight-bold mt-2">{{ stat.value }}</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Recent Activity -->
        <v-row class="mt-8">
          <v-col>
            <h2 class="text-h6 font-weight-medium mb-4">Recent Activity</h2>
            <v-card class="elevation-2 rounded-lg">
              <v-card-text>
                <v-progress-circular
                  v-if="loading"
                  indeterminate
                  color="primary"
                  class="d-flex mx-auto"
                />
                <div v-else-if="recentActivity.length === 0" class="text-center text-medium-emphasis">
                  No recent activity
                </div>

                <v-list v-else>
                  <v-list-item
                    v-for="activity in recentActivity"
                    :key="activity.id"
                    class="py-2 hover--scale-up"
                  >
                    <v-list-item-content>
                      <v-list-item-title class="text-body-1 font-weight-bold">
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
import { ref, onMounted } from 'vue';
import Navigation from '@/components/Navigation.vue';

const loading = ref(true);
const stats = ref([
  { name: 'Total Leads', value: 0 },
  { name: 'Active Contacts', value: 0 },
  { name: 'Pending Reminders', value: 0 },
  { name: 'Recent Notes', value: 0 }
]);
const recentActivity = ref([]);

const fetchDashboardData = async () => {
  try {
    // const response = await fetch('http://localhost:8000/api/dashboard/', {
    //   headers: {
    //     Authorization: `Token ${localStorage.getItem('token')}`
    //   }
    // });

    const baseURL = import.meta.env.VITE_API_URL;
    const response = await fetch(`${baseURL}/api/dashboard/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    });

    const data = await response.json();
    if (data.status === 'success') {
      stats.value = [
        { name: 'Total Leads', value: data.data.stats.total_leads },
        { name: 'Active Contacts', value: data.data.stats.active_contacts },
        { name: 'Pending Reminders', value: data.data.stats.pending_reminders },
        { name: 'Recent Notes', value: data.data.stats.recent_notes }
      ];
      recentActivity.value = data.data.recent_activity;
    } else {
      console.error('Error fetching dashboard data:', data.message);
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
/* Additional styling for the dashboard */
.hover--scale-up:hover {
  transform: scale(1.03);
  transition: transform 0.2s ease-in-out;
}

.v-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.v-card-text {
  padding: 20px;
}

.v-row {
  margin-bottom: 20px;
}

.text-h4 {
  color: #333;
}

.text-h6 {
  color: #444;
}

.font-weight-bold {
  font-weight: 600;
}

.font-weight-medium {
  font-weight: 500;
}
</style>

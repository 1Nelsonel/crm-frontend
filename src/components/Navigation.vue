<template>
  <v-app-bar color="grey-darken-4">
    <v-container class="px-4">
      <div class="d-flex align-center w-100">
        <!-- Logo -->
        <router-link
          to="/dashboard"
          class="text-h6 font-weight-bold text-white text-decoration-none"
        >
          Mini CRM
        </router-link>
        <v-spacer></v-spacer>

        <!-- Desktop Navigation -->
        <div class="d-none d-md-block">
          <v-tabs
            v-model="activeTab"
            color="white"
            class="ml-4"
          >
            <v-tab
              v-for="item in navigationItems"
              :key="item.path"
              :to="item.path"
              :value="item.path"
              class="text-white"
            >
              {{ item.name }}
            </v-tab>
          </v-tabs>
        </div>

        <!-- Desktop User Menu -->
        <v-menu location="bottom end" class="d-none d-md-block">
          <template v-slot:activator="{ props }">
            <v-btn
              color="transparent"
              v-bind="props"
              class="text-white ml-4"
            >
              <v-avatar size="32" color="primary" class="mr-2">
                <span class="text-caption">{{ userInitials }}</span>
              </v-avatar>
              <span class="mr-2 text-subtitle-2">{{ authStore.user?.username }}</span>
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list min-width="200">
            <v-list-item>
              <v-list-item-title class="text-subtitle-2 font-weight-bold">
                {{ authStore.user?.username }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ authStore.user?.email || 'user@example.com' }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="handleLogout" color="error">
              <template v-slot:prepend>
                <v-icon color="error">mdi-logout</v-icon>
              </template>
              <v-list-item-title class="text-error">Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- Mobile Menu Button -->
        <v-app-bar-nav-icon
          class="d-md-none text-white ml-4"
          @click="drawer = !drawer"
        ></v-app-bar-nav-icon>
      </div>
    </v-container>
  </v-app-bar>

  <!-- Mobile Navigation Drawer -->
  <v-navigation-drawer
    v-model="drawer"
    location="right"
    temporary
    class="bg-grey-darken-4"
  >
    <!-- User Profile Section in Drawer -->
    <v-list class="pa-4">
      <v-list-item class="mb-4">
        <v-avatar size="48" color="primary" class="mb-2">
          <span class="text-h6">{{ userInitials }}</span>
        </v-avatar>
        <v-list-item-title class="text-white text-h6 mt-2">
          {{ authStore.user?.username }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-grey">
          {{ authStore.user?.email || 'user@example.com' }}
        </v-list-item-subtitle>
      </v-list-item>
      <v-divider class="mb-4"></v-divider>
    </v-list>

    <!-- Navigation Items -->
    <v-list nav class="pa-2">
      <v-list-item
        v-for="item in navigationItems"
        :key="item.path"
        :to="item.path"
        :value="item.path"
        color="white"
        class="mb-2"
      >
        <v-list-item-title class="text-white">
          {{ item.name }}
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <!-- Logout Button at Bottom -->
    <template v-slot:append>
      <div class="pa-4">
        <v-btn
          block
          color="error"
          variant="tonal"
          @click="handleLogout"
          class="mb-4"
        >
          <v-icon start>mdi-logout</v-icon>
          Logout
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const activeTab = ref(route.path)
const drawer = ref(false)

const username = computed(() => authStore.user?.username || 'User')
const userInitials = computed(() => {
  const name = authStore.user?.username || 'User'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const navigationItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Leads', path: '/leads' },
  { name: 'Contacts', path: '/contacts' },
  { name: 'Notes', path: '/notes' },
  { name: 'Reminders', path: '/reminders' }
]

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
  drawer.value = false
}
</script>

<style scoped>
:deep(.v-tab) {
  text-transform: none;
}

:deep(.v-list-item--active) {
  background: rgba(5, 5, 5, 0.1);
}
</style>

<template>
  <nav class="bg-gray-800 text-white">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <router-link to="/dashboard" class="text-xl font-bold">
            Mini CRM
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-center space-x-4">
            <router-link
              v-for="item in navigationItems"
              :key="item.path"
              :to="item.path"
              class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
              :class="{ 'bg-gray-900': isCurrentPath(item.path) }"
            >
              {{ item.name }}
            </router-link>
          </div>
        </div>

        <!-- User Menu -->
        <div class="flex items-center">
          <div class="ml-3 relative">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-2 text-sm rounded-full focus:outline-none"
            >
              <span>{{ username }}</span>
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="showUserMenu"
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
            >
              <div class="py-1">
                <button
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const showUserMenu = ref(false)
const username = computed(() => authStore.user?.name || 'User')

const navigationItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Leads', path: '/leads' },
  { name: 'Contacts', path: '/contacts' },
  { name: 'Notes', path: '/notes' },
  { name: 'Reminders', path: '/reminders' }
]

const isCurrentPath = (path) => route.path === path

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleLogout = async () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-6">
    <div class="w-full max-w-sm md:max-w-md lg:max-w-lg rounded-xl bg-white p-12 shadow-xl">
      <h2 class="mb-8 text-center text-4xl font-extrabold text-gray-800">
        Login to CRM
      </h2>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Username</label>
          <input
            v-model="username"
            type="text"
            required
            placeholder="Enter your username"
            class="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="Enter your password"
            class="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <!-- Error message -->
        <div
          v-if="error"
          class="rounded-md bg-red-50 p-3 text-sm text-red-600"
          aria-live="polite"
        >
          {{ error }}
        </div>

        <button
          type="submit"
          class="w-full rounded-lg bg-indigo-600 px-5 py-3 text-lg font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          :disabled="loading"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <p class="mt-8 text-center text-sm text-gray-600">
        Don't have an account?
        <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-800">
          Register here
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''

    const { success, error: serverError } = await authStore.login(username.value, password.value)
    if (success) {
      router.push('/dashboard')
    } else {
      error.value = serverError || 'Invalid credentials'
    }
  } catch (err) {
    error.value = 'An unexpected error occurred during login. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

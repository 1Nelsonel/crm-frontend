<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-6">
    <div class="w-full max-w-4xl rounded-xl bg-white p-10 shadow-xl">
      <h2 class="mb-8 text-center text-4xl font-extrabold text-gray-800">Create an Account</h2>

      <form
        @submit.prevent="handleRegister"
        class="grid gap-6 sm:grid-cols-1 lg:grid-cols-2"
      >
        <div>
          <label class="block text-sm font-medium text-gray-700">First Name</label>
          <input
            v-model="first_name"
            type="text"
            required
            placeholder="Enter your first name"
            class="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            v-model="last_name"
            type="text"
            required
            placeholder="Enter your last name"
            class="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Username</label>
          <input
            v-model="username"
            type="text"
            required
            placeholder="Choose a username"
            class="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="Enter your email"
            class="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="Enter a password"
            class="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            v-model="password2"
            type="password"
            required
            placeholder="Confirm your password"
            class="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div v-if="error" class="col-span-full rounded-md bg-red-50 p-3 text-sm text-red-600">
          {{ error }}
        </div>

        <div class="col-span-full">
          <button
            type="submit"
            class="w-full rounded-lg bg-indigo-600 px-5 py-3 text-lg font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            :disabled="loading"
          >
            {{ loading ? 'Registering...' : 'Register' }}
          </button>
        </div>
      </form>

      <p class="mt-6 text-center text-sm text-gray-600">
        Already have an account?
        <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-800">
          Login here
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

const first_name = ref('')
const last_name = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const password2 = ref('')
const error = ref('')
const loading = ref(false)

const handleRegister = async () => {
  try {
    if (password.value !== password2.value) {
      error.value = 'Passwords do not match'
      return
    }

    loading.value = true
    error.value = ''

    // Call the register method
    const { success, error: registerError } = await authStore.register({
      username: username.value,
      email: email.value,
      first_name: first_name.value,
      last_name: last_name.value,
      password: password.value,
      password2: password2.value
    })

    if (success) {
      router.push('/dashboard')
    } else {
      console.log(registerError)
      error.value = registerError || 'Registration failed'
    }
  } catch (err) {
    error.value = 'An unexpected error occurred during registration'
  } finally {
    loading.value = false
  }
}

</script>

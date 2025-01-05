<template>
  <v-app>
    <v-main class="bg-primary">
      <v-container class="fill-height">
        <v-row justify="center" align="center">
          <v-col cols="12" sm="8" md="6" lg="4">
            <v-card class="pa-8" elevation="8" rounded="lg">
              <v-card-title class="text-h4 font-weight-bold text-center mb-8">
                Login to CRM
              </v-card-title>

              <v-form @submit.prevent="handleLogin">
                <v-text-field
                  v-model="username"
                  label="Username"
                  placeholder="Enter your username"
                  variant="outlined"
                  required
                  :disabled="loading"
                  class="mb-4"
                />

                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  variant="outlined"
                  required
                  :disabled="loading"
                  class="mb-4"
                />

                <v-alert
                  v-if="error"
                  type="error"
                  variant="tonal"
                  class="mb-4"
                >
                  {{ error }}
                </v-alert>

                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  block
                  :loading="loading"
                  class="mb-6"
                >
                  {{ loading ? 'Logging in...' : 'Login' }}
                </v-btn>
              </v-form>

              <div class="text-center text-body-2">
                Don't have an account?
                <v-btn
                  variant="text"
                  color="primary"
                  class="ml-1"
                  :to="'/register'"
                >
                  Register here
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
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

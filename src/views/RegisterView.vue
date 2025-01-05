<template>
  <v-app>
    <v-main class="bg-primary">
      <v-container class="fill-height">
        <v-row justify="center" align="center">
          <v-col cols="12" sm="10" md="8" lg="6">
            <v-card class="pa-8" elevation="8" rounded="lg">
              <v-card-title class="text-h4 font-weight-bold text-center mb-8">
                Create an Account
              </v-card-title>

              <v-form @submit.prevent="handleRegister">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="first_name"
                      label="First Name"
                      placeholder="Enter your first name"
                      variant="outlined"
                      required
                      :disabled="loading"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="last_name"
                      label="Last Name"
                      placeholder="Enter your last name"
                      variant="outlined"
                      required
                      :disabled="loading"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="username"
                      label="Username"
                      placeholder="Choose a username"
                      variant="outlined"
                      required
                      :disabled="loading"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="email"
                      label="Email"
                      type="email"
                      placeholder="Enter your email"
                      variant="outlined"
                      required
                      :disabled="loading"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="password"
                      label="Password"
                      type="password"
                      placeholder="Enter a password"
                      variant="outlined"
                      required
                      :disabled="loading"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="password2"
                      label="Confirm Password"
                      type="password"
                      placeholder="Confirm your password"
                      variant="outlined"
                      required
                      :disabled="loading"
                    />
                  </v-col>

                  <!-- Show all error messages -->
                  <v-col cols="12" v-if="errors && errors.length">
                    <v-alert
                      v-for="(error, index) in errors"
                      :key="index"
                      type="error"
                      variant="tonal"
                      class="mb-2"
                    >
                      {{ error }}
                    </v-alert>
                  </v-col>

                  <v-col cols="12">
                    <v-btn
                      type="submit"
                      color="primary"
                      size="large"
                      block
                      :loading="loading"
                      class="mb-6"
                    >
                      {{ loading ? 'Registering...' : 'Register' }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>

              <div class="text-center text-body-2">
                Already have an account?
                <v-btn
                  variant="text"
                  color="primary"
                  class="ml-1"
                  :to="'/login'"
                >
                  Login here
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

const first_name = ref('')
const last_name = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const password2 = ref('')
const errors = ref([]) // Store all errors
const loading = ref(false)

const handleRegister = async () => {
  try {
    if (password.value !== password2.value) {
      errors.value = ['Passwords do not match']
      return
    }

    loading.value = true
    errors.value = []

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
      // Collect and show all error messages
      if (registerError && typeof registerError === 'object') {
        errors.value = Object.entries(registerError).flatMap(([field, messages]) =>
          messages.map(message => `${field}: ${message}`)
        )
      } else {
        errors.value = [registerError || 'Registration failed']
      }
    }
  } catch (err) {
    errors.value = ['An unexpected error occurred during registration']
  } finally {
    loading.value = false
  }
}
</script>

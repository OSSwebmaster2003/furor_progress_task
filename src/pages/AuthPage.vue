<script setup>
import { ref, watchEffect } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import CustomInput from '../components/CustomInput.vue'

const auth = useAuthStore()
const router = useRouter()

const form = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const isSignUp = ref(false)
const showPassword = ref(false)

function handleSubmit() {
  if (isSignUp.value) {
    auth.signup(form.value, router)
  } else {
    auth.signin(form.value, router)
  }
}

function switchMode() {
  isSignUp.value = !isSignUp.value
  showPassword.value = false
}

watchEffect(() => {
  if (auth.user) {
    router.push('/')
  }
})
</script>

<template>
  <q-page class="flex flex-center">
    <div class="q-pa-lg bg-mainColor shadow-md" style="width: 700px; border-radius: 10px">
      <div class="q-mb-md flex flex-center">
        <q-avatar size="50px" font-size="32px" color="success" text-color="white" icon="lock" />
      </div>
      <h5 class="text-h5 text-center text-white q-mb-md">
        {{ isSignUp ? 'Sign Up' : 'Sign In' }}
      </h5>

      <q-form @submit.prevent="handleSubmit">
        <div v-if="auth.error" class="text-negative text-center q-mb-sm">
          {{ auth.error }}
        </div>

        <div class="row q-col-gutter-md">
          <template v-if="isSignUp">
            <div class="col-6">
              <CustomInput name="firstName" label="First Name" v-model="form.firstName" autofocus />
            </div>
            <div class="col-6">
              <CustomInput name="lastName" label="Last Name" v-model="form.lastName" />
            </div>
            <div class="col-12">
              <CustomInput name="username" label="Username" v-model="form.username" />
            </div>
          </template>

          <div class="col-12">
            <CustomInput name="email" label="Email" v-model="form.email" type="email" />
          </div>

          <div class="col-12">
            <CustomInput
              name="password"
              label="Password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              @toggle-visibility="showPassword = !showPassword"
            />
          </div>

          <div v-if="isSignUp" class="col-12">
            <CustomInput
              name="confirmPassword"
              label="Repeat Password"
              v-model="form.confirmPassword"
              type="password"
            />
          </div>
        </div>

        <q-btn
          type="submit"
          label="Submit"
          color="primary"
          class="full-width q-mt-md"
          :loading="auth.isLoading"
        />

        <div class="q-mt-md text-caption text-right">
          <q-btn
            flat
            :label="isSignUp ? 'Sign In' : 'Sign Up'"
            @click="switchMode"
            class="text-placeholderColor"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<style scoped>
.bg-mainColor {
  background-color: #191e2e;
}
.text-placeholderColor {
  color: #ccc;
}
</style>

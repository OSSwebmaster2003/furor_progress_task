<script setup>
import AuthButton from '../components/AuthButton.vue'
import { useAuthStore } from 'stores/auth'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

import logoImage from 'src/assets/memories-Logo.png'
import logoText from 'src/assets/updatedLogo.png'

const router = useRouter()
const auth = useAuthStore()

const user = computed(() => auth.user)

const logout = () => auth.logout(router)
</script>

<template>
  <q-layout view="lHh Lpr lFf" style="background-color: #1e2538; color: white">
    <q-header
      class="text-white q-pa-lg"
      style="border-bottom: 1px solid gray; background-color: #1e2538"
    >
      <q-toolbar class="row justify-between">
        <router-link to="/" class="row items-center justify-start">
          <img :src="logoText" alt="logo-text" style="height: 60px" />
          <img :src="logoImage" alt="logo-image" style="height: 40px; margin-top: 2px" />
        </router-link>
        <AuthButton :user="user" :logout="logout" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  user: Object,
  logout: Function,
})

const menu = ref(false)
const router = useRouter()

const username = computed(() => props.user?.result?.username)

const goToProfile = () => {
  if (username.value) {
    router.push(`/${username.value}`)
    menu.value = false
  }
}

const goToMemories = () => {
  router.push('/my-memories')
  menu.value = false
}

const openMenu = () => {
  menu.value = true
}

watch(
  () => menu.value,
  (oldValue, newValue) => {
    menu.value = newValue
  },
)
</script>

<template>
  <div class="relative">
    <q-btn flat round size="md" class="q-mr-sm" @click="openMenu" v-if="user?.result?.profilePhoto">
      <q-avatar>
        <img :src="user.result.profilePhoto" alt="User Avatar" />
      </q-avatar>
    </q-btn>

    <q-btn flat round size="md" class="q-mr-sm text-white bg-green-600" @click="menu = true" v-else>
      {{ user?.result?.name?.charAt(0) }}
    </q-btn>

    <q-menu v-model="menu" anchor="bottom right" self="top right">
      <q-list style="min-width: 180px">
        <q-item clickable v-ripple @click="goToProfile">
          <q-item-section avatar>
            <q-icon name="manage_accounts" />
          </q-item-section>
          <q-item-section>Profile</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="goToMemories">
          <q-item-section avatar>
            <q-icon name="photo_library" />
          </q-item-section>
          <q-item-section>My Memories</q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable v-ripple @click="logout">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>Logout</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

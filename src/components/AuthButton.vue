<script setup>
import CustomDropdown from './CustomDropdown.vue'

defineProps({
  user: Object,
  logout: Function,
})
</script>

<template>
  <div class="row items-center justify-end q-gutter-md q-pa-none">
    <template v-if="user">
      <router-link to="/posts/create">
        <q-btn round flat class="bg-buttonColor text-textColor" size="md" icon="add" />
      </router-link>

      <CustomDropdown :user="user" :logout="logout" />
    </template>

    <template v-else>
      <router-link to="/auth">
        <q-btn
          color="primary"
          label="Sign In"
          style="height: 40px; padding: 0 16px; color: white; border-radius: 6px"
          unelevated
        />
      </router-link>
    </template>
  </div>
</template>

<style scoped>
.bg-buttonColor {
  background-color: #1e2538;
}
.text-textColor {
  color: #ffffff;
}
</style>

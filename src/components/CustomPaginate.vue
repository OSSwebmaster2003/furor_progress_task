<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostsStore } from 'src/stores/posts'

const route = useRoute()
const router = useRouter()
const store = usePostsStore()

const currentPage = computed({
  get: () => Number(route.query.page || 1),
  set: (val) => {
    router.push({ path: '/posts', query: { ...route.query, page: val } })
  },
})

const numberOfPages = computed(() => store.numberOfPages || 1)

watch(
  () => route.query.page,
  (newPage) => {
    if (newPage) {
      store.getPosts(Number(newPage))
    }
  },
  { immediate: true },
)

const onPageChange = (page) => {
  currentPage.value = page
}
</script>

<template>
  <div class="q-mt-md flex justify-end">
    <q-pagination
      v-model="currentPage"
      :max="numberOfPages"
      direction-links
      boundary-links
      icon-first="skip_previous"
      icon-last="skip_next"
      icon-prev="fast_rewind"
      icon-next="fast_forward"
      @update:model-value="onPageChange"
    />
  </div>
</template>

<style scoped>
.q-pagination {
  color: white;
}
</style>

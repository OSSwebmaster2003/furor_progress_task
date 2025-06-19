<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePostsStore } from 'stores/posts'

import CustomPaginate from 'src/components/CustomPaginate.vue'
import CustomPosts from 'src/components/CustomPosts.vue'
import CustomSearch from 'src/components/CustomSearch.vue'

const postsStore = usePostsStore()
const route = useRoute()
// const router = useRouter()

const tags = ref([])
const page = ref(Number(route.query.page || 1))
const searchQuery = ref(route.query.searchQuery || '')

watch(
  () => route.query,
  () => {
    page.value = Number(route.query.page || 1)
    searchQuery.value = route.query.searchQuery || ''
    postsStore.getPosts(page.value)
  },
  { immediate: true },
)

onMounted(() => {
  postsStore.getPosts(page.value)
})
</script>

<template>
  <div class="column q-px-xl" style="margin-top: 50px; margin-left: 12px">
    <CustomSearch />

    <CustomPosts />

    <div v-if="!searchQuery && tags.length === 0">
      <CustomPaginate :page="page" />
    </div>
  </div>
</template>

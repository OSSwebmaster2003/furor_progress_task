<script setup>
import { computed } from 'vue'
import { usePostsStore } from 'src/stores/posts'
import Post from './CustomPost.vue'

const store = usePostsStore()

const posts = computed(() => store.posts)
const isLoading = computed(() => store.isLoading)
</script>

<template>
  <div v-if="!posts.length && !isLoading" class="text-lg text-white">No Posts</div>

  <q-spinner v-else-if="isLoading" color="white" size="40px" />

  <div v-else class="row q-gutter-md bg-black q-pb-md q-pr-md rounded-lg post-grid">
    <div v-for="post in posts" :key="post._id">
      <Post :post="post" />
    </div>
  </div>
</template>

<style scoped>
.post-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.grid {
  display: grid;
}
</style>

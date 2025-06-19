<script setup>
import { computed } from 'vue'
import { usePostsStore } from 'src/stores/posts'
import Post from './CustomPost.vue'

// Props
const props = defineProps({
  setCurrentId: Function,
})

// Store
const store = usePostsStore()

const posts = computed(() => store.posts)
const isLoading = computed(() => store.isLoading)

const setCurrentId = (id) => {
  props.setCurrentId(id)
}
</script>

<template>
  <div v-if="!posts.length && !isLoading" class="text-lg text-white">No Posts</div>

  <q-spinner v-else-if="isLoading" color="white" size="40px" />

  <div v-else class="row q-gutter-md bg-black q-pb-md rounded-lg">
    <div v-for="post in posts" :key="post._id" class="col-3">
      <Post :post="post" @set-current-id="setCurrentId" />
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
}
</style>

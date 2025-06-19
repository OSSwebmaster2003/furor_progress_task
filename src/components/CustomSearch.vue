<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePostsStore } from 'stores/posts'
import TagsInput from './TagsInput.vue'

const search = ref('')
const tags = ref([])

const router = useRouter()
const postsStore = usePostsStore()

const searchPost = () => {
  if (search.value.trim() || tags.value.length) {
    const searchQuery = {
      search: search.value,
      tags: tags.value.join(','),
    }
    postsStore.getPostsBySearch(searchQuery)
    router.push({
      path: '/posts/search',
      query: {
        searchQuery: search.value || 'none',
        tags: tags.value.join(','),
      },
    })
  } else {
    router.push('/')
  }
}

const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    searchPost()
  }
}
</script>

<template>
  <div
    class="q-pb-md rounded-borders row q-col-gutter-md items-center q-mb-xl q-pr-md"
    style="background-color: black"
  >
    <div class="col-12 col-md-4">
      <q-input
        v-model="search"
        @keyup="handleKeyPress"
        filled
        placeholder="Search with words"
        input-class="text-white"
        style="background-color: #1e2538; border-radius: 5px"
      />
    </div>

    <div class="col-12 col-md-5">
      <TagsInput v-model:tags="tags" />
    </div>

    <div class="col-12 col-md-3">
      <q-btn
        label="Search"
        color="primary"
        class="full-width"
        @click="searchPost"
        size="lg"
        no-caps
      />
    </div>
  </div>
</template>

<style scoped>
.bg-mainColor {
  background-color: #f5f5f5;
}
</style>

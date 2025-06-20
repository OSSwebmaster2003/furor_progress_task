<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostsStore } from 'src/stores/posts'
import CommentSection from '../components/CommentSection.vue'
import moment from 'moment'

const route = useRoute()
const router = useRouter()
const store = usePostsStore()

const id = computed(() => route.params.id)
const post = computed(() => store.post)
const posts = computed(() => store.posts)
const isLoading = computed(() => store.isLoading)

const defaultImage =
  'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'

const recommendedPosts = computed(() => posts.value.filter((p) => p._id !== post.value?._id))

const openPost = (postId) => {
  router.push(`/posts/${postId}`)
}

// Fetch post and related on mount or when ID changes
watch(
  id,
  async () => {
    if (id.value) {
      await store.getPost(id.value)
      if (post.value) {
        await store.getPostsBySearch({
          search: 'none',
          tags: post.value.tags.join(','),
        })
      }
    }
  },
  { immediate: true },
)
</script>

<template>
  <q-page class="q-pa-md">
    <q-card v-if="!isLoading && post" class="bg-black text-white q-pa-md q-mb-xl">
      <div class="row q-col-gutter-lg q-mb-md">
        <!-- Left Column -->
        <div class="col-12 col-md-8">
          <div class="text-h4 text-weight-bold q-mb-sm">{{ post.title }}</div>

          <div class="text-subtitle2 text-green q-mb-sm">
            {{ post.tags.map((tag) => `#${tag}`).join(' ') }}
          </div>

          <div class="text-italic text-grey-5 q-mb-md">{{ post.message }}</div>

          <div class="text-subtitle1 q-mb-xs">
            Created by:
            <span class="text-primary cursor-pointer" @click="router.push(`/${post.username}`)">
              {{ post.username }}
            </span>
          </div>

          <div class="text-caption text-yellow-6">
            {{ moment(post.createdAt).fromNow() }}
          </div>

          <q-separator spaced color="white" />

          <div class="text-h6">Realtime Chat - coming soon!</div>

          <q-separator spaced color="white" />
        </div>

        <!-- Right Column -->
        <div class="col-12 col-md-4">
          <q-img
            :src="post.selectedFile || defaultImage"
            :alt="post.title"
            class="rounded-borders"
            style="max-height: 300px; object-fit: cover"
          />
        </div>
      </div>

      <CommentSection :post="post" />

      <!-- Recommendations -->
      <div v-if="recommendedPosts.length">
        <div class="text-h6 text-yellow-4 q-mt-xl q-mb-md">You might also like:</div>
        <div class="row q-col-gutter-md">
          <div
            v-for="rec in recommendedPosts"
            :key="rec._id"
            class="col-12 col-sm-6 col-md-4 cursor-pointer"
            @click="openPost(rec._id)"
          >
            <q-card class="bg-grey-9 text-white">
              <q-card-section>
                <div class="text-h6">{{ rec.title }}</div>
                <div class="text-caption text-primary">{{ rec.name }}</div>
                <div class="text-caption ellipsis-4-lines q-mt-sm">
                  {{ rec.message }}
                </div>
                <div class="text-caption text-yellow-6 q-mt-sm">Likes: {{ rec.likes.length }}</div>
              </q-card-section>
              <q-img :src="rec.selectedFile" class="aspect-video" />
            </q-card>
          </div>
        </div>
      </div>
    </q-card>

    <q-card v-else class="flex flex-center q-pa-xl bg-grey-9 text-white">
      <q-spinner size="70px" color="white" />
    </q-card>
  </q-page>
</template>

<style scoped>
.ellipsis-4-lines {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
.aspect-video {
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
</style>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePostsStore } from 'src/stores/posts'
import moment from 'moment'

const props = defineProps({
  post: Object,
})

const router = useRouter()
const store = usePostsStore()

const user = computed(() => {
  const profile = localStorage.getItem('profile')
  return profile ? JSON.parse(profile) : null
})

const userId = computed(() => user.value?.result?.sub || user.value?.result?._id)
const isCreator = computed(() => userId.value === props.post.creator)

const formattedDate = computed(() => moment(props.post.createdAt).fromNow())

const likeLabel = computed(() => {
  const likes = props.post.likes || []
  const count = likes.length

  if (count === 0) return 'Like'

  const isLiked = likes.includes(userId.value)
  if (isLiked) {
    return count > 2 ? `You and ${count - 1} others` : `${count} Like${count > 1 ? 's' : ''}`
  }

  return `${count} Like${count > 1 ? 's' : ''}`
})

const openPost = () => {
  router.push(`/posts/${props.post._id}`)
}

const goToUser = () => {
  router.push(`/${props.post.username}`)
}

const editPost = (id) => {
  router.push(`/posts/edit/${id}`)
}

const like = () => {
  store.likePost(props.post._id)
}

const deletePost = async () => {
  await store.deletePost(props.post._id)
  router.push('/')
}
</script>

<template>
  <q-card class="column justify-between q-pa-none bg-grey-10 text-white rounded-borders">
    <q-img
      :src="post.selectedFile"
      :alt="post.title"
      class="rounded-top aspect-video"
      @click="openPost"
    />

    <div class="top-left-10 text-white q-pa-sm">
      <h6 @click="goToUser" class="cursor-pointer" style="margin: 0">{{ post.username }}</h6>
      <div class="text-caption">{{ formattedDate }}</div>
    </div>

    <div v-if="isCreator" class="absolute-top-right text-white z-top">
      <q-btn icon="edit" flat round dense @click="editPost(post._id)" />
    </div>

    <div class="q-pa-sm text-positive text-caption">
      {{ post.tags.map((tag) => `#${tag}`).join(' ') }}
    </div>

    <div class="q-pa-sm">
      <div class="text-h6 text-white cursor-pointer" @click="openPost">
        {{ post.title }}
      </div>
    </div>

    <q-card-section class="q-pt-none q-px-sm">
      <div class="ellipsis-2-lines text-caption">{{ post.message }}</div>
    </q-card-section>

    <q-card-actions align="between" class="q-px-sm q-pb-sm">
      <q-btn
        v-if="post.likes.find((like) => like === userId)"
        flat
        dense
        icon="thumb_up"
        :label="likeLabel"
        @click="like"
        :disable="!user"
        class="text-primary"
      />
      <q-btn
        v-else
        flat
        dense
        icon="thumb_up_off_alt"
        :label="likeLabel"
        @click="like"
        :disable="!user"
        class="text-primary"
      />
      <q-btn
        v-if="isCreator"
        flat
        dense
        icon="delete"
        label="Delete"
        color="negative"
        @click="deletePost"
      />
    </q-card-actions>
  </q-card>
</template>

<style scoped>
.aspect-video {
  aspect-ratio: 16 / 9;
}
.ellipsis-2-lines {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.rounded-borders {
  border-radius: 8px;
}

.top-left-10 {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>

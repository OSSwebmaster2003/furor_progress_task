<script setup>
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { usePostsStore } from 'src/stores/posts'

const props = defineProps({
  post: Object,
})

const store = usePostsStore()
const router = useRouter()

const user = JSON.parse(localStorage.getItem('profile'))

const comment = ref('')
const comments = ref(props.post?.comments || [])
const commentsRef = ref(null)

const handleSubmit = async () => {
  const finalComment = {
    username: user?.result?.username,
    text: comment.value,
    creator: user?.result?._id,
  }

  const newComments = await store.commentPost(finalComment, props.post._id)

  comments.value = newComments
  comment.value = ''

  // Scroll to new comment
  nextTick(() => {
    commentsRef.value?.scrollIntoView({ behavior: 'smooth' })
  })
}
</script>

<template>
  <div class="q-my-md">
    <div class="row q-col-gutter-xl">
      <!-- Comment List -->
      <div class="col-grow">
        <div class="scroll q-pr-md" style="max-height: 200px; overflow-y: auto">
          <div class="text-h6 text-white q-mb-md">Comments</div>

          <div v-if="comments?.length">
            <div v-for="(c, i) in comments" :key="i" class="q-mb-sm">
              <q-btn
                flat
                dense
                class="text-left text-caption text-white"
                @click="router.push(`/${c.username}`)"
              >
                <strong class="text-buttonColor cursor-pointer"> {{ c.username }}: </strong>
                <span class="text-grey-5"> {{ c.text }}</span>
              </q-btn>
            </div>
          </div>
          <div v-else class="text-grey-5 text-caption q-ml-sm">No comments yet</div>

          <div ref="commentsRef" />
        </div>
      </div>

      <!-- Input -->
      <div v-if="user?.result?.name" class="col-12 col-md-4">
        <div class="text-white text-subtitle2 q-mb-sm">Leave a comment</div>

        <q-input
          v-model="comment"
          type="textarea"
          outlined
          borderless
          autogrow
          :rows="5"
          class="q-mb-md"
          color="white"
          input-class="text-white placeholder-white"
          label-color="white"
          label="Comment"
          style="background-color: #1e2538"
        />

        <q-btn
          label="Comment"
          class="full-width"
          color="primary"
          :disable="!comment"
          @click="handleSubmit"
        />
      </div>
    </div>
  </div>
</template>

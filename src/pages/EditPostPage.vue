<script setup>
import { computed, watch, ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostsStore } from 'src/stores/posts'

const route = useRoute()
const router = useRouter()
const store = usePostsStore()

const id = computed(() => route.params.id)
const post = computed(() => store.post)
const isLoading = computed(() => store.isLoading)

const user = JSON.parse(localStorage.getItem('profile'))

const postData = reactive({
  title: '',
  message: '',
  tags: [],
  selectedFile: '',
})

const tagsInput = ref('')

const isDisabled = computed(
  () => !postData.title || !postData.message || !postData.tags.length || !postData.selectedFile,
)

// onMounted(() => {
//   store.isLoading = false
// })

const handleTagSplit = () => {
  postData.tags = tagsInput.value
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

const clear = () => {
  Object.assign(postData, {
    title: '',
    message: '',
    tags: [],
    selectedFile: '',
  })
  tagsInput.value = ''
}

const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}

const fromBase64 = (base64String, fileName = 'file') => {
  const arr = base64String.split(',')
  const mimeMatch = arr[0].match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : ''
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], fileName, { type: mime })
}

const handleSubmit = async () => {
  const payload = { ...postData, name: user?.result?.name }

  if (postData.selectedFile) {
    const file = postData.selectedFile
    payload.selectedFile = await toBase64(file)
  }

  await store.updatePost(id.value, payload, router)

  clear()
}

watch(
  id,
  async () => {
    if (id.value) {
      await store.getPost(id.value)

      postData.title = post.value.title
      postData.message = post.value.message
      tagsInput.value = post.value.tags.join(',')
      handleTagSplit()
      postData.selectedFile = fromBase64(post.value.selectedFile)

      console.log(postData)
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex flex-center">
    <q-spinner v-if="isLoading" color="white" size="40px" />

    <q-form
      v-else
      class="q-pa-lg q-mt-xl bg-black text-white rounded-borders"
      style="max-width: 500px; width: 100%"
      @submit.prevent="handleSubmit"
    >
      <div class="text-h6 text-center q-mb-md">Edit a Memory</div>

      <q-input
        v-model="postData.title"
        placeholder="Title"
        outlined
        dense
        borderless
        @update:model-value="emitUpdate"
        input-class="text-white placeholder-white"
        label-color="white"
        color="white"
        style="background-color: #1e2538"
        class="q-mb-md"
      />

      <q-input
        v-model="postData.message"
        type="textarea"
        outlined
        borderless
        placeholder="Message"
        rows="6"
        class="q-mb-md"
        input-class="text-white placeholder-white"
        label-color="white"
        color="white"
        style="background-color: #1e2538"
      />

      <q-input
        v-model="tagsInput"
        outlined
        borderless
        placeholder="Tags (comma separated)"
        dense
        class="q-mb-md"
        @blur="handleTagSplit"
        input-class="text-white placeholder-white"
        label-color="white"
        color="white"
        style="background-color: #1e2538"
      />

      <q-file
        outlined
        v-model="postData.selectedFile"
        accept="image/*"
        input-class="text-white placeholder-white"
        label-color="white"
        color="white"
        style="background-color: #1e2538"
      >
        <template v-slot:prepend>
          <q-icon name="attach_file" color="white" />
        </template>
      </q-file>

      <q-btn
        :label="isLoading ? 'Editing...' : 'Edit'"
        type="submit"
        color="primary"
        class="full-width q-mb-sm q-mt-md"
        :disable="isDisabled"
      />

      <q-btn label="Clear" color="negative" class="full-width" @click="clear" type="button" />
    </q-form>
  </div>
</template>

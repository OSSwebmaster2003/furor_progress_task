<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePostsStore } from 'src/stores/posts'

const router = useRouter()
const store = usePostsStore()

const user = JSON.parse(localStorage.getItem('profile'))

const postData = reactive({
  title: '',
  message: '',
  tags: [],
  selectedFile: '',
})

const tagsInput = ref('')

const isLoading = computed(() => store.isLoading)

const isDisabled = computed(
  () => !postData.title || !postData.message || !postData.tags.length || !postData.selectedFile,
)

// Load post for editing
onMounted(() => {
  store.isLoading = false
})

// Convert comma string into array
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

const handleSubmit = async () => {
  const payload = { ...postData, name: user?.result?.name }

  if (postData.selectedFile) {
    const file = postData.selectedFile
    payload.selectedFile = await toBase64(file)
  }

  await store.createPost(payload, router)

  clear()
}
</script>

<template>
  <div class="flex flex-center">
    <q-form
      class="q-pa-lg q-mt-xl bg-black text-white rounded-borders"
      style="max-width: 500px; width: 100%"
      @submit.prevent="handleSubmit"
    >
      <div class="text-h6 text-center q-mb-md">Create a Memory</div>

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

      <!-- <q-file
        filled
        label="Upload Image"
        accept="image/*"
        @change="handleFileUpload"
        class="q-mb-md"
      /> -->
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
        :label="isLoading ? 'Creating...' : 'Create'"
        type="submit"
        color="primary"
        class="full-width q-mb-sm q-mt-md"
        :disable="isDisabled"
      />

      <q-btn label="Clear" color="negative" class="full-width" @click="clear" type="button" />
    </q-form>
  </div>
</template>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}
</style>
